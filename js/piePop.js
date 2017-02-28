function piePop(data){
	var self = this;
	
	var pieDiv = $("#piepop");

	var colors = d3.scale.category20();

	var width = pieDiv.width(),
		height = pieDiv.height(),
		radius = Math.max(width, height) / 6 - 10;

	var toolTip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

   var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var labelArc = d3.svg.arc()
		.outerRadius(radius)
		.innerRadius(radius);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.values; });

	var svg = d3.select("#piepop").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	
		
	var temp = d3.nest()
		.key(function(d){
			return d.region;
		})
		.key(function(d){
			return d["marital status"];
		})
		.rollup(function(v){ return d3.sum(v, function(d){return d["2010"]; })})
		.entries(data);


		self.data = temp;


    function draw(population){
    	
    	var g = svg.selectAll(".arc")
		.data(pie(population))
		.enter().append("g")
		 .attr("class", "arc");
		 
		 const g2 = svg.selectAll('.arc2')
			.data(pie(population))
			.enter()
			.append('g')
			.attr('class', 'arc');
		

		g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return colors(d.data.key); })
		.on("mousemove", function(d,i) {
				
				toolTip.transition()
                    .duration(200)
                    .style("opacity", 1.0);
                toolTip.html(d.data.key)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
                

			})
			.on("mouseout", function(d,i){
				
				toolTip.transition()
                    .duration(500)
                    .style("opacity", 0);
				
			});

		g2.append("text")
		  .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		  .attr("dy", ".35em")
		  .text(function(d){ return d.data.key; });
    }


	this.selectRegion = function(value){
		
		var index = 0;
		var temp = [];
        
		index = self.data.findIndex(function(x,i){ if(x.key==value){ return i; } });
		
		temp = self.data[index];
		
		svg.selectAll(".arc").remove();
		
		
		draw(temp.values);
		
				
	}

}