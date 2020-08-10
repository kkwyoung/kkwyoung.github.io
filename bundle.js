(function () {
	'use strict';

	/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

	  ////////////////////////////////////////////////////////////// 
	  //////////////////////// Set-Up ////////////////////////////// 
	  ////////////////////////////////////////////////////////////// 

	  var margin = {top: 100, right: 100, bottom: 100, left: 100},
	    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
	    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	  ////////////////////////////////////////////////////////////// 
	  ////////////////////////// Data ////////////////////////////// 
	  ////////////////////////////////////////////////////////////// 

	  var data = [
	        [//iPhone
	        {axis:"Battery Life",value:0.22},
	        {axis:"Brand",value:0.4},
	        {axis:"Contract Cost",value:0.29},
	        {axis:"Design And Quality",value:0.17},
	        {axis:"Have Internet Connectivity",value:0.22},
	        {axis:"Large Screen",value:0.02},
	        {axis:"Price Of Device",value:0.21},
	        {axis:"To Be A Smartphone",value:0.50}			
	        ],[//Samsung
	        {axis:"Battery Life",value:0.27},
	        {axis:"Brand",value:0.16},
	        {axis:"Contract Cost",value:0.35},
	        {axis:"Design And Quality",value:0.13},
	        {axis:"Have Internet Connectivity",value:0.20},
	        {axis:"Large Screen",value:0.13},
	        {axis:"Price Of Device",value:0.35},
	        {axis:"To Be A Smartphone",value:0.38}
	        ],[//Nokia Smartphone
	        {axis:"Battery Life",value:0.26},
	        {axis:"Brand",value:0.10},
	        {axis:"Contract Cost",value:0.30},
	        {axis:"Design And Quality",value:0.14},
	        {axis:"Have Internet Connectivity",value:0.22},
	        {axis:"Large Screen",value:0.04},
	        {axis:"Price Of Device",value:0.41},
	        {axis:"To Be A Smartphone",value:0.30}
	        ]
	      ];
	  ////////////////////////////////////////////////////////////// 
	  //////////////////// Draw the Chart ////////////////////////// 
	  ////////////////////////////////////////////////////////////// 

	  var color = d3.scaleOrdinal()
	    .range(["#EDC951","#CC333F","#00A0B0"]);

	  var radarChartOptions = {
	    w: width,
	    h: height,
	    margin: margin,
	    maxValue: 0,
	    levels: 5,
	    roundStrokes: true,
	    color: color
	  };

	  //Callfunction to draw the Radar chart
	  RadarChart(".radarChart", data, radarChartOptions);


	/////////////////////////////////////////////////////////
	/////////////// The Radar Chart Function ////////////////
	/////////////// Written by Nadieh Bremer ////////////////
	////////////////// VisualCinnamon.com ///////////////////
	/////////// Inspired by the code of alangrafu ///////////
	/////////////////////////////////////////////////////////
		
	function RadarChart(id, data, options) {
		var cfg = {
		 w: 600,				//Width of the circle
		 h: 600,				//Height of the circle
		 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
		 levels: 3,						//How many levels or inner circles should there be drawn
		 maxValue: 0, 				//What is the value that the biggest circle will represent
		 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
		 wrapWidth: 60, 			//The number of pixels after which a label needs to be given a new line
		 opacityArea: 0.35, 	//The opacity of the area of the blob
		 dotRadius: 4, 				//The size of the colored circles of each blog
		 opacityCircles: 0.1, 	//The opacity of the circles of each blob
		 strokeWidth: 2, 			//The width of the stroke around each blob
		 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
		 color: d3.scaleOrdinal(d3.schemeCategory10) 		//d3.scaleOrdinal().range(schemeCategory10)	//Color function
		};
		
		//Put all of the options into a variable called cfg
		if('undefined' !== typeof options){
		  for(var i in options){
			if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
		  }//for i
		}//if
		
		//If the supplied maxValue is smaller than the actual one, replace by the max in the data
		var maxValue = 
	      Math.max(
	        cfg.maxValue, 
	        d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
			
		var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
			total = allAxis.length,					//The number of different axes
			radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
			Format = d3.format(".0%"),			 	//Percentage formatting
			angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
		
		//Scale for the radius
		var rScale = d3.scaleLinear()
			.range([0, radius])
			.domain([0, maxValue]);
			
		/////////////////////////////////////////////////////////
		//////////// Create the container SVG and g /////////////
		/////////////////////////////////////////////////////////

		//Remove whatever chart with the same id/class was present before
		d3.select(id).select("svg").remove();
		
		//Initiate the radar chart SVG
		var svg = d3.select(id).append("svg")
				.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
				.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
				.attr("class", "radar"+id);
		//Append a g element		
		var g = svg.append("g")
				.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
		
		/////////////////////////////////////////////////////////
		////////// Glow filter for some extra pizzazz ///////////
		/////////////////////////////////////////////////////////
		
		//Filter for the outside glow
		var filter = g.append('defs').append('filter').attr('id','glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

		/////////////////////////////////////////////////////////
		/////////////// Draw the Circular grid //////////////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the grid & axes
		var axisGrid = g.append("g").attr("class", "axisWrapper");
		
		//Draw the background circles
		axisGrid.selectAll(".levels")
		   .data(d3.range(1,(cfg.levels+1)).reverse())
		   .enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", function(d, i){return radius/cfg.levels*d;})
			.style("fill", "#ffffff")
			.style("stroke", "#cccccc")
			.style("fill-opacity", cfg.opacityCircles);
		//	.style("filter" , "url(#glow)");

		//Text indicating at what % each level is
		axisGrid.selectAll(".axisLabel")
		   .data(d3.range(1,(cfg.levels+1)).reverse())
		   .enter().append("text")
		   .attr("class", "axisLabel")
		   .attr("x", 4)
		   .attr("y", function(d){return -d*radius/cfg.levels;})
		   .attr("dy", "0.4em")
		   .style("font-size", "10px")
		   .attr("fill", "#737373")
		   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

		/////////////////////////////////////////////////////////
		//////////////////// Draw the axes //////////////////////
		/////////////////////////////////////////////////////////
		
		//Create the straight lines radiating outward from the center
		var axis = axisGrid.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");
		//Append the lines
		axis.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
			.attr("class", "line")
			.style("stroke", "#848484")
			.style("stroke-width", "1px");

		//Append the labels at each axis
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
			.text(function(d){return d})
			.call(wrap, cfg.wrapWidth);

		/////////////////////////////////////////////////////////
		///////////// Draw the radar chart blobs ////////////////
		/////////////////////////////////////////////////////////
		
	  
	  
		//The radial line function
		var radarLine = d3.radialLine()
			.radius(function(d) { return rScale(d.value); })
			.angle(function(d,i) {	return i*angleSlice; })
	    .curve(d3.curveLinearClosed);
			
	//	if(cfg.roundStrokes) {
	//		radarLine.curve(d3.curveCardinalClosed);
	//	}
					 
		//Create a wrapper for the blobs	
		var blobWrapper = g.selectAll(".radarWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarWrapper");
				
		//Append the backgrounds	
		blobWrapper
			.append("path")
			.attr("class", "radarArea")
			.attr("d", function(d,i) { return radarLine(d); })
			.style("fill", function(d,i) { return cfg.color(i); })
			.style("fill-opacity", cfg.opacityArea)
			.on('mouseover', function (d,i){
				//Dim all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1); 
				//Bring back the hovered over blob
				d3.select(this)
					.transition().duration(200)
					.style("fill-opacity", 0.7);	
			})
			.on('mouseout', function(){
				//Bring back all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", cfg.opacityArea);
			});
			
		//Create the outlines	
		blobWrapper.append("path")
			.attr("class", "radarStroke")
			.attr("d", function(d,i) { return radarLine(d); })
			.style("stroke-width", cfg.strokeWidth + "px")
			.style("stroke", function(d,i) { return cfg.color(i); })
			.style("fill", "none")
			.style("filter" , "url(#glow)");		
		
	 
	 
	  
	  
	  
	  
	  
	  //Append the circles
		blobWrapper.selectAll(".radarCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarCircle")
			.attr("r", cfg.dotRadius)
			.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", function(d,i,j) { return cfg.color(j); })
			.style("fill-opacity", 0.8);

	 
	  
	  
	  
	  

	  
		/////////////////////////////////////////////////////////
		//////// Append invisible circles for tooltip ///////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the invisible circles on top
		var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarCircleWrapper");
			
		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", cfg.dotRadius*1.5)
			.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function(d,i) {
				let newX =  parseFloat(d3.select(this).attr('cx')) - 10;
				let newY =  parseFloat(d3.select(this).attr('cy')) - 10;
						
				tooltip
					.attr('x', newX)
					.attr('y', newY)
					.text(Format(d.value))
					.transition().duration(200)
					.style('opacity', 1);
			})
			.on("mouseout", function(){
				tooltip.transition().duration(200)
					.style("opacity", 0);
			});
			
		//Set up the small tooltip for when you hover over a circle
		var tooltip = g.append("text")
			.attr("class", "tooltip")
			.style("opacity", 0);
		
	  
	  
	  
		/////////////////////////////////////////////////////////
		/////////////////// Helper Function /////////////////////
		/////////////////////////////////////////////////////////

		//Taken from http://bl.ocks.org/mbostock/7555321
		//Wraps SVG text	
		function wrap(text, width) {
		  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
				
			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
		  });
		}//wrap	
		
	}//RadarChart

}());

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiAgLyogUmFkYXIgY2hhcnQgZGVzaWduIGNyZWF0ZWQgYnkgTmFkaWVoIEJyZW1lciAtIFZpc3VhbENpbm5hbW9uLmNvbSAqL1xuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gU2V0LVVwIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gXG5cbiAgdmFyIG1hcmdpbiA9IHt0b3A6IDEwMCwgcmlnaHQ6IDEwMCwgYm90dG9tOiAxMDAsIGxlZnQ6IDEwMH0sXG4gICAgd2lkdGggPSBNYXRoLm1pbig3MDAsIHdpbmRvdy5pbm5lcldpZHRoIC0gMTApIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG4gICAgaGVpZ2h0ID0gTWF0aC5taW4od2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tIC0gMjApO1xuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBEYXRhIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gXG5cbiAgdmFyIGRhdGEgPSBbXG4gICAgICAgIFsvL2lQaG9uZVxuICAgICAgICB7YXhpczpcIkJhdHRlcnkgTGlmZVwiLHZhbHVlOjAuMjJ9LFxuICAgICAgICB7YXhpczpcIkJyYW5kXCIsdmFsdWU6MC40fSxcbiAgICAgICAge2F4aXM6XCJDb250cmFjdCBDb3N0XCIsdmFsdWU6MC4yOX0sXG4gICAgICAgIHtheGlzOlwiRGVzaWduIEFuZCBRdWFsaXR5XCIsdmFsdWU6MC4xN30sXG4gICAgICAgIHtheGlzOlwiSGF2ZSBJbnRlcm5ldCBDb25uZWN0aXZpdHlcIix2YWx1ZTowLjIyfSxcbiAgICAgICAge2F4aXM6XCJMYXJnZSBTY3JlZW5cIix2YWx1ZTowLjAyfSxcbiAgICAgICAge2F4aXM6XCJQcmljZSBPZiBEZXZpY2VcIix2YWx1ZTowLjIxfSxcbiAgICAgICAge2F4aXM6XCJUbyBCZSBBIFNtYXJ0cGhvbmVcIix2YWx1ZTowLjUwfVx0XHRcdFxuICAgICAgICBdLFsvL1NhbXN1bmdcbiAgICAgICAge2F4aXM6XCJCYXR0ZXJ5IExpZmVcIix2YWx1ZTowLjI3fSxcbiAgICAgICAge2F4aXM6XCJCcmFuZFwiLHZhbHVlOjAuMTZ9LFxuICAgICAgICB7YXhpczpcIkNvbnRyYWN0IENvc3RcIix2YWx1ZTowLjM1fSxcbiAgICAgICAge2F4aXM6XCJEZXNpZ24gQW5kIFF1YWxpdHlcIix2YWx1ZTowLjEzfSxcbiAgICAgICAge2F4aXM6XCJIYXZlIEludGVybmV0IENvbm5lY3Rpdml0eVwiLHZhbHVlOjAuMjB9LFxuICAgICAgICB7YXhpczpcIkxhcmdlIFNjcmVlblwiLHZhbHVlOjAuMTN9LFxuICAgICAgICB7YXhpczpcIlByaWNlIE9mIERldmljZVwiLHZhbHVlOjAuMzV9LFxuICAgICAgICB7YXhpczpcIlRvIEJlIEEgU21hcnRwaG9uZVwiLHZhbHVlOjAuMzh9XG4gICAgICAgIF0sWy8vTm9raWEgU21hcnRwaG9uZVxuICAgICAgICB7YXhpczpcIkJhdHRlcnkgTGlmZVwiLHZhbHVlOjAuMjZ9LFxuICAgICAgICB7YXhpczpcIkJyYW5kXCIsdmFsdWU6MC4xMH0sXG4gICAgICAgIHtheGlzOlwiQ29udHJhY3QgQ29zdFwiLHZhbHVlOjAuMzB9LFxuICAgICAgICB7YXhpczpcIkRlc2lnbiBBbmQgUXVhbGl0eVwiLHZhbHVlOjAuMTR9LFxuICAgICAgICB7YXhpczpcIkhhdmUgSW50ZXJuZXQgQ29ubmVjdGl2aXR5XCIsdmFsdWU6MC4yMn0sXG4gICAgICAgIHtheGlzOlwiTGFyZ2UgU2NyZWVuXCIsdmFsdWU6MC4wNH0sXG4gICAgICAgIHtheGlzOlwiUHJpY2UgT2YgRGV2aWNlXCIsdmFsdWU6MC40MX0sXG4gICAgICAgIHtheGlzOlwiVG8gQmUgQSBTbWFydHBob25lXCIsdmFsdWU6MC4zMH1cbiAgICAgICAgXVxuICAgICAgXTtcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vIERyYXcgdGhlIENoYXJ0IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBcblxuICB2YXIgY29sb3IgPSBkMy5zY2FsZU9yZGluYWwoKVxuICAgIC5yYW5nZShbXCIjRURDOTUxXCIsXCIjQ0MzMzNGXCIsXCIjMDBBMEIwXCJdKTtcblxuICB2YXIgcmFkYXJDaGFydE9wdGlvbnMgPSB7XG4gICAgdzogd2lkdGgsXG4gICAgaDogaGVpZ2h0LFxuICAgIG1hcmdpbjogbWFyZ2luLFxuICAgIG1heFZhbHVlOiAwLFxuICAgIGxldmVsczogNSxcbiAgICByb3VuZFN0cm9rZXM6IHRydWUsXG4gICAgY29sb3I6IGNvbG9yXG4gIH07XG5cbiAgLy9DYWxsZnVuY3Rpb24gdG8gZHJhdyB0aGUgUmFkYXIgY2hhcnRcbiAgUmFkYXJDaGFydChcIi5yYWRhckNoYXJ0XCIsIGRhdGEsIHJhZGFyQ2hhcnRPcHRpb25zKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLyBUaGUgUmFkYXIgQ2hhcnQgRnVuY3Rpb24gLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vIFdyaXR0ZW4gYnkgTmFkaWVoIEJyZW1lciAvLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8gVmlzdWFsQ2lubmFtb24uY29tIC8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vIEluc3BpcmVkIGJ5IHRoZSBjb2RlIG9mIGFsYW5ncmFmdSAvLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFxuZnVuY3Rpb24gUmFkYXJDaGFydChpZCwgZGF0YSwgb3B0aW9ucykge1xuXHR2YXIgY2ZnID0ge1xuXHQgdzogNjAwLFx0XHRcdFx0Ly9XaWR0aCBvZiB0aGUgY2lyY2xlXG5cdCBoOiA2MDAsXHRcdFx0XHQvL0hlaWdodCBvZiB0aGUgY2lyY2xlXG5cdCBtYXJnaW46IHt0b3A6IDIwLCByaWdodDogMjAsIGJvdHRvbTogMjAsIGxlZnQ6IDIwfSwgLy9UaGUgbWFyZ2lucyBvZiB0aGUgU1ZHXG5cdCBsZXZlbHM6IDMsXHRcdFx0XHRcdFx0Ly9Ib3cgbWFueSBsZXZlbHMgb3IgaW5uZXIgY2lyY2xlcyBzaG91bGQgdGhlcmUgYmUgZHJhd25cblx0IG1heFZhbHVlOiAwLCBcdFx0XHRcdC8vV2hhdCBpcyB0aGUgdmFsdWUgdGhhdCB0aGUgYmlnZ2VzdCBjaXJjbGUgd2lsbCByZXByZXNlbnRcblx0IGxhYmVsRmFjdG9yOiAxLjI1LCBcdC8vSG93IG11Y2ggZmFydGhlciB0aGFuIHRoZSByYWRpdXMgb2YgdGhlIG91dGVyIGNpcmNsZSBzaG91bGQgdGhlIGxhYmVscyBiZSBwbGFjZWRcblx0IHdyYXBXaWR0aDogNjAsIFx0XHRcdC8vVGhlIG51bWJlciBvZiBwaXhlbHMgYWZ0ZXIgd2hpY2ggYSBsYWJlbCBuZWVkcyB0byBiZSBnaXZlbiBhIG5ldyBsaW5lXG5cdCBvcGFjaXR5QXJlYTogMC4zNSwgXHQvL1RoZSBvcGFjaXR5IG9mIHRoZSBhcmVhIG9mIHRoZSBibG9iXG5cdCBkb3RSYWRpdXM6IDQsIFx0XHRcdFx0Ly9UaGUgc2l6ZSBvZiB0aGUgY29sb3JlZCBjaXJjbGVzIG9mIGVhY2ggYmxvZ1xuXHQgb3BhY2l0eUNpcmNsZXM6IDAuMSwgXHQvL1RoZSBvcGFjaXR5IG9mIHRoZSBjaXJjbGVzIG9mIGVhY2ggYmxvYlxuXHQgc3Ryb2tlV2lkdGg6IDIsIFx0XHRcdC8vVGhlIHdpZHRoIG9mIHRoZSBzdHJva2UgYXJvdW5kIGVhY2ggYmxvYlxuXHQgcm91bmRTdHJva2VzOiBmYWxzZSxcdC8vSWYgdHJ1ZSB0aGUgYXJlYSBhbmQgc3Ryb2tlIHdpbGwgZm9sbG93IGEgcm91bmQgcGF0aCAoY2FyZGluYWwtY2xvc2VkKVxuXHQgY29sb3I6IGQzLnNjYWxlT3JkaW5hbChkMy5zY2hlbWVDYXRlZ29yeTEwKSBcdFx0Ly9kMy5zY2FsZU9yZGluYWwoKS5yYW5nZShzY2hlbWVDYXRlZ29yeTEwKVx0Ly9Db2xvciBmdW5jdGlvblxuXHR9O1xuXHRcblx0Ly9QdXQgYWxsIG9mIHRoZSBvcHRpb25zIGludG8gYSB2YXJpYWJsZSBjYWxsZWQgY2ZnXG5cdGlmKCd1bmRlZmluZWQnICE9PSB0eXBlb2Ygb3B0aW9ucyl7XG5cdCAgZm9yKHZhciBpIGluIG9wdGlvbnMpe1xuXHRcdGlmKCd1bmRlZmluZWQnICE9PSB0eXBlb2Ygb3B0aW9uc1tpXSl7IGNmZ1tpXSA9IG9wdGlvbnNbaV07IH1cblx0ICB9Ly9mb3IgaVxuXHR9Ly9pZlxuXHRcblx0Ly9JZiB0aGUgc3VwcGxpZWQgbWF4VmFsdWUgaXMgc21hbGxlciB0aGFuIHRoZSBhY3R1YWwgb25lLCByZXBsYWNlIGJ5IHRoZSBtYXggaW4gdGhlIGRhdGFcblx0dmFyIG1heFZhbHVlID0gXG4gICAgICBNYXRoLm1heChcbiAgICAgICAgY2ZnLm1heFZhbHVlLCBcbiAgICAgICAgZDMubWF4KGRhdGEsIGZ1bmN0aW9uKGkpe3JldHVybiBkMy5tYXgoaS5tYXAoZnVuY3Rpb24obyl7cmV0dXJuIG8udmFsdWU7fSkpfSkpO1xuXHRcdFxuXHR2YXIgYWxsQXhpcyA9IChkYXRhWzBdLm1hcChmdW5jdGlvbihpLCBqKXtyZXR1cm4gaS5heGlzfSkpLFx0Ly9OYW1lcyBvZiBlYWNoIGF4aXNcblx0XHR0b3RhbCA9IGFsbEF4aXMubGVuZ3RoLFx0XHRcdFx0XHQvL1RoZSBudW1iZXIgb2YgZGlmZmVyZW50IGF4ZXNcblx0XHRyYWRpdXMgPSBNYXRoLm1pbihjZmcudy8yLCBjZmcuaC8yKSwgXHQvL1JhZGl1cyBvZiB0aGUgb3V0ZXJtb3N0IGNpcmNsZVxuXHRcdEZvcm1hdCA9IGQzLmZvcm1hdChcIi4wJVwiKSxcdFx0XHQgXHQvL1BlcmNlbnRhZ2UgZm9ybWF0dGluZ1xuXHRcdGFuZ2xlU2xpY2UgPSBNYXRoLlBJICogMiAvIHRvdGFsO1x0XHQvL1RoZSB3aWR0aCBpbiByYWRpYW5zIG9mIGVhY2ggXCJzbGljZVwiXG5cdFxuXHQvL1NjYWxlIGZvciB0aGUgcmFkaXVzXG5cdHZhciByU2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG5cdFx0LnJhbmdlKFswLCByYWRpdXNdKVxuXHRcdC5kb21haW4oWzAsIG1heFZhbHVlXSk7XG5cdFx0XG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLy8vLy8vLy8vLy8gQ3JlYXRlIHRoZSBjb250YWluZXIgU1ZHIGFuZCBnIC8vLy8vLy8vLy8vLy9cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0Ly9SZW1vdmUgd2hhdGV2ZXIgY2hhcnQgd2l0aCB0aGUgc2FtZSBpZC9jbGFzcyB3YXMgcHJlc2VudCBiZWZvcmVcblx0ZDMuc2VsZWN0KGlkKS5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XG5cdFxuXHQvL0luaXRpYXRlIHRoZSByYWRhciBjaGFydCBTVkdcblx0dmFyIHN2ZyA9IGQzLnNlbGVjdChpZCkuYXBwZW5kKFwic3ZnXCIpXG5cdFx0XHQuYXR0cihcIndpZHRoXCIsICBjZmcudyArIGNmZy5tYXJnaW4ubGVmdCArIGNmZy5tYXJnaW4ucmlnaHQpXG5cdFx0XHQuYXR0cihcImhlaWdodFwiLCBjZmcuaCArIGNmZy5tYXJnaW4udG9wICsgY2ZnLm1hcmdpbi5ib3R0b20pXG5cdFx0XHQuYXR0cihcImNsYXNzXCIsIFwicmFkYXJcIitpZCk7XG5cdC8vQXBwZW5kIGEgZyBlbGVtZW50XHRcdFxuXHR2YXIgZyA9IHN2Zy5hcHBlbmQoXCJnXCIpXG5cdFx0XHQuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjZmcudy8yICsgY2ZnLm1hcmdpbi5sZWZ0KSArIFwiLFwiICsgKGNmZy5oLzIgKyBjZmcubWFyZ2luLnRvcCkgKyBcIilcIik7XG5cdFxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0Ly8vLy8vLy8vLyBHbG93IGZpbHRlciBmb3Igc29tZSBleHRyYSBwaXp6YXp6IC8vLy8vLy8vLy8vXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcblx0Ly9GaWx0ZXIgZm9yIHRoZSBvdXRzaWRlIGdsb3dcblx0dmFyIGZpbHRlciA9IGcuYXBwZW5kKCdkZWZzJykuYXBwZW5kKCdmaWx0ZXInKS5hdHRyKCdpZCcsJ2dsb3cnKSxcblx0XHRmZUdhdXNzaWFuQmx1ciA9IGZpbHRlci5hcHBlbmQoJ2ZlR2F1c3NpYW5CbHVyJykuYXR0cignc3RkRGV2aWF0aW9uJywnMi41JykuYXR0cigncmVzdWx0JywnY29sb3JlZEJsdXInKSxcblx0XHRmZU1lcmdlID0gZmlsdGVyLmFwcGVuZCgnZmVNZXJnZScpLFxuXHRcdGZlTWVyZ2VOb2RlXzEgPSBmZU1lcmdlLmFwcGVuZCgnZmVNZXJnZU5vZGUnKS5hdHRyKCdpbicsJ2NvbG9yZWRCbHVyJyksXG5cdFx0ZmVNZXJnZU5vZGVfMiA9IGZlTWVyZ2UuYXBwZW5kKCdmZU1lcmdlTm9kZScpLmF0dHIoJ2luJywnU291cmNlR3JhcGhpYycpO1xuXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLy8vLy8vLy8vLy8vLy8gRHJhdyB0aGUgQ2lyY3VsYXIgZ3JpZCAvLy8vLy8vLy8vLy8vLy8vLy9cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFxuXHQvL1dyYXBwZXIgZm9yIHRoZSBncmlkICYgYXhlc1xuXHR2YXIgYXhpc0dyaWQgPSBnLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIFwiYXhpc1dyYXBwZXJcIik7XG5cdFxuXHQvL0RyYXcgdGhlIGJhY2tncm91bmQgY2lyY2xlc1xuXHRheGlzR3JpZC5zZWxlY3RBbGwoXCIubGV2ZWxzXCIpXG5cdCAgIC5kYXRhKGQzLnJhbmdlKDEsKGNmZy5sZXZlbHMrMSkpLnJldmVyc2UoKSlcblx0ICAgLmVudGVyKClcblx0XHQuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcImdyaWRDaXJjbGVcIilcblx0XHQuYXR0cihcInJcIiwgZnVuY3Rpb24oZCwgaSl7cmV0dXJuIHJhZGl1cy9jZmcubGV2ZWxzKmQ7fSlcblx0XHQuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZmZmZlwiKVxuXHRcdC5zdHlsZShcInN0cm9rZVwiLCBcIiNjY2NjY2NcIilcblx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgY2ZnLm9wYWNpdHlDaXJjbGVzKVxuXHQvL1x0LnN0eWxlKFwiZmlsdGVyXCIgLCBcInVybCgjZ2xvdylcIik7XG5cblx0Ly9UZXh0IGluZGljYXRpbmcgYXQgd2hhdCAlIGVhY2ggbGV2ZWwgaXNcblx0YXhpc0dyaWQuc2VsZWN0QWxsKFwiLmF4aXNMYWJlbFwiKVxuXHQgICAuZGF0YShkMy5yYW5nZSgxLChjZmcubGV2ZWxzKzEpKS5yZXZlcnNlKCkpXG5cdCAgIC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcblx0ICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXNMYWJlbFwiKVxuXHQgICAuYXR0cihcInhcIiwgNClcblx0ICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpe3JldHVybiAtZCpyYWRpdXMvY2ZnLmxldmVsczt9KVxuXHQgICAuYXR0cihcImR5XCIsIFwiMC40ZW1cIilcblx0ICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIFwiMTBweFwiKVxuXHQgICAuYXR0cihcImZpbGxcIiwgXCIjNzM3MzczXCIpXG5cdCAgIC50ZXh0KGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gRm9ybWF0KG1heFZhbHVlICogZC9jZmcubGV2ZWxzKTsgfSk7XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vIERyYXcgdGhlIGF4ZXMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XG5cdC8vQ3JlYXRlIHRoZSBzdHJhaWdodCBsaW5lcyByYWRpYXRpbmcgb3V0d2FyZCBmcm9tIHRoZSBjZW50ZXJcblx0dmFyIGF4aXMgPSBheGlzR3JpZC5zZWxlY3RBbGwoXCIuYXhpc1wiKVxuXHRcdC5kYXRhKGFsbEF4aXMpXG5cdFx0LmVudGVyKClcblx0XHQuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzXCIpO1xuXHQvL0FwcGVuZCB0aGUgbGluZXNcblx0YXhpcy5hcHBlbmQoXCJsaW5lXCIpXG5cdFx0LmF0dHIoXCJ4MVwiLCAwKVxuXHRcdC5hdHRyKFwieTFcIiwgMClcblx0XHQuYXR0cihcIngyXCIsIGZ1bmN0aW9uKGQsIGkpeyByZXR1cm4gclNjYWxlKG1heFZhbHVlKjEuMSkgKiBNYXRoLmNvcyhhbmdsZVNsaWNlKmkgLSBNYXRoLlBJLzIpOyB9KVxuXHRcdC5hdHRyKFwieTJcIiwgZnVuY3Rpb24oZCwgaSl7IHJldHVybiByU2NhbGUobWF4VmFsdWUqMS4xKSAqIE1hdGguc2luKGFuZ2xlU2xpY2UqaSAtIE1hdGguUEkvMik7IH0pXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcblx0XHQuc3R5bGUoXCJzdHJva2VcIiwgXCIjODQ4NDg0XCIpXG5cdFx0LnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMXB4XCIpO1xuXG5cdC8vQXBwZW5kIHRoZSBsYWJlbHMgYXQgZWFjaCBheGlzXG5cdGF4aXMuYXBwZW5kKFwidGV4dFwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJsZWdlbmRcIilcblx0XHQuc3R5bGUoXCJmb250LXNpemVcIiwgXCIxMXB4XCIpXG5cdFx0LmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuXHRcdC5hdHRyKFwiZHlcIiwgXCIwLjM1ZW1cIilcblx0XHQuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSl7IHJldHVybiByU2NhbGUobWF4VmFsdWUgKiBjZmcubGFiZWxGYWN0b3IpICogTWF0aC5jb3MoYW5nbGVTbGljZSppIC0gTWF0aC5QSS8yKTsgfSlcblx0XHQuYXR0cihcInlcIiwgZnVuY3Rpb24oZCwgaSl7IHJldHVybiByU2NhbGUobWF4VmFsdWUgKiBjZmcubGFiZWxGYWN0b3IpICogTWF0aC5zaW4oYW5nbGVTbGljZSppIC0gTWF0aC5QSS8yKTsgfSlcblx0XHQudGV4dChmdW5jdGlvbihkKXtyZXR1cm4gZH0pXG5cdFx0LmNhbGwod3JhcCwgY2ZnLndyYXBXaWR0aCk7XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdC8vLy8vLy8vLy8vLy8gRHJhdyB0aGUgcmFkYXIgY2hhcnQgYmxvYnMgLy8vLy8vLy8vLy8vLy8vL1xuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XG4gIFxuICBcblx0Ly9UaGUgcmFkaWFsIGxpbmUgZnVuY3Rpb25cblx0dmFyIHJhZGFyTGluZSA9IGQzLnJhZGlhbExpbmUoKVxuXHRcdC5yYWRpdXMoZnVuY3Rpb24oZCkgeyByZXR1cm4gclNjYWxlKGQudmFsdWUpOyB9KVxuXHRcdC5hbmdsZShmdW5jdGlvbihkLGkpIHtcdHJldHVybiBpKmFuZ2xlU2xpY2U7IH0pXG4gICAgLmN1cnZlKGQzLmN1cnZlTGluZWFyQ2xvc2VkKTtcblx0XHRcbi8vXHRpZihjZmcucm91bmRTdHJva2VzKSB7XG4vL1x0XHRyYWRhckxpbmUuY3VydmUoZDMuY3VydmVDYXJkaW5hbENsb3NlZCk7XG4vL1x0fVxuXHRcdFx0XHQgXG5cdC8vQ3JlYXRlIGEgd3JhcHBlciBmb3IgdGhlIGJsb2JzXHRcblx0dmFyIGJsb2JXcmFwcGVyID0gZy5zZWxlY3RBbGwoXCIucmFkYXJXcmFwcGVyXCIpXG5cdFx0LmRhdGEoZGF0YSlcblx0XHQuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcInJhZGFyV3JhcHBlclwiKTtcblx0XHRcdFxuXHQvL0FwcGVuZCB0aGUgYmFja2dyb3VuZHNcdFxuXHRibG9iV3JhcHBlclxuXHRcdC5hcHBlbmQoXCJwYXRoXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcInJhZGFyQXJlYVwiKVxuXHRcdC5hdHRyKFwiZFwiLCBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIHJhZGFyTGluZShkKTsgfSlcblx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gY2ZnLmNvbG9yKGkpOyB9KVxuXHRcdC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCBjZmcub3BhY2l0eUFyZWEpXG5cdFx0Lm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZCxpKXtcblx0XHRcdC8vRGltIGFsbCBibG9ic1xuXHRcdFx0ZDMuc2VsZWN0QWxsKFwiLnJhZGFyQXJlYVwiKVxuXHRcdFx0XHQudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMClcblx0XHRcdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDAuMSk7IFxuXHRcdFx0Ly9CcmluZyBiYWNrIHRoZSBob3ZlcmVkIG92ZXIgYmxvYlxuXHRcdFx0ZDMuc2VsZWN0KHRoaXMpXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKVxuXHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMC43KTtcdFxuXHRcdH0pXG5cdFx0Lm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uKCl7XG5cdFx0XHQvL0JyaW5nIGJhY2sgYWxsIGJsb2JzXG5cdFx0XHRkMy5zZWxlY3RBbGwoXCIucmFkYXJBcmVhXCIpXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKVxuXHRcdFx0XHQuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgY2ZnLm9wYWNpdHlBcmVhKTtcblx0XHR9KTtcblx0XHRcblx0Ly9DcmVhdGUgdGhlIG91dGxpbmVzXHRcblx0YmxvYldyYXBwZXIuYXBwZW5kKFwicGF0aFwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJyYWRhclN0cm9rZVwiKVxuXHRcdC5hdHRyKFwiZFwiLCBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIHJhZGFyTGluZShkKTsgfSlcblx0XHQuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgY2ZnLnN0cm9rZVdpZHRoICsgXCJweFwiKVxuXHRcdC5zdHlsZShcInN0cm9rZVwiLCBmdW5jdGlvbihkLGkpIHsgcmV0dXJuIGNmZy5jb2xvcihpKTsgfSlcblx0XHQuc3R5bGUoXCJmaWxsXCIsIFwibm9uZVwiKVxuXHRcdC5zdHlsZShcImZpbHRlclwiICwgXCJ1cmwoI2dsb3cpXCIpO1x0XHRcblx0XG4gXG4gXG4gIFxuICBcbiAgXG4gIFxuICBcbiAgLy9BcHBlbmQgdGhlIGNpcmNsZXNcblx0YmxvYldyYXBwZXIuc2VsZWN0QWxsKFwiLnJhZGFyQ2lyY2xlXCIpXG5cdFx0LmRhdGEoZnVuY3Rpb24oZCxpKSB7IHJldHVybiBkOyB9KVxuXHRcdC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJyYWRhckNpcmNsZVwiKVxuXHRcdC5hdHRyKFwiclwiLCBjZmcuZG90UmFkaXVzKVxuXHRcdC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZCxpKXsgcmV0dXJuIHJTY2FsZShkLnZhbHVlKSAqIE1hdGguY29zKGFuZ2xlU2xpY2UqaSAtIE1hdGguUEkvMik7IH0pXG5cdFx0LmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkLGkpeyByZXR1cm4gclNjYWxlKGQudmFsdWUpICogTWF0aC5zaW4oYW5nbGVTbGljZSppIC0gTWF0aC5QSS8yKTsgfSlcblx0XHQuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsaSxqKSB7IHJldHVybiBjZmcuY29sb3Ioaik7IH0pXG5cdFx0LnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDAuOCk7XG5cbiBcbiAgXG4gIFxuICBcbiAgXG5cbiAgXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLy8vLy8vLyBBcHBlbmQgaW52aXNpYmxlIGNpcmNsZXMgZm9yIHRvb2x0aXAgLy8vLy8vLy8vLy9cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFxuXHQvL1dyYXBwZXIgZm9yIHRoZSBpbnZpc2libGUgY2lyY2xlcyBvbiB0b3Bcblx0dmFyIGJsb2JDaXJjbGVXcmFwcGVyID0gZy5zZWxlY3RBbGwoXCIucmFkYXJDaXJjbGVXcmFwcGVyXCIpXG5cdFx0LmRhdGEoZGF0YSlcblx0XHQuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcInJhZGFyQ2lyY2xlV3JhcHBlclwiKTtcblx0XHRcblx0Ly9BcHBlbmQgYSBzZXQgb2YgaW52aXNpYmxlIGNpcmNsZXMgb24gdG9wIGZvciB0aGUgbW91c2VvdmVyIHBvcC11cFxuXHRibG9iQ2lyY2xlV3JhcHBlci5zZWxlY3RBbGwoXCIucmFkYXJJbnZpc2libGVDaXJjbGVcIilcblx0XHQuZGF0YShmdW5jdGlvbihkLGkpIHsgcmV0dXJuIGQ7IH0pXG5cdFx0LmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcInJhZGFySW52aXNpYmxlQ2lyY2xlXCIpXG5cdFx0LmF0dHIoXCJyXCIsIGNmZy5kb3RSYWRpdXMqMS41KVxuXHRcdC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZCxpKXsgcmV0dXJuIHJTY2FsZShkLnZhbHVlKSAqIE1hdGguY29zKGFuZ2xlU2xpY2UqaSAtIE1hdGguUEkvMik7IH0pXG5cdFx0LmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkLGkpeyByZXR1cm4gclNjYWxlKGQudmFsdWUpICogTWF0aC5zaW4oYW5nbGVTbGljZSppIC0gTWF0aC5QSS8yKTsgfSlcblx0XHQuc3R5bGUoXCJmaWxsXCIsIFwibm9uZVwiKVxuXHRcdC5zdHlsZShcInBvaW50ZXItZXZlbnRzXCIsIFwiYWxsXCIpXG5cdFx0Lm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQsaSkge1xuXHRcdFx0bGV0IG5ld1ggPSAgcGFyc2VGbG9hdChkMy5zZWxlY3QodGhpcykuYXR0cignY3gnKSkgLSAxMDtcblx0XHRcdGxldCBuZXdZID0gIHBhcnNlRmxvYXQoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2N5JykpIC0gMTA7XG5cdFx0XHRcdFx0XG5cdFx0XHR0b29sdGlwXG5cdFx0XHRcdC5hdHRyKCd4JywgbmV3WClcblx0XHRcdFx0LmF0dHIoJ3knLCBuZXdZKVxuXHRcdFx0XHQudGV4dChGb3JtYXQoZC52YWx1ZSkpXG5cdFx0XHRcdC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKVxuXHRcdFx0XHQuc3R5bGUoJ29wYWNpdHknLCAxKTtcblx0XHR9KVxuXHRcdC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCl7XG5cdFx0XHR0b29sdGlwLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApXG5cdFx0XHRcdC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG5cdFx0fSk7XG5cdFx0XG5cdC8vU2V0IHVwIHRoZSBzbWFsbCB0b29sdGlwIGZvciB3aGVuIHlvdSBob3ZlciBvdmVyIGEgY2lyY2xlXG5cdHZhciB0b29sdGlwID0gZy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLCBcInRvb2x0aXBcIilcblx0XHQuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXHRcbiAgXG4gIFxuICBcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8gSGVscGVyIEZ1bmN0aW9uIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHQvL1Rha2VuIGZyb20gaHR0cDovL2JsLm9ja3Mub3JnL21ib3N0b2NrLzc1NTUzMjFcblx0Ly9XcmFwcyBTVkcgdGV4dFx0XG5cdGZ1bmN0aW9uIHdyYXAodGV4dCwgd2lkdGgpIHtcblx0ICB0ZXh0LmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRleHQgPSBkMy5zZWxlY3QodGhpcyksXG5cdFx0XHR3b3JkcyA9IHRleHQudGV4dCgpLnNwbGl0KC9cXHMrLykucmV2ZXJzZSgpLFxuXHRcdFx0d29yZCxcblx0XHRcdGxpbmUgPSBbXSxcblx0XHRcdGxpbmVOdW1iZXIgPSAwLFxuXHRcdFx0bGluZUhlaWdodCA9IDEuNCwgLy8gZW1zXG5cdFx0XHR5ID0gdGV4dC5hdHRyKFwieVwiKSxcblx0XHRcdHggPSB0ZXh0LmF0dHIoXCJ4XCIpLFxuXHRcdFx0ZHkgPSBwYXJzZUZsb2F0KHRleHQuYXR0cihcImR5XCIpKSxcblx0XHRcdHRzcGFuID0gdGV4dC50ZXh0KG51bGwpLmFwcGVuZChcInRzcGFuXCIpLmF0dHIoXCJ4XCIsIHgpLmF0dHIoXCJ5XCIsIHkpLmF0dHIoXCJkeVwiLCBkeSArIFwiZW1cIik7XG5cdFx0XHRcblx0XHR3aGlsZSAod29yZCA9IHdvcmRzLnBvcCgpKSB7XG5cdFx0ICBsaW5lLnB1c2god29yZCk7XG5cdFx0ICB0c3Bhbi50ZXh0KGxpbmUuam9pbihcIiBcIikpO1xuXHRcdCAgaWYgKHRzcGFuLm5vZGUoKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKSA+IHdpZHRoKSB7XG5cdFx0XHRsaW5lLnBvcCgpO1xuXHRcdFx0dHNwYW4udGV4dChsaW5lLmpvaW4oXCIgXCIpKTtcblx0XHRcdGxpbmUgPSBbd29yZF07XG5cdFx0XHR0c3BhbiA9IHRleHQuYXBwZW5kKFwidHNwYW5cIikuYXR0cihcInhcIiwgeCkuYXR0cihcInlcIiwgeSkuYXR0cihcImR5XCIsICsrbGluZU51bWJlciAqIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIikudGV4dCh3b3JkKTtcblx0XHQgIH1cblx0XHR9XG5cdCAgfSk7XG5cdH0vL3dyYXBcdFxuXHRcbn0vL1JhZGFyQ2hhcnQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBO0NBQ0E7Q0FDQTtDQUNBO0FBQ0E7Q0FDQSxFQUFFLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQztDQUM3RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUs7Q0FDOUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDbkY7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