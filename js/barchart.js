function barchart(){

	var self = this;

	var barDiv = $("#bar");

	var toolTip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var margin = {top: 100, right: 40, bottom: 100, left: 40},
    	height = barDiv.height() - margin.top - margin.bottom,
		width = barDiv.width() - margin.left - margin.right;

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

	//https://bl.ocks.org/mbostock/3885304
	var x = d3.scale.ordinal().rangeRoundBands([0,width], 0.05),
		y = d3.scale.linear().range([height,0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(function(d,i){ return (i%3 == 1) ? temp[i].party : null;});

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var svg = d3.select("#bar").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dataTemp = [];
	var dataSort = [];
	var temp = [];

	d3.csv("data/Swedish_Election_2002.csv", function(error, data){
		dataTemp.push(data);
		
		d3.csv("data/Swedish_Election_2006.csv", function(error, data1){
			dataTemp.push(data1);
			
			d3.csv("data/Swedish_Election_2010.csv", function(error, data2){
				dataTemp.push(data2);

				dataTemp.forEach(function(d){
					var t = d3.nest()
						.key(function(v){ return v.region; })
						.entries(d);
					dataSort.push(t);
				});

				dataSort.forEach(function(d,i){
					index = dataSort[i].findIndex(function(x,i){ if(x.key=="2523 Gällivare"){ return i; } });
					
					dataSort[i][index].values.forEach(function(d){
						temp.push(d);
					});
				});

				draw(temp);

			});	
		});
	});

	function draw(region){
		region.sort(function(a,b){ return a.party > b.party; });

		x.domain(region.map(function(d){ return d.party+Object.keys(d)[2]; }));
		y.domain([0, d3.max(region, function(d){ return (d[Object.keys(d)[2]] != "..") ? parseFloat(d[Object.keys(d)[2]]): 0; })]);

		svg.append("g")
			.attr("class","x axis")
			.attr("transform","translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor","end")
			.attr("dx","-0.8em")
			.attr("dy","-0.55em")
			.attr("transform","rotate(-75)");

		svg.append("g")
			.attr("class","y axis")
			.call(yAxis);
			//.append("text")
			//.attr("transform","rotate(-90)")
			//.attr("y",6)
			//.attr("dy","-0.71em")
			//.style("text-anchor","end");

		svg.selectAll("bar")
			.data(region)
			.enter().append("rect")
			.style("fill",function(d){ return colors[d.party]; })
			.attr("x", function(d){ 
				return (d[Object.keys(d)[2]] != "..") ? x(d.party+Object.keys(d)[2]) : 0;
			})
			.attr("width", x.rangeBand())
			.attr("y", function(d){ return y(d[Object.keys(d)[2]]); })
			.attr("height", function(d){ return height - y(d[Object.keys(d)[2]]); })
			.on("mousemove", function(d,i) {
				var currentRegion = this;
				toolTip.transition()
                    .duration(200)
                    .style("opacity", 1.0);
                toolTip.html(d.party + "<br>" + d[Object.keys(d)[2]])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
			});
	}

	

	
}