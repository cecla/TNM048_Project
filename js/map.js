function map(data){

	var self = this;

	var zoom = d3.behavior.zoom()
        .scaleExtent([1, 20])
        .on("zoom", move);

	var mapDiv = $("#map");

	var toolTip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

	var margin = {top:20, right:20, left:20, bottom:20},
		height = mapDiv.height() - margin.top - margin.bottom,
		width = mapDiv.width() - margin.right - margin.left;

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

	var projection = d3.geo.mercator()
                    .center([20, 62])
                    .scale(800)
                    .translate([width/2,height/2]);

	var svg = d3.select("#map").append("svg")
		.attr("width", width)
		.attr("height", height)
		.call(zoom);

	var path = d3.geo.path()
		.projection(projection);

	var g = svg.append("g");

	var regionParties = [];
	var numberOfParties = [];

	self.data = data;

	//for each region, find the party with highest votes
	d3.nest()
		.key(function(d){ return d.region; })
		.entries(self.data)
		.forEach(function(array){
			var temp = 0;
			var j = 0;
			//console.log(array.values[0]["Year=2010"]);
			array.values.forEach(function(entry, i){
				if(parseInt(entry["Year=2010"]) > temp){
					temp = parseInt(entry["Year=2010"]);
					j = i;
				}
			});
			regionParties.push(array.values[j]);
		});

	d3.json("data/swe_mun.topojson", function(error, swe){
		if(error) throw error;

		var regions = topojson.feature(swe, swe.objects.swe_mun).features;

		//make the connection between the map data and the election data
		regions.map(function(d){
			regionParties.forEach(function(q){
				if(q.region.includes(d.properties.name)){
					d.properties.region = q.region;
					d.properties.party = q.party;
				}
			});
			return d;
		});

		draw(regions);
	});

	function draw(regions){
		var region = g.selectAll(".region").data(regions);

		region.enter().insert("path")
			.attr("class", "regions")
			.attr("d", path)
			.style("fill", function(d){ return colors[d.properties.party]; })
			.on("mousemove", function(d,i) {
				var currentRegion = this;
				
				
				toolTip.transition()
                    .duration(200)
                    .style("opacity", 1.0);
                toolTip.html(d.properties.name + "<br>" + d.properties.party)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
                

			})
			.on("mouseout", function(d,i){
				
				toolTip.transition()
                    .duration(500)
                    .style("opacity", 0);
				
			})
			.on("click", function(d){
				pie1.selectRegion(d.properties.region);
			});
	}

	function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;        

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }
}