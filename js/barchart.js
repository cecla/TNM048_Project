// http://bl.ocks.org/d3noob/8952219, skelleton for bar chart
function barchart(data){

	var self = this;
	self.data = data;

	var toolTip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var barDiv = $("#bar");

    var margin = {top: 30, right: 20, bottom: 60, left: 30},
    	height = barDiv.height() - margin.top - margin.bottom,
		width = barDiv.width() - margin.left - margin.right;

	var x = d3.scale.ordinal().rangeRoundBands([0,width], 0.05),
		y = d3.scale.linear().range([height,0]);

	// A temp draw, creating axis
	var temp = findParty("2161 Ljusdal");
	temp.sort(function(a,b){ return a.party > b.party; });

	x.domain(temp.map(function(d){ return d.party+Object.keys(d)[2]; }));
	y.domain([0, d3.max(temp, function(d){ return parseFloat(d[Object.keys(d)[2]]); })]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(function(d,i){ return (i%3 == 1) ? parties[temp[i].party] : null; }); // only display the name one for each region

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var colors = 
	{
		"Socialdemokraterna":"#ff2020", 
		"Vänsterpartiet":"#c80000", 
		"Miljöpartiet":"#83CF39", 
		"Sverigedemokraterna":"#DDDD00", 
		"Moderaterna":"#52bdec", 
		"Kristdemokraterna":"#000077",
		"Centerpartiet":"#009933", 
		"Folkpartiet":"#3399FF", 
		"övriga partier":"#8B008B", 
		"ej röstande":"#000000", 
		"ogiltiga valsedlar":"#A9A9A9"
	};

	var parties = 
	{
		"Socialdemokraterna":"S", 
		"Vänsterpartiet":"V", 
		"Miljöpartiet":"MP", 
		"Sverigedemokraterna":"SD", 
		"Moderaterna":"M", 
		"Kristdemokraterna":"KD",
		"Centerpartiet":"C", 
		"Folkpartiet":"FP", 
		"övriga partier":"ÖVR", 
		"ej röstande":"EJ", 
		"ogiltiga valsedlar":"OG"
	};
	
	var svg = d3.select("#bar").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	g.append("g")
		.attr("class", "x axis")
		.attr("transform","translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor","end")
		.attr("dy","0.55em");

	g.append("g")
		.attr("class","y axis")
		.call(yAxis)
		.append("text")
		.attr("transform","rotate(-90)")
		.attr("y",-6)
		.attr("dy","0.71em")
		.style("text-anchor","end");


	function draw(region){
		console.log();
		region.sort(function(a,b){ return a.party > b.party; });

		x.domain(region.map(function(d){ return d.party+Object.keys(d)[2]; }));
		y.domain([0, d3.max(region, function(d){ return parseFloat(d[Object.keys(d)[2]]); })]);

		g.select(".x.axis").call(xAxis);
		g.select(".y.axis").call(yAxis);

		g.selectAll("rect")
			.data(region)
			.enter()
			.append("rect")
			.style("fill",function(d){ return colors[d.party]; })
			.attr("x", function(d,i){
				return x(d.party+Object.keys(d)[2]);
			})
			.attr("y", function(d){
				return y(parseFloat(d[Object.keys(d)[2]]));
			})
			.attr("width", x.rangeBand())
			.attr("height", function(d){
				return height - y(parseFloat(d[Object.keys(d)[2]]));
			})
			.on("mousemove", function(d,i) {
				var currentRegion = this;
				toolTip.transition()
                    .duration(200)
                    .style("opacity", 1.0);
                toolTip.html(d.party + "<br>" + d[Object.keys(d)[2]] + " " + Object.keys(d)[2])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
			})
			.on("mouseout", function(d,i){
				
				toolTip.transition()
                    .duration(500)
                    .style("opacity", 0);
				
			});
			
			
			
		g.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
		.attr("id", "title")
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Election results for " + self.name + " in the years 2002, 2006 and 2010");
	}

	this.selectRegion = function(value, name){
		
		svg.selectAll("rect").remove();
		g.select("#title").remove();
		
		g.select(".x.axis").call(xAxis);
		g.select(".y.axis").call(yAxis);
		
		self.name = name;

		draw(findParty(value));
	}

	function findParty(key){
		var t = [];
		var index = 0;

		self.data.forEach(function(d,i){
			index = self.data[i].findIndex(function(x,j){
				if(x.key == key) return j;
			});

			d[index].values.forEach(function(x){
				t.push(x);
			});
		});

		return t;
	}
}