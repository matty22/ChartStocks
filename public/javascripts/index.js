
// Replace with environment variable before production
let alphaAdvantageKey = 'MCVCJGWR900F07S6';

// Function runs on page load to populate chart with at least 1 stock ticker
// window.onload = function() {
//   let symbol = 'MSFT';
//   let xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + 
//                   symbol + '&outputsize=compact&apikey=' + alphaAdvantageKey, true);
//   xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
//   xhr.onload = function() {
//       if (xhr.status === 200) {
//         // console.log(xhr.responseText);
//       }
//       else {
//           console.error("you suck: API request function");
//       }
//   }
//   xhr.send();
// }


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
        let datesArray = Object.getOwnPropertyNames(responseObject[key]);
        let newArray = Object.values(responseObject[key])
        let dataArray = [];
        newArray.forEach(function(element) {
          dataArray.push(element[close]);
        });
        
        let dataToSocket = JSON.stringify([datesArray, dataArray]);

        // Fire data off the socket
        var socket = io();
        socket.emit("search result", dataToSocket);
        socket.on('search result', function(search){
          let socketObject = JSON.parse(search);
          buildChart(socketObject[0], socketObject[1]);
          return false;
        });

        // Build the chart
        // buildChart(datesArray, dataArray);

        }
        else {
          console.error("you suck: API request function");
        }
      }
      xhr.send();    
  }


// ChartJS code
function buildChart(datesArray, dataArray) {
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
      type: 'line',
        data: {
          labels: datesArray,
          datasets: [{
            label: 'AAPL',
            data: dataArray,
            borderWidth: 1,
            fill: false,
            borderColor: '#ff0000'
          }]
        }
      }
  );
}