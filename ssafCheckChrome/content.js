const members = [
  { name: '강재구' },
  { name: '고경득' },
  { name: '공태경' },
  { name: '김주현' },
  { name: '김태우' },
  { name: '나윤지' },
  { name: '박선환' },
  { name: '박유은' },
  { name: '박준일' },
  { name: '박춘화' },
  { name: '신영찬' },
  { name: '신채린' },
  { name: '오지수' },
  { name: '이종혁' },
  { name: '장현준' },
  { name: '전은정' },
  { name: '정윤환' },
  { name: '정형수' },
  { name: '조진환' },
  { name: '조항래' },
  { name: '차영부' },
  { name: '홍주표' },
  { name: '황수민' },
];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'quiz') {
    const posts = document.querySelectorAll('.post__content');
    const data = Array.from(posts).map(p => {
      const name = p.querySelector('button.user-popover').innerText;
      const time = p.querySelector('.post__time').innerText;
      const msg = p.querySelector('.post-message__text').innerText;

      return {
        name,
        time,
        msg,
      };
    });

    const membersDone = [];

    for (let i = data.length - 4; i >= 0; i--) {
      if (data[i].msg.indexOf(request.divider) > -1 || (data[i].time.slice(0, 2) === "오후" && data[i].time.slice(3, 4) >= 6)) {
        break;
      } else {
        membersDone.push(data[i].name.slice(0, 3));
      }
    }
    const membersNotDone = members.filter((member) => membersDone.indexOf(member.name) === -1);

    const response = {};
    response.cnt = membersNotDone.length;
    response.data = membersNotDone;

    sendResponse(response);
  }
})