import{
        csv
       } from 'd3';

/*
//generate the data
let features = ["A","B","C","D","E","F","G"];
let data = [];

for (var i = 0; i < 3; i++){
    var point = {}
    //each feature will be a random number from 1-9
    features.forEach(f => point[f] = 1 + Math.random() * 8);
    data.push(point);
}
*/

const radar = (data,features) => {
  let svg = d3.select("body").append("svg")
      .attr("width", 700)
      .attr("height", 500);
  
  let colors = ["#978F80", "#8E6C8A", "#137B80", "#E6842A", "#E3BA22"];
//  let colors = ["#003F5C", "#58508D", "#bc5090", "#ff6361", "#ffa600"];
  const height = svg.attr('height');
  const width = svg.attr('width');
  const margin = { top: 40, bottom: 40, left: 40, right: 20 };
  const maxRadius = (height - margin.top - margin.bottom) / 2;
  const numTicks = 5;
  const domainSize = 1;
  const labelBuffer= .1;

  //define over and out
  var over = "ontouchstart" in window ? "touchstart" : "mouseover";
  var out = "ontouchstart" in window ? "touchend" : "mouseout";

  //Draw Circles
  let radialScale = d3.scaleLinear()
      .domain([0,domainSize])
      .range([0, maxRadius]);

  let ticks = []
  for (var i = 1; i <= numTicks; i++) {
    ticks.push(i/numTicks*domainSize);
  }

  ticks.forEach(t =>
      svg.append("circle")
      .attr("cx", maxRadius + margin.left)
      .attr("cy", maxRadius + margin.top)
      .attr("fill", "none")
      .attr('class','axis-line')
      .attr("stroke-width", 1.5)
      .attr("r", radialScale(t))
  );
  /*
  ticks.forEach(t =>
      svg.append("text")
      .attr("x", 305)
      .attr("y", 300 - radialScale(t))
      .text(t.toString())
  );
  */

  //Plot Axis
  function angleToCoordinate(angle, value){
      let x = -Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);
      return {"x": maxRadius + margin.left + x, "y": maxRadius + margin.top - y};
  }

  for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
      let line_coordinate = angleToCoordinate(angle, domainSize);
      let label_coordinate = angleToCoordinate(angle, domainSize + labelBuffer);

      //draw axis line
      svg.append("line")
        .attr("x1", maxRadius + margin.left)
        .attr("y1", maxRadius + margin.top)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr('class','axis-line');

      //draw axis label

      svg.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .attr('class','axis-label')
        .text(ft_name);
  }

  //Plot Data
  let line = d3.line()
      .x(d => d.x)
      .y(d => d.y);

  function getPathCoordinates(data_point){
      let coordinates = [];
      for (var i = 0; i < features.length; i++){
          let ft_name = features[i];
          let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
          coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      };
    
      coordinates.push(angleToCoordinate(
        (Math.PI / 2) + (2 * Math.PI * 0 / features.length), 
        data_point[features[0]]));

      return coordinates;
  };
  
  const legendBox = 25;
  const legendSpacing = 3;
  const legendMargin = 20;
  const legendYStart = maxRadius + margin.top + data.length * (legendBox + legendSpacing) / 2;
  
  for (var i = 0; i < data.length; i ++){
      let d = data[i];
      let color = colors[i];
      let coordinates = getPathCoordinates(d);
    
      //draw legend
      svg.append("rect")
    		.attr("id", `path${i}`)
        .attr('fill',color)
        .attr('width', legendBox)
        .attr('height', legendBox)
        .attr('x', (margin.left + maxRadius) * 2 + legendMargin)
        .attr('y', legendYStart - i * (legendBox + legendSpacing));
    
      svg.append('text')
    		.attr("id", `path${i}`)
        .attr('x', (margin.left + maxRadius) * 2 + legendBox + 1.5 * legendMargin)
        .attr('y', legendYStart + legendBox/2 - i * (legendBox + legendSpacing))
        .attr('class', 'legend')
        .text(data[i].ID);
    
      //draw the path element fill 
      svg.append("path")
        .datum(coordinates)
        .attr("d",line)
        .attr("fill", color)
        .attr("fill-opacity", 0.3)
        .attr("class", "radarArea")
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("stroke-opacity", 0.7)
        .attr("stroke-linejoin", "round")
    		.on(over, function(d){
        	tooltipShow;
        	svg.selectAll(".radarArea")
        		.transition(250)
        			.attr("fill-opacity", 0.1)
        			.attr("stroke-opacity", 0.2);
        	d3.select(this)
        		.transition(250)
        			.attr("fill-opacity", 0.7)
        			.attr("stroke-opacity", 0.9);
      	})
    		.on(out, function(d){
        	tooltipHide;
        	svg.selectAll(".radarArea")
        		.transition(250)
        			.attr("fill-opacity",0.3)
        			.attr("stroke-opacity", 0.7);
      });
  };
  function tooltipShow(d){

  };
  function tooltipHide(d){
    
  };
};



csv("data.csv").then(data => {
  data.forEach(d=>{
    d.A = +d.A;
    d.B = +d.B;
    d.C = +d.C;
    d.D = +d.D;
    d.E = +d.E;
    d.F = +d.F;
    d.G = +d.G;
    d.H = +d.H;
    d.I = +d.I;
    d.J = +d.J;
    d.K = +d.K;
    d.L = +d.L;
    d.M = +d.M;
    d.N = +d.N;
    d.O = +d.O;
    d.P = +d.P;
    d.Q = +d.Q;
    d.R = +d.R;
    d.S = +d.S;
  });
  var features = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S"];
/*  
  var features = [];
  for(property in data[0]) {
    if(property !== 'ID') {
        features.push({Name: property});
    }
}
		console.log(features[0]);
*/
    radar(data,features);
})

  document.getElementById('path1')
    .addEventListener('hover', function(e) {
    e.currentTarget.setAttribute('fill', '#ff00cc');
  });
