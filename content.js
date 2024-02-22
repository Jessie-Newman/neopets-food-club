document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelector('button');
  button.addEventListener('click', function(event) {
    event.preventDefault();
    var table = document.getElementById('textarea').value;
    chrome.runtime.sendMessage({
      command: "parse",
      table: table,
    }, function(response) {
      console.log(response);
    });
  });
});
