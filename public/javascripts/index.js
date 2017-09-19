
// Replace with environment variable before production
let alphaAdvantageKey = 'MCVCJGWR900F07S6';

// Function runs on page load to populate chart with at least 1 stock ticker
window.onload = function() {
  let symbol = 'MSFT';
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + 
                  symbol + '&outputsize=compact&apikey=' + alphaAdvantageKey, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function() {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
      }
      else {
          console.error("you suck: API request function");
      }
  }
  xhr.send();
}


function search() {
  let symbol = document.getElementById('tickerInput').value;
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + 
                  symbol + '&outputsize=compact&apikey=' + alphaAdvantageKey, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function() {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
      }
      else {
          console.error("you suck: API request function");
      }
  }
  xhr.send();
}