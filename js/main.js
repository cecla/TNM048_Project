var map;

var pie1 = new pie();

d3.csv("data/Swedish_Election_2010.csv", function(error, data){
	map = new map(data);
});