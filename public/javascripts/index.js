
// Replace with environment variable before production
let alphaAdvantageKey = 'MCVCJGWR900F07S6';
// let alphaAdvantageKey = process.env.KEY;
var runningChartDataObject = {
  labels: '',
  datasets: []
};

// Function runs on page load to populate chart with at least 1 stock ticker
window.onload = function() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=compact&apikey=' + alphaAdvantageKey, true);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.onload = function() {
      if (xhr.status === 200) {
        let responseObject = JSON.parse(xhr.responseText);
        // Restructure the shape of the API response to build the chart
        let close = "4. close";
        let key = 'Time Series (Daily)';
        let metadata = 'Meta Data';
        let datesArray = Object.getOwnPropertyNames(responseObject[key]);
        let metadataArray = Object.values(responseObject[metadata]);
        let newArray = Object.values(responseObject[key])
        let dataArray = [];
        newArray.forEach(function(element) {
          dataArray.push(element[close]);
        });
        
        runningChartDataObject.labels = datesArray;
        runningChartDataObject.datasets.push( {label: metadataArray[1], data: dataArray, borderWidth: 1, fill: false, borderColor: '#228b22' });

        let dataToSocket = JSON.stringify(runningChartDataObject);

        // Fire data off the socket
        var socket = io();
        socket.emit("search result", dataToSocket);
        socket.on('search result', function(search){
          let socketObject = JSON.parse(search);
          buildChart(socketObject);
        });
        createStockCard('MSFT');
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
        let responseObject = JSON.parse(xhr.responseText);
        // Restructure the shape of the API response to build the chart
        let close = "4. close";
        let key = 'Time Series (Daily)';
        let metadata = 'Meta Data';
        let datesArray = Object.getOwnPropertyNames(responseObject[key]);
        let metadataArray = Object.values(responseObject[metadata]);
        let newArray = Object.values(responseObject[key])
        let dataArray = [];
        newArray.forEach(function(element) {
          dataArray.push(element[close]);
        });
        
        runningChartDataObject.labels = datesArray;
        runningChartDataObject.datasets.push( {label: metadataArray[1], data: dataArray, borderWidth: 1, fill: false, borderColor: generateColor() });

        let dataToSocket = JSON.stringify(runningChartDataObject);

        // Fire data off the socket
        let socket = io();
        socket.emit("search result", dataToSocket);
        socket.on('search result', function(search){
          let socketObject = JSON.parse(search);
          buildChart(socketObject);
        });
        createStockCard(symbol);
      }
      else {
        console.error("you suck: API request function");
      }
    }
    xhr.send();    
}


// ChartJS code
function buildChart(socketObject) {
  let ctx = document.getElementById("myChart");
  let myChart = new Chart(ctx, {
      type: 'line',
        data: {
          labels: socketObject.labels,
          datasets: socketObject.datasets
        }
      }
  );
}

// Generate random colors for data lines
function generateColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


// Create and append stock card
function createStockCard(symbol) {
  let stockCard = document.createElement("div");
  let stockRow = document.getElementById('stockDisplay');
  stockCard.innerHTML = '<h4>' + symbol + '</h4>';
  stockCard.onclick = function() {
    deleteStock(symbol)
    let deleteChild = this;
    deleteChild.parentNode.removeChild(deleteChild);
    return false;
  };
  stockRow.appendChild(stockCard);
}


// Remove stock from row of cards, chart, and socket
function deleteStock(symbol) {
  for (let i = 0; i < runningChartDataObject.datasets.length; i++) {
    if (runningChartDataObject.datasets[i].label === symbol) {
      runningChartDataObject.datasets.splice(i, 1);
    }
  }
  let dataToSocket = JSON.stringify(runningChartDataObject);
  
  // Fire data off the socket
  let socket = io();
  socket.emit("search result", dataToSocket);
  socket.on('search result', function(search){
    let socketObject = JSON.parse(search);
    buildChart(socketObject);
  }); 
}
