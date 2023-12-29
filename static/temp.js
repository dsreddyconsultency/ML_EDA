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







   var columnHolder=[];
   var dataHolder=[];
     // Function to create a scatter plot with dynamic columns
  function createScatterPlot(xColumnName, yColumnName) {
    //console.log(dataHolder[xColumnName]);
 //   const leftPane = d3.select('#scatterplot');
   
// Set up the SVG container
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 900 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select('#scatterplot')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create scales for X and Y axes
  const xScale = d3.scaleLinear()
    .domain([1,dataHolder.length])//d3.max(dataHolder, d => d[xColumnName])])
    .range([0, width]);
   console.log(d3.max(dataHolder, d => d[xColumnName]));
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataHolder, d => d[yColumnName])])
    .range([height, 0]);
//   console.log(d3.max(dataHolder, d => d[yColumnName])); 

  const colorScale=d3.scaleOrdinal()
   .domain([0,1])
   .range(['red','blue']);





  // Create X axis
  const xAxis = d3.axisBottom(xScale);
  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  // Create Y axis
  const yAxis = d3.axisLeft(yScale);
  svg.append('g')
    .attr('class', 'axis')
    .call(yAxis);

  // Create circles for each data point
  svg.selectAll('circle')
    .data(dataHolder)
    .enter()
    .append('circle')
    .attr('class', 'dot') // Apply the dot class for styling
    .attr('cx',(_,i)=>xScale(i)) //d => xScale(d[xColumnName]))
    .attr('cy', d => yScale(d[yColumnName]))
    .attr('r', d => d.r || 1)
    .attr("fill",d=>colorScale(d[xColumnName])); // Radius, default to 5 if not specified
   }


   




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






    
//        socket.send(csvData);

//  });  
  
  
  
  
  
  
  //  function uploadFile() {
    //    const fileInput = document.getElementById('fileInput');
   //     const file = fileInput.files[0];
 //        var DataFrame = dfjs.DataFrame;
      //   fileInput.preventDefault();

//    const formData = new FormData(fileInput.target);
 //   const csvData = formData.get('csvData');
   // socket.send(csvData);


/*        if (file) {

            const formData = new FormData();
            formData.append('fileInput', file);
            try{
             socket.send(formData);
            } catch (error) {
            console.error('Error fetching or parsing POST data:', error);
        }   
*/
//           try {
   /*         const response =  fetch('/upload', {
                method: 'POST',
                body: formData,
            }).then(response => response.text())
            .then(message => {
               // console.log(message);
                parseCSVFile(message);
                dataHolder=d3.csvParse(message);
               // console.log(dataHolder);
                // You can handle the server's response here
            })
            .catch(error => console.error('Error:', error));
     */  
          
/*        } catch (error) {
            console.error('Error fetching or parsing POST data:', error);
        }          
*/




//        }

