   var columnHolder=[];
   var dataHolder=[];
   



const socket = new WebSocket('wss://'+window.location.host+'/ws');
    function parseCSVFile(file) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                const data = results.data;
               // console.log(data[0])
                generateTable(data);
            },
            error: function (error) {
                console.error('Error parsing CSV file:', error.message);
            }
        });
    }

function parseCSVFileret(file) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                const data = results.data;
                return data[0];
            },
            error: function (error) {
                console.error('Error parsing CSV file:', error.message);
            }
        });
    }

    
// Wait for the WebSocket connection to open
socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened");
    const message = "Progress";
    
    // Send the message to the server
    //socket.send(message);

});



// Wait for the WebSocket connection to open
socket.addEventListener("message", (event) => {
    console.log("WebSocket connection opened");
//    const message = "Progress";
     
     parseCSVFile(JSON.parse(event.data)['csvData']); 
    dataHolder=uploadTable(0);
    console.log(dataHolder);
   // console.log(dataHolder);
    // Send the message to the server
  //  socket.send(message);

});
















    function generateTable(data) {
        const table = document.getElementById("myTable");
        table.innerHTML="";
        const headers = Object.keys(data[0]);

        // Create table headers
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        headers.forEach(headerText => {
            var th = document.createElement("th");
            th.appendChild(document.createTextNode(headerText));
            th.onclick = function() {
                 
       //     headerText.classList.remove('clicked');
            th.classList.toggle('clicked');
               
                
                sortTable(headers.indexOf(headerText),headerText);

            };
            th.contentEditable=true;
            headerRow.appendChild(th);
        });

        // Create table rows
        const tbody = table.createTBody();
        data.forEach(rowData => {
            const row = tbody.insertRow();
            headers.forEach(header => {
                const cell = row.insertCell();
//                console.log(rowData[header]);
                cell.appendChild(document.createTextNode(rowData[header]));
            });
        });

    return table;

    }







     // Function to create a scatter plot with dynamic columns
  
   




    // You can add JavaScript code here if needed
    function sortTable(columnIndex,headerText) {
        console.log(headerText,columnHolder.length);
        columnHolder.push(headerText);
        if(columnHolder.length==2){
        createScatterPlot(columnHolder[0],columnHolder[1]);            
        }

        // ... (same as previous examples)
    }
//   var table;
  document.getElementById('csvForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const csvData = formData.get('csvData');
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const fileContent = e.target.result;

     generateTable(d3.csvParse(fileContent));
      }        
            reader.readAsBinaryString(file);
    }

    });
  
  function uploadTable(ret){

    var table = d3.select('#myTable');
     var headers = table.select('thead')
                    .selectAll('th')
                    .nodes()
                    .map(function (th) {
                      return th.textContent;
                    });
     
  // Extract data rows
  var rows = table.select('tbody')
                  .selectAll('tr')
                  .nodes()
                  .map(function (tr) {
                    return Array.from(tr.cells).map(function (td) {
                      if(td.textContent.includes(',')){ 
                      var numquoit=td.textContent;
                       if( !numquoit.startsWith('"')){
//                      console.log(td.textContent)
                        return String("\""+td.textContent.replace(/"/g,'')+"\"")}
                      
                       }
                      return td.textContent;
                    });
                  });

 var csvContent = [headers.join(',')];
  csvContent.push.apply(csvContent, rows.map(row => row.join(',')));
  var csvString = csvContent.join('\n');
 // console.log(csvString);
        // Append file content to the CSV data
     //   socket.addEventListener('open', function () {
      const  csvData={'csvData':csvString};
    //  console.log(csvString);
        var jsoncsv=JSON.stringify(csvData);
          if(ret===1){
          socket.send(jsoncsv);
           } else{
            return d3.csvParse( csvString);
          }
//        });
      }



