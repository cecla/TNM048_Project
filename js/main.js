var map, pie1,piegender,piepop;

var dataTemp = [];
var dataSort = [];

//load data
d3.csv("data/Swedish_Election_2002.csv", type, function(error, data){
	dataTemp.push(data);
	
	d3.csv("data/Swedish_Election_2006.csv", type, function(error, data1){
		dataTemp.push(data1);
		
		d3.csv("data/Swedish_Election_2010.csv", type, function(error, data2){
			dataTemp.push(data2);
			map = new map(data2);

			// put all objects in one array
			dataTemp.forEach(function(d){
				var t = d3.nest()
					.key(function(v){ return v.region; })
					.entries(d);
				dataSort.push(t);
			});

			bar = new barchart(dataSort);
			pie1 = new pie(data2);
		});	
	});
});

d3.csv("data/Swedish_Population_Statistics.csv", function(data) {
	
	
	piegender = new pieGender(data);
	piepop = new piePop(data);
	
	
});

// modify data
function type(d) {

	if(d[Object.keys(d)[2]] != "..")
	{
		d[Object.keys(d)[2]] = +d[Object.keys(d)[2]];
		
	}
	else
	{
		d[Object.keys(d)[2]] = 0;
		
	}
	
	return d;
}