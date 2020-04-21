function quiz() {
  const listNow = document.querySelector('#content-list');
  listNow.innerHTML = '';
  content.innerHTML = `<div>필터링 중...</div>`;
  const divider = document.querySelector('#divider').value;
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { msg: 'quiz', divider: divider },
      withResponse
    );
  });
}

const formatTime = () => {
  const now = new Date();
  const hour = now.getHours();
  return `${hour >= 12 ? '오후' : '오전'} ${hour % 12}시 ${now.getMinutes()}분`;
};

function UI() {}

UI.prototype.addMemberToList = function (member) {
  const list = document.querySelector('#content-list');
  const row = document.createElement('div');
  row.innerHTML = `<div class="">${member.name}</div>`;
  list.appendChild(row);
};

function withResponse(res) {
  content.innerHTML = `
    <div>
      <div>현재시간: ${formatTime()}</div>
      <hr class="my-1">
      <span class="text-danger">${res.cnt}</span> 명이 아직 체크하지 않았습니다!
    </div>
  `;
  ui = new UI();
  for (const member of res.data) {
    ui.addMemberToList(member);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const dividerInput = document.querySelector('#divider');
  dividerInput.value = '마 감';

  document.querySelector('#divider').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      quiz();
    }
  });

  document.querySelector('#quizBtn').addEventListener('click', quiz, false);
  const content = document.querySelector('#content');
});
