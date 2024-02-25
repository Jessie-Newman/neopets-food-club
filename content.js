document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelector('button');
  button.addEventListener('click', function(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({
      command: "parse",
    }, function(response) {
      console.log(response);
    });
  });
});
