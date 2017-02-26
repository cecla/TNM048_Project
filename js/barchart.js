function barchart(data){

	var self = this;
	self.data = data;

	//console.log(self.data);

	var toolTip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var barDiv = $("#bar");

    var margin = {top: 10, right: 20, bottom: 60, left: 30},
    	height = barDiv.height() - margin.top - margin.bottom,
		width = barDiv.width() - margin.left - margin.right;

	var x = d3.scale.ordinal().rangeRoundBands([0,width], 0.05),
		y = d3.scale.linear().range([height,0]);

	var temp = findParty("2161 Ljusdal");
	console.log(temp);

	temp.sort(function(a,b){ return a.party > b.party; });
	x.domain(temp.map(function(d){ return d.party+Object.keys(d)[2]; }));
	y.domain([0, 60]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(function(d,i){ console.log(d); return (i%3 == 1) ? parties[temp[i].party] : null; });

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

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
		.attr("width", barDiv.width())
		.attr("height", barDiv.height());

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
		.attr("y",6)
		.attr("dy","0.71em")
		.style("text-anchor","end");


	function draw(region){
		region.sort(function(a,b){ return a.party > b.party; });

		x.domain(region.map(function(d){ return d.party+Object.keys(d)[2]; }));
		y.domain([0, d3.max(region, function(d){ return parseFloat(d[Object.keys(d)[2]]); })]);

		g.selectAll("rect")
			.data(region)
			.enter()
			.append("rect")
			.style("fill",function(d){ return colors[d.party]; })
			.attr("x", function(d,i){
				return x(d.party+Object.keys(d)[2]);
			})
			.attr("y", function(d){
				//console.log(height - y(d[Object.keys(d)[2]]));
				return y(d[Object.keys(d)[2]]);
			})
			.attr("width", x.rangeBand())
			.attr("height", function(d){
				return height - y(d[Object.keys(d)[2]]);
			})
			.on("mousemove", function(d,i) {
				var currentRegion = this;
				toolTip.transition()
                    .duration(200)
                    .style("opacity", 1.0);
                toolTip.html(d.party + "<br>" + d[Object.keys(d)[2]])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
			})
			.on("mouseout", function(d,i){
				
				toolTip.transition()
                    .duration(500)
                    .style("opacity", 0);
				
			});
	}

	this.selectRegion = function(value){
		svg.selectAll("rect").remove();

		g.select(".x.axis").call(xAxis);
		g.select(".y.axis").call(yAxis);

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