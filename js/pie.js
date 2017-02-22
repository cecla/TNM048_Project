function pie(){
	
	var self = this;
	
	var pieDiv = $("#pie1");
	
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
		.value(function(d) { return d["Year=2010"]; });

	var svg = d3.select("#pie1").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	
	d3.csv("data/Swedish_Election_2010.csv", type, function(data) {
		
		
		self.data = data;
		
		var test = []; // array f?r att spara alla st?der och information i
		var temp = [];
		
	
	
		test = d3.nest()
		.key(function(d){
			return d.region;})
		.entries(data);
			
		
		
		test.keys = _.values(test);
		
		
		city = "2583 Haparanda";
		
		var index = 0;
		
		//index = test.indexOf(city);
		
		index = test.findIndex(function(x,i){ if(x.key==city){ return i; } });
		
		temp = test[index];
		
        draw(temp.values);
    });
	

	
	
	function draw(test){
		
		var g = svg.selectAll(".arc")
		.data(pie(test))
		.enter().append("g")
		 .attr("class", "arc");

		g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { console.log(d.data["Year=2010"]); if(d.data["Year=2010"] > 0){console.log(d.data.party);  return colors[d.data.party]}; });

		g.append("text")
		  .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		  .attr("dy", ".35em")
		  .text(function(d) {if(d.data["Year=2010"] > 0){return d.data.party}; });
        
    }
	
	function type(d) {
		if(d["Year=2010"] != "..")
		{
			d["Year=2010"] = +d["Year=2010"];
			
		}
		else
		{
			d["Year=2010"] = 0;
			
		}
		
		return d;
	}

	
}