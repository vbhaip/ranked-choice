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
		'rank1': '0',
		'votes': ['0']
	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['1']; i++){
	let toAdd = {
		'rank1': '1',
		'votes': ['1']
	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['2']; i++){
	let toAdd = {
		'rank1': '2',
		'votes': ['2']
	}

	if(i < 2){
		toAdd['rank2'] = '0'
		toAdd.votes.push('0')
	}
	else if(i < 2+4){
		toAdd['rank2'] = '1'
		toAdd.votes.push('1')
	}
	else{
		toAdd['rank2'] = 'X'
		toAdd.votes.push('X')
	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['3']; i++){
	let toAdd = {
		'rank1': '3',
		'votes': ['3']

	}

	if(i < 1){
		toAdd['rank2'] = '0'
		toAdd.votes.push('0')
	}
	else if(i < 1+1){
		toAdd['rank2'] = '1'
		toAdd.votes.push('1')
	}
	else{
		toAdd['rank2'] = 'X'
		toAdd.votes.push('X')
	}

	dots.push(toAdd)
}

for(let i=0; i<firstround['X']; i++){
	let toAdd = {
		'rank1': 'X',
		'votes': ['X']
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


//var force = generateForce(dots, 0.5, 0.2)
//	force.stop()

function colorizeDots(data) {

	circle = svg.selectAll("circle")
	.data(data)
	.style("fill", function(d) { 
		//switch(d.rank1){
		switch(d.votes[0]){
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

function renderGraph(data) {

	circle = svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.style("fill", function(d) { 
		return "black"; 
	})
	.attr("cx", function(d) { return scaleX(d.x)} )
	.attr("cy", function(d) { return scaleY(d.y)} )
	.attr("r", function(d) { return 4} )

	//const NUM_ITERATIONS = 1000;
	//force.tick(NUM_ITERATIONS);
	//force.on("tick", ticked)
	//.restart()
	//force.stop()
}	

function clearGraph() {
	svg.selectAll("circle")
	.remove()

	svg.selectAll(".cluster-label")
	.remove()

	svg.selectAll(".cluster-number")
	.remove()

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
	.force('center', d3.forceCenter(scaleX(xcenter), scaleY(ycenter)).strength(1.2))
	
	currentForces.push(force)

	return force;

}

function runRound(data, roundnum, tot_candidates, newy, legend){

	//base round - just initialize basic force to the center
	if(roundnum == 0){
		let force = generateForce(data, 0.5, newy)
		force.stop()
		force.on("tick", ticked)
		.restart()
		return
	}

	let ranknum = roundnum - 1;

	for(let i=0; i<data.length; i++){
		let dot = data[i];
		//dot.newy = 0.8



		if(ranknum < dot.votes.length){
			if(dot.votes[ranknum] == 'X'){
				dot.newx = (tot_candidates)*1.0/(tot_candidates+1)
			}
			else{
				dot.newx = (parseInt(dot.votes[ranknum]) + 1)*1.0/(tot_candidates+1)
			}
		}
		//switch(dot.votes[ranknum]){
		//	case '0':
		//		dot.newx = 1/6.0
		//		break;
		//	case '1':
		//		dot.newx = 2/6.0
		//		break;
		//	case '2':
		//		dot.newx = 3/6.0
		//		break;
		//	case '3':
		//		dot.newx = 4/6.0
		//		break;
		//	case 'X':
		//		dot.newx = 5/6.0
		//		break;
		//}
	}

	clearForces()

	//https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
	//array from 1 to n mapped to number divided by tot_candidates
	let x_locs = Array.from({length: tot_candidates}, (_, i) => i + 1).map(x => x*1.0/(tot_candidates+1))

	let all_subset_dots = x_locs.map(x => data.filter(dot => dot.newx == x));
	let sizes = all_subset_dots.map(x => x.length)
	let maxsize = Math.max(...sizes);

	for(ind in all_subset_dots){
		let subset_dots = all_subset_dots[ind]
		let x_loc = x_locs[ind];

		force = generateForce(subset_dots, x_loc, newy)
		force.stop()
		force.on("tick", ticked)
		.restart()
	}
	//console.log(all_subset_dots)
	
	if(roundnum == 1){
		svg.selectAll(".cluster-label")
			.data(all_subset_dots)
			.enter()
			.append("text")
			.attr("class", "cluster-label")

		svg.selectAll(".cluster-number")
			.data(all_subset_dots)
			.enter()
			.append("text")
			.attr("class", "cluster-number")
	}

		svg.selectAll(".cluster-label")
			.data(all_subset_dots)
			.attr("class", "cluster-label")
			.text((d,i) => {
				//console.log("hi")

				//if we're at the end
				if(i == all_subset_dots.length - 1){
					return legend['X']
				}

				if(d.length == maxsize){
					return "🏆" + legend[i]
				}
				else{
					return legend[i]
				}

			})
			.attr("id", (d,i) => legend[i])
			.attr("x", (d,i)  => scaleX(x_locs[i]))
			.attr("y", scaleY(newy+0.2))
			.attr("text-anchor", "middle")

		svg.selectAll(".cluster-number")
			.data(all_subset_dots)
			.attr("id", "count-" + ind)
			.text((d) => "Count: " + d.length)
			.attr("x", (d,i) => scaleX(x_locs[i]))
			.attr("y", scaleY(newy+0.25))
			.attr("text-anchor", "middle")

}

function runRound1(){

	for(let i=0; i<dots.length; i++){
		let dot = dots[i];
		dot.newy = 0.8

		switch(dot.votes[0]){
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

	clearForces()

	let x_locs = [1,2,3,4,5].map(x => x/6.0)

	let all_subset_dots = x_locs.map(x => dots.filter(dot => dot.newx == x));
	let sizes = all_subset_dots.map(x => x.length)
	let maxsize = Math.max(...sizes);

	for(ind in all_subset_dots){
		let subset_dots = all_subset_dots[ind]
		let x_loc = x_locs[ind];

		force = generateForce(subset_dots, x_loc, 0.5)
		force.stop()
		force.on("tick", ticked)
		.restart()
		svg.append("text")
			.attr("class", "cluster-label")
			.text(() => {

				if(subset_dots.length == maxsize){
					return "🏆" + legend[subset_dots[0].votes[0]]
				}
				else{
					return legend[subset_dots[0].votes[0]]
				}

			})
			.attr("id", legend[subset_dots[0].votes[0]])
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

		switch(dot.votes[1]){
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

//https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/39187274#39187274
function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

//https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi
function getRankedIndices(arr) {

	// make list with indices and values
	indexedTest = arr.map(function(e,i){return {ind: i, val: e}});
	// sort index/value couples, based on values
	indexedTest.sort(function(x, y){return x.val > y.val ? 1 : x.val == y.val ? 0 : -1});
	// make list keeping only indices
	indices = indexedTest.map(function(e){return e.ind})
	return indices
}


//type: distribution curve
//candidates: array with dictionaries. each dictionary contains index: [0,1] value on political spectrum, id: unique identifier
//size: number of people in election
//return: array - ballots
function simulate(type, candidates, size){
	//createBallots() - sample from distribution curve - for each sample order the candidates
	// - have taper off effect - if someone is so far from a candidate then make it a probability of whether or not they leave the ballot blank
	
	let ballots = []


	for(let i = 0; i < size; i++){
		let sample_index = gaussianRand();

		let diff_indices = candidates.map(x => Math.abs(x.index - sample_index))

		let ballot = getRankedIndices(diff_indices);
		ballot = ballot.map(x => x + "")
		let dot = {votes: ballot, x: 0.5, y: 0.5}
		ballots.push(dot)
	}

	console.log(ballots)
	renderGraph(ballots)
	runRound(ballots, 0, 5, 0.2, legend)
	return ballots

}

let candidates = [
	{index: 0.1, id: 0},
	{index: 0.3, id: 1},
	{index: 0.4, id: 2},
	{index: 0.7, id: 3},
]

//let ballots = simulate("", candidates, 20)
//renderGraph(ballots)
//runRound(ballots, 0, 5, 0.2, legend)



let nextButton = document.getElementById("next")
let prevButton = document.getElementById("prev")
let description = document.getElementById("description")

descriptions = [
"What's the difference between ranked choice voting and the current voting system we use right now?",
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
let update = ()=> {

	//step += 1

	description.innerHTML = descriptions[step]

	switch(step){
		case 1:
			renderGraph(dots)
			runRound(dots, 0, 5, 0.2, legend)
			break;
		case 2:
			colorizeDots(dots);
			break;
		case 3:
			runRound(dots, 1, 5, 0.5, legend)
			//runRound1();
			break;
		case 4:
			break;
		case 5:
			runRound(dots, 2, 5, 0.5, legend)
			//runRound2();
	}

};

nextButton.onclick = () => {
	step += 1;
	update()
}

prevButton.onclick = () => {
	step -= 1;
	update()
}

