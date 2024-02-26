document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#copy-bets');
  const placeBets = document.querySelector('#place-bets');
  const maxBetOverride = document.querySelector('#max-bet-override');

  button.addEventListener('click', function(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({
      command: "run",
      placeBets: placeBets.checked,
      maxBetOverride: maxBetOverride.value
    }, function(response) {
      console.log(response);
    });
  });
});
