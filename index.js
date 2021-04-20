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


var legend = {
	'0': 'Bruce Poliquin',
	'1': 'Jared F. Golden',
	'2': 'Tiffany L. Bond',
	'3': 'William R.S. Hoar',
	'X': 'No vote'
}

var circle;

var width = 800;
var height = 500;

var svg = d3.select("#viz")
	.attr("width", width)
	.attr("height", height)

var scaleX = d3.scaleLinear().domain([0, 1]).range([0, width])
var scaleY = d3.scaleLinear().domain([0, 1]).range([0, height])

var currentForces = []


function ticked() {

	circle
		.transition()
		.duration(50)
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)

	for ( i = 0; i < dots.length; i++ ) {
		var dot = dots[i];
		dot.cx = dot.x;
		dot.cy = dot.y;
	}
}


var force = generateForce(dots, 0.5, 0.2)
	force.stop()

function colorizeDots() {

	circle = svg.selectAll("circle")
	.data(dots)
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
				return 'orange'
				break;

		}
		return "black"; 
	})

}

function renderGraph() {

	circle = svg.selectAll("circle")
	.data(dots)
	.enter()
	.append("circle")
	.style("fill", function(d) { 
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


function clearForces(){
	for(ind in currentForces){
		force = currentForces[ind]
		force.stop()
	}
	curentForces = []

}

function generateForce(data, xcenter, ycenter){

	force = d3.forceSimulation(data)
	.force("collide", d3.forceCollide(5).strength(1))
	  .force('forceX', d3.forceX(0.5))
	  .force('forceY', d3.forceY(0.5))
	.force("charge", d3.forceManyBody().strength(1))
	.force('center', d3.forceCenter(scaleX(xcenter), scaleY(ycenter)))
	
	currentForces.push(force)

	return force;

}

function runRound1(){

	for(let i=0; i<dots.length; i++){
		let dot = dots[i];
		dot.newy = 0.8

		switch(dot.rank1){
			case '0':
				dot.newx = 1/6.0
				break;
			case '1':
				dot.newx = 2/6.0
				break;
			case '2':
				dot.newx = 3/6.0
				break;
			case '3':
				dot.newx = 4/6.0
				break;
			case 'X':
				dot.newx = 5/6.0
				break;
		}

		//dot.startx = dot.x;
		//dot.starty = dot.y;
	}

	force.stop(); 

	let x_locs = [1,2,3,4,5].map(x => x/6.0)

	for(ind in x_locs){
		let x_loc = x_locs[ind]

		let subset_dots = dots.filter(dot => dot.newx == x_loc)
		force = generateForce(subset_dots, x_loc, 0.5)
		force.stop()
		force.on("tick", ticked)
		.restart()

		svg.append("text")
			.attr("class", "cluster-label")
			.text(legend[subset_dots[0].rank1])
			.attr("id", legend[subset_dots[0].rank1])
			.attr("x", scaleX(x_loc))
			.attr("y", scaleY(0.7))
			.attr("text-anchor", "middle")

		svg.append("text")
			.attr("class", "cluster-number")
			.attr("id", "count-" + ind)
			.text("Count: " + subset_dots.length)
			.attr("x", scaleX(x_loc))
			.attr("y", scaleY(0.75))
			.attr("text-anchor", "middle")
			
	}

}

function runRound2(){

	for(let i=0; i<dots.length; i++){
		let dot = dots[i];

		switch(dot.rank2){
			case '0':
				dot.newx = 1/6.0
				break;
			case '1':
				dot.newx = 2/6.0
				break;
			case '2':
				dot.newx = 3/6.0
				break;
			case '3':
				dot.newx = 4/6.0
				break;
			case 'X':
				dot.newx = 5/6.0
				break;
		}

	}

	clearForces();

	let x_locs = [1,2,3,4,5].map(x => x/6.0)

	for(ind in x_locs){
		let x_loc = x_locs[ind]

		let subset_dots = dots.filter(dot => dot.newx == x_loc)
		force = generateForce(subset_dots, x_loc, 0.5)
		force.stop()
		force.on("tick", ticked)
		.restart()

		//console.log(subset_dots)
		svg.select("#count-" + ind)
			.text("Count: " + subset_dots.length)
	}


}

let nextButton = document.getElementById("next")
let description = document.getElementById("description")

descriptions = [
"Let's look at Maine's 2018 2nd Congressional Election to see the differences between First Past the Post (FPTP) and Ranked Choice Voting (RCV). Here \
each dot represents ~2,000 votes",
"We can color each dot based off who their first choice was on the ballot.",
"Now, let's split up each group based off who they voted for",
"We've simulated what you're used to seeing in an election. Here Brian Poliquin has won using FPTP. But notice that Poliquin does not have a majority of \
constituents who necessarily want him in office. Let's look at what happens when we look at the second-choice of Bond and Hoar, who do not have sufficient \
votes to win.",
"As it turns out, the majority of constituents prefer Jared F. Golden. In this case, RCV has produced a different winner than if we just counted all the first-choice votes with FPTP"]

description.innerHTML = descriptions[0]

let step = 0;
nextButton.onclick = ()=> {

	step += 1

	description.innerHTML = descriptions[step]

	switch(step){
		case 1:
			colorizeDots();
			break;
		case 2:
			runRound1();
			break;
		case 3:
			break;
		case 4:
			runRound2();
	}


};


renderGraph()
