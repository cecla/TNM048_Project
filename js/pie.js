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
	
<<<<<<< HEAD
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
	
	var width = pieDiv.width(),
		height = 500,
		radius = Math.min(width, height) / 4;

		
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
		.value(function(d) { return d["Year=2010"]; });

	var svg = d3.select("#pie1").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 4 + "," + height / 4 + ")");

	
	d3.csv("data/Swedish_Election_2010.csv", type, function(data) {

		var test = []; // array f?r att spara alla st?der och information i

		test = d3.nest()
		.key(function(d){
			return d.region;})
		.entries(data);
			

		test.keys = _.values(test);
		
		self.data = test;

    });
	

	
	
	function draw(test){
		
		var g = svg.selectAll(".arc")
		.data(pie(test))
		.enter().append("g")
		 .attr("class", "arc");

		g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { if(d.data["Year=2010"] > 0){return colors[d.data.party]}; })
		.on("mousemove", function(d,i) {
				
				toolTip.transition()
                    .duration(200)
                    .style("opacity", 1.0);
                toolTip.html(d.data.party)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
                

			})
			.on("mouseout", function(d,i){
				
			});
			
			
		g.append("text")
		  .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		  .attr("dy", ".35em")
		  .text(function(d){ if(d.data["Year=2010"] > 0){return parties[d.data.party]};});
        
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
	
	this.selectRegion = function(value){
		
		var index = 0;
		var temp = [];
        
		index = self.data.findIndex(function(x,i){ if(x.key==value){ return i; } });
		
		temp = self.data[index];
		
		svg.selectAll(".arc").remove();
		
		draw(temp.values);
				
	}
	
}