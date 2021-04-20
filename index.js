//Vinay Bhaip vb4ztv

//actual interesting starts at line 90ish
//helpful data from https://github.com/ranked-vote/reports/blob/master/us/me/2018/11/cd02/report.json


var dots = []

let firstround = {
	'0': 67,
	'1': 66,
	'2': 8,
	'3': 3,
	'X': 3
}

//sum the firstround dict

//populate dots with voting records

for(let i=0; i<firstround['0']; i++){
	let toAdd = {
		'rank1': '0'
	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['1']; i++){
	let toAdd = {
		'rank1': '1'
	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['2']; i++){
	let toAdd = {
		'rank1': '2'
	}

	if(i < 2){
		toAdd['rank2'] = '0'
	}
	else if(i < 2+4){
		toAdd['rank2'] = '1'
	}
	else{
		toAdd['rank2'] = 'X'

	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['3']; i++){
	let toAdd = {
		'rank1': '3'
	}

	if(i < 1){
		toAdd['rank2'] = '0'
	}
	else if(i < 1+1){
		toAdd['rank2'] = '1'
	}
	else{
		toAdd['rank2'] = 'X'

	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['X']; i++){
	let toAdd = {
		'rank1': 'X'
	}

	dots.push(toAdd)
}

for(let i=0; i < dots.length; i++){
	dots[i]['x'] = 0.5
	dots[i]['y'] = 0.5
}

var circle;

var width = 800;
var height = 800;

var svg = d3.select("#viz")
	.attr("width", width)
	.attr("height", height)

var scaleX = d3.scaleLinear().domain([0, 1]).range([0, width])
var scaleY = d3.scaleLinear().domain([0, 1]).range([0, height])


function ticked() {
	//console.log("yoyo")
	//console.log(circle)

	circle
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)

	for ( i = 0; i < dots.length; i++ ) {
		var dot = dots[i];
		dot.cx = dot.x;
		dot.cy = dot.y;
	}
}


var force = d3.forceSimulation(dots)
	.force("collide", d3.forceCollide(5))
	  .force('forceX', d3.forceX(0.5))
	  .force('forceY', d3.forceY(0.5))
	.force('center', d3.forceCenter(width/2, height/2))
	.stop()

function renderGraph() {

	circle = svg.selectAll("circle")
	.data(dots)
	.enter()
	.append("circle")
	.style("fill", function(d) { 
		switch(d.rank1){
			case '0':
				return 'red'
				break;
			case '1':
				return 'blue'
				break;
			case '2':
				return 'green'
				break;
			case '3':
				return 'yellow'
				break;

		}
		return "black"; 
	})
	.attr("cx", function(d) { return scaleX(d.x)} )
	.attr("cy", function(d) { return scaleY(d.y)} )
	.attr("r", function(d) { return 4} )

	const NUM_ITERATIONS = 1000;
	//force.tick(NUM_ITERATIONS);
	force.on("tick", ticked)
	.restart()
	//force.stop()
}	


function runRound2(){

	for(let i=0; i<dots.length; i++){
		let dot = dots[i];
		dot.newy = 0.8

		switch(dot.rank1){
			case '0':
				dot.newx = 0.2
				break;
			case '1':
				dot.newx = 0.4
				break;
			case '2':
				dot.newx = 0.6
				break;
			case '3':
				dot.newx = 0.8
				break;
			case 'X':
				dot.newx = 1
				break;
		}

		//dot.startx = dot.x;
		//dot.starty = dot.y;
	}

	force.stop(); 

	force = d3.forceSimulation(dots.filter(dot => dot.newx == 0.2))
	.force("collide", d3.forceCollide(5).strength(1))
	  .force('forceX', d3.forceX(0.5))
	  .force('forceY', d3.forceY(0.5))
	.force('center', d3.forceCenter(scaleX(0.2), 700))
	.stop()

	force.on("tick", ticked)
	.restart()

	force = d3.forceSimulation(dots.filter(dot => dot.newx == 0.4))
	.force("collide", d3.forceCollide(5).strength(1))
	  .force('forceX', d3.forceX(0.5))
	  .force('forceY', d3.forceY(0.5))
	.force('center', d3.forceCenter(scaleX(0.4), 700))
	.stop()

	force.on("tick", ticked)
	.restart()

	force = d3.forceSimulation(dots.filter(dot => dot.newx == 0.6))
	.force("collide", d3.forceCollide(5).strength(1))
	  .force('forceX', d3.forceX(0.5))
	  .force('forceY', d3.forceY(0.5))
	.force('center', d3.forceCenter(scaleX(0.6), 700))
	.stop()

	force.on("tick", ticked)
	.restart()

	force = d3.forceSimulation(dots.filter(dot => dot.newx == 0.8))
	.force("collide", d3.forceCollide(5).strength(1))
	  .force('forceX', d3.forceX(0.5))
	  .force('forceY', d3.forceY(0.5))
	.force('center', d3.forceCenter(scaleX(0.8), 700))
	.stop()

	force.on("tick", ticked)
	.restart()
}




renderGraph()
