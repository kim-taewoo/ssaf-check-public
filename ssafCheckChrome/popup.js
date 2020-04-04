document.addEventListener('DOMContentLoaded', function () {
  const dividerInput = document.querySelector('#divider')
  dividerInput.value = '마 감';

  document.querySelector('#quizBtn').addEventListener('click', quiz, false);
  const content = document.querySelector('#content');

  function quiz() {
    const listNow = document.querySelector('#content-list');
    listNow.innerHTML = "";
    content.innerHTML = `<div>필터링 중...</div>`
    const divider = document.querySelector('#divider').value;
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { "msg": "quiz", "divider": divider }, withResponse);
      }
    )
  }

  function UI() { };

  UI.prototype.addMemberToList = function (member) {
    const list = document.querySelector('#content-list');
    const row = document.createElement('div');
    row.innerHTML = `<div class="">${member.name}</div>`;
    list.appendChild(row);
  }

  function withResponse(res) {
    content.innerHTML = `<div><span class="text-danger">${res.cnt}</span> 명이 아직 체크하지 않았습니다!</div>`;
    ui = new UI();
    for (const member of res.data) {
      ui.addMemberToList(member);
    }
  }
})