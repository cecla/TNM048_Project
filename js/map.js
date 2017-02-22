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

	d3.nest()
		.key(function(d){ return d.party; })
		.entries(self.data)
		.forEach(function(q){
			numberOfParties.push(q.key);
		});

	var color = d3.scale.linear().domain([1, numberOfParties.length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#007AFF"), d3.rgb("#FFF500")]);

	d3.json("data/swe_mun.topojson", function(error, swe){
		if(error) throw error;

		var regions = topojson.feature(swe, swe.objects.swe_mun).features;

		regions.map(function(d){
			regionParties.forEach(function(q){
				if(q.region.includes(d.properties.name)){
					d.properties.region = q.region;
					d.properties.party = q.party;
					d.properties.color = color(numberOfParties.indexOf(q.party));
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
			//.attr("id", function(d){ return d.id; })
			.style("fill", function(d){ /*console.log(d.properties.color);*/ return d.properties.color; })
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