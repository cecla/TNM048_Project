function piePop(){
	var self = this;
	
	var pieDiv = $("#piepop");

	var colors = d3.scale.category20();

	var height = pieDiv.height(),
		width = pieDiv.width(),
		radius = Math.max(width, Math.abs(height)) / 4;

	var toolTip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var labelArc = d3.svg.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { console.log(d); return d.values; });

	var svg = d3.select("#piepop").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	d3.csv("data/Swedish_Population_Statistics.csv", function(data) {
		
		
		self.data = data;

		var temp = d3.nest()
			.key(function(d){
				return d.region;
			})
			.key(function(d){
				return d["marital status"];
			})
			.rollup(function(v){ return d3.sum(v, function(d){return d["2010"]; })})
			.entries(data);

		draw(temp[0].values);
		
    });

    function draw(population){
    	var g = svg.selectAll(".arc")
		.data(pie(population))
		.enter().append("g")
		 .attr("class", "arc");

		g.append("path")
		.attr("d", arc)
		.style("fill", function(d) {  return colors(d.data.key); });

		g.append("text")
		  .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		  .attr("dy", ".35em")
		  .text(function(d){ return d.data.key; });
    }

    /*function type(d) {
		if(d["Year=2010"] != "..")
		{
			d["Year=2010"] = +d["Year=2010"];
			
		}
		else
		{
			d["Year=2010"] = 0;
			
		}
		
		return d;
	}*/
}