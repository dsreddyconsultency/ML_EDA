

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 900 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg1 = d3.select('#scatterplot');/*
   .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  /*  .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

//  let LineStart=null;
*/






function createScatterPlot(xColumnName, yColumnName) {
    //console.log(dataHolder[xColumnName]);
 //   const leftPane = d3.select('#scatterplot');
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 900 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select('#scatterplot')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
 





// Set up the SVG container
  // Create scales for X and Y axes
  const xScale = d3.scaleLinear()
    .domain([0,dataHolder.length])//d3.max(dataHolder, d => d[xColumnName])])
    .range([0, width]);
 //  console.log(d3.max(dataHolder, d => d[xColumnName]));
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataHolder, d => d[yColumnName])])
    .range([height, 0]);
//   console.log(d3.max(dataHolder, d => d[yColumnName])); 

  const colorScale=d3.scaleOrdinal()
   .domain([0,1])
   .range(['red','blue']);



  let drawing=false;

svg1.on('mousedown', function(event) {
    drawing = true;

    // Get the mouse position
    const [x, y] = d3.pointer(event);
    
    // Draw a circle at the mouse position
    svg1.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 2) // Radius of the circle
      .attr('fill', 'black');
  });

   svg1.on('mousemove', function(event) {
    if (drawing) {
      // Get the mouse position
      const [x, y] = d3.pointer(event);
      console.log(xScale.invert(x-40), yScale.invert(y-20));
          svg1.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 2) // Radius of the circle
      .attr('fill', 'black');


      // Draw a line from the previous mouse position to the current position
  /*    svg1.append('line')
        .attr('x1', d3.event.x)
        .attr('y1', d3.event.y)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);*/
    }
  });

  // Handle mouse release event
  svg1.on('mouseup', function() {
    drawing = false;
  });































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

