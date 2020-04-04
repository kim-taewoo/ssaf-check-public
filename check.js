const chalk = require('chalk');
const yargs = require('yargs')

const members = require('./members');
const scrapePosts = require('./scrapePosts');
const log = console.log;

yargs.version('1.1.0')

yargs.command({
  command: 'mattermost',
  describe: 'Mattermost Check',
  builder: {
    divider: {
      describe: 'Last End message substring.',
      type: 'string'
    }
  },
  handler: function (argv) {
    scrape(argv.divider);
  }
})

yargs.command({
  command: 'mattermost-log',
  describe: 'Detailed log of mattermost',
  builder: {
    divider: {
      describe: 'Last End message substring.',
      type: 'string'
    }
  },
  handler: function (argv) {
    scrapeLog(argv.divider);
  }
})


const formatTime = () => {
  const now = new Date();
  const hour = now.getHours();
  return `${hour >= 12 ? '오후' : '오전'} ${hour % 12}시 ${now.getMinutes()}분`
}


const scrape = async (divider = '마 감') => {
  const data = await scrapePosts();

  const membersDone = [];

  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].msg.indexOf(divider) > -1 || (data[i].time.slice(0, 2) === "오후" && data[i].time.slice(3, 4) >= 6)) {
      break;
    } else {
      membersDone.push(data[i].name.slice(0, 3));
    }
  }

  log(chalk.blue('Filtering...'));
  const membersNotDone = members.filter((member) => membersDone.indexOf(member.name) === -1);
  log();
  log(`현재 시간 ${chalk.black.bgWhite(formatTime())}`);
  log()
  if (membersNotDone.length === 0) {
    log(chalk.bgGreen('모두 체크했네요!'));
  } else {
    log(chalk.white.bgRed(` ${membersNotDone.length} 명이 아직 체크하지 않았습니다! `));
    log();
    for (const member of membersNotDone) {
      log(chalk.red(member.name) + '\t' + chalk.bgBlack(member.phone));
    }
  }
};


const scrapeLog = async (divider = '마 감') => {
  const data = await scrapePosts();

  log(`현재 시간 ${chalk.black.bgWhite(formatTime())}`);
  log();
  let cnt = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].msg.indexOf(divider) > -1 || (data[i].time.slice(0, 2) === "오후" && data[i].time.slice(3, 4) >= 6)) {
      break;
    } else {
      log(`${++cnt}\t${chalk.magenta(data[i].name)}\t\t${chalk.cyan(data[i].time)}\t${data[i].msg}`);
    }
  }
}

yargs.parse();