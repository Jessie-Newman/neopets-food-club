document.addEventListener('DOMContentLoaded', function () {
  const copyBetsButton = document.querySelector('#copy-bets');
  const betOverride = document.querySelector('#bet-override');
  const placeBets = document.querySelector('#place-bets');
  copyBetsButton.addEventListener('click', function(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({
      command: "run",
      placeBets: placeBets.checked,
      betOverride: betOverride.value
    }, function(response) {
      console.log(response);
    });
  });

  const betAmountHelpButton = document.querySelector('#bet-amount-help-button');
  const betAmountHelpText = document.querySelector('#bet-amount-help-text')
  betAmountHelpButton.addEventListener('click', function(event) {
    placeBetsHelpText.hidden = true
    betAmountHelpText.hidden = !(betAmountHelpText.hidden)
  });

  const placeBetsHelpButton = document.querySelector('#place-bets-help-button');
  const placeBetsHelpText = document.querySelector('#place-bets-help-text');
  placeBetsHelpButton.addEventListener('click', function(event) {
    betAmountHelpText.hidden = true
    placeBetsHelpText.hidden = !(placeBetsHelpText.hidden)
  });
});
