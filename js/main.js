var map;

var piepop = new piePop();
var pie1 = new pie();
var bar = new barchart();

d3.csv("data/Swedish_Election_2010.csv", function(error, data){
	map = new map(data);
});