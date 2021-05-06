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
		//.transition()
		//.duration(25)
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

	circle = svg.selectAll(".viz-circle")
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

	circle = svg.selectAll(".viz-circle")
	.data(data)
	.join("circle")
	.attr("class", "viz-circle")
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

function clearGraph(savecircles=false) {
	if(!savecircles){
		svg.selectAll(".viz-circle")
		.remove()
	}

	svg.selectAll(".cluster-label")
	.remove()

	svg.selectAll(".cluster-number")
	.remove()

	svg.selectAll(".toptext")
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
	  .force('forceX', d3.forceX(scaleX(xcenter)))
	  .force('forceY', d3.forceY(scaleY(ycenter)))
	.force("charge", d3.forceManyBody().strength(1))
	//.force('center', d3.forceCenter(scaleX(xcenter), scaleY(ycenter)).strength(1))
	//.alphaDecay(0.032)
	.alpha(0.6)
	//.velocityDecay(0.5)
	
	currentForces.push(force)

	return force;

}

function initializeElectionData(data){
	//data comes in as each item having a votes element
	//first add an array to each item for the value for each round
	//this should group all of the elements based off the first value
	//then remove the lowest val and update all of the eliminated ones to their next val
	
	let currRound = 0
	let currMaj = data.filter(x => !(x.votes.length == 0 || x.votes[0] == "X")).length/2
	
	data.forEach((item) => {
		item.roundVal = [item.votes[0]]
		item.currVoteInd = 0
		item.x = scaleX(item.x);
		item.y = scaleX(item.y);
	})

	let metadata = {}
	metadata.currMaj = [currMaj]

	let candidates = ['0','1','2','3']

	let groups = candidates.map(x => data.filter( (item) => x == item.roundVal[0]))
	//console.log(groups)

	let sizes = groups.map(x => x.length)
	let maxsize = Math.max(...sizes);
	let minsize = Math.min(...(sizes.filter(x => x != 0)));

	//console.log(maxsize)
	//console.log(currMaj)

	while(maxsize <= currMaj && minsize < currMaj){

		groups.forEach( group => {
			if(group.length == minsize){
				//we want to move all the items in this group to have their next votes
				group.forEach(datum => {
					datum.currVoteInd += 1
				})
			}
				group.forEach( datum => {
					if(datum.currVoteInd >= datum.votes.length){
						datum.roundVal.push("X");
					}
					else{
						datum.roundVal.push(datum.votes[datum.currVoteInd])
					}
				})
		})

		//since it's not included in candidates, we want to add X to stay in no vote category
		data.filter(item => item.roundVal[item.roundVal.length-1]=='X').forEach(x => {
			x.roundVal.push("X")
		});

		currRound += 1

		//restablish groups
		groups = candidates.map(x => data.filter( (item) => x == item.roundVal[item.roundVal.length - 1]))
		//console.log(groups)

		sizes = groups.map(x => x.length)
		maxsize = Math.max(...sizes);
		minsize = Math.min(...(sizes.filter(x => x != 0)));
		currMaj = data.filter(x => x.votes[x.currVoteInd] != "X").length/2
		//console.log(currMaj)

		metadata.currMaj.push(currMaj)
	}

	metadata.rounds = currRound;

	return metadata

}

function runRound(data, roundnum, tot_candidates, newy, legend, show_winner=false, fptp=false){
	clearForces()
	//base round - just initialize basic force to the center
	if(roundnum == 0){

		clearGraph(savecircles=true)

		//come from the center location
		//data.forEach(item => {
		//	item.x = scaleX(0.5);
		//	item.y = scaleY(newy);
		//});
		
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



		let roundval = dot.roundVal[ranknum]
		//console.log(roundval)
		if(roundval == 'X'){
			dot.newx = (tot_candidates)*1.0/(tot_candidates+1)
		}
		else{
			dot.newx = (parseInt(roundval) + 1)*1.0/(tot_candidates+1)
		}
	}


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
	//force = generateForce(data, 0.5, newy)
	//force.stop()
	//force.on("tick", ticked)
	//.restart()
	//console.log(all_subset_dots)

	svg.selectAll(".cluster-label")
		.data(all_subset_dots)
		.join("text")
		.attr("class", "cluster-label")
		.text((d,i) => {
			//console.log("hi")

			//if we're at the end
			if(i == all_subset_dots.length - 1){
				return legend['X']
			}

			if(show_winner && d.length == maxsize){
				return "🏆" + legend[i]
			}
			else{
				return legend[i]
			}

		})
		.attr("font-weight", (d,i) => {
			if(show_winner && d.length == maxsize){
				return "bold"
			}
			return ""
		})
		.attr("id", (d,i) => legend[i])
		.attr("x", (d,i)  => scaleX(x_locs[i]))
		.attr("y", scaleY(newy+0.2))
		.attr("text-anchor", "middle")

	svg.selectAll(".cluster-number")
		.data(all_subset_dots)
		.join("text")
		.attr("class", "cluster-number")
		.attr("id", "count-" + ind)
		.text((d) => "Count: " + d.length)
		.attr("x", (d,i) => scaleX(x_locs[i]))
		.attr("y", scaleY(newy+0.25))
		.attr("text-anchor", "middle")

	
	//main text at middle top of viz
	//create object if it doesnt exist
	let votetype = svg.select("#votetype").node() 
		? svg.select("#votetype") 
		: svg.append("text")
			.attr("id", "votetype")
			.attr("x", scaleX(0.5))
			.attr("y", scaleY(0.2))
			.attr("text-anchor", "middle")
			.attr("font-size", "20px")
			.attr("class", "toptext")

	let subtext = svg.select("#subtext").node() 
		? svg.select("#subtext") 
		: svg.append("text")
			.attr("id", "subtext")
			.attr("x", scaleX(0.5))
			.attr("y", scaleY(0.25))
			.attr("text-anchor", "middle")
			.attr("font-size", "15px")
			.attr("class", "toptext")

	console.log(votetype)
	if(fptp){
		votetype
			.text("First Past the Post")
		subtext
			.text("Goal: Most Votes")
	}
	else{
		votetype
			.text("Ranked Choice")
		subtext
			.text("Goal: 50% votes = " + dots.meta["currMaj"][ranknum])
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
	{index: 0.3, id: 0, x: 10, y: 10},
	{index: 0.4, id: 1, x: 20, y: 10},
	{index: 0.6, id: 2, x: 30, y: 10},
	{index: 0.7, id: 3, x: 40, y: 10},
]

//let ballots = simulate("", candidates, 20)
//renderGraph(ballots)
//runRound(ballots, 0, 5, 0.2, legend)


//let candidates = []

//base code for selecting candidates on political spectrum
//https://observablehq.com/@d3/circle-dragging-i
let drag = () => {

	let dragXScale = d3.scaleLinear()
		.domain([0,100])
		.range([0, 100])
		.clamp(true)

	function dragstarted(event, d) {
		d3.select(this).raise().attr("stroke", "red");
	}

	function dragged(event, d) {
		d3.select(this).attr("cx", d.x = dragXScale(event.x));
		d.index = d.x/100.0
	}

	function dragended(event, d) {
		d3.select(this).attr("stroke", null);
	}

	return d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended);

}

svg.selectAll(".candidates")
	.data(candidates)
	.join("circle")
	.attr("class", "candidates")
	.attr("cx", d => d.x)
    .attr("cy", d => d.y)
	.attr("r", 4)
	.attr("id", (d,i) => "candidate" + i)
	.call(drag())
	.on("contextmenu", (event, d) => {
		event.preventDefault();
		d3.select(this).remove()
		console.log(event.currentTarget.remove())
		candidates.splice(event.currentTarget.id, 1)
	})

//maybe helpful http://bl.ocks.org/phil-pedruco/88cb8a51cdce45f13c7e
function getGaussianLine(){
	let normal = function(mean, variance) {
		// Precompute portion of the function that does not depend on x
		let predicate = 1 / Math.sqrt(variance * 2 * Math.PI);

		console.log(predicate)
		return function(x) {
			// See the pdf function from http://en.wikipedia.org/wiki/Normal_distribution
			return predicate * Math.exp( -Math.pow(x - mean, 2) / (2 * variance));
		};
	}

	let xseries = [];
	for (var i = 0; i <= 1000; i++) { xseries.push((i*1.0/1000-0.5)*6); }

	let normalTransform = normal(0, 1)
	let yseries = xseries.map(d => normalTransform(d));
	console.log(yseries)
	let combinedSeries = d3.zip(xseries, yseries);

	console.log(combinedSeries)
	let line = d3.line()
		.x(d => d[0]*200/6+200)
		.y(d => -d[1]*200+200)

	d3.select("#viz").append('path').datum(combinedSeries)
		.attr('d', line)
		.attr("stroke", "red")
}


let nextButton = document.getElementById("next")
let prevButton = document.getElementById("prev")
let description = document.getElementById("description")

descriptions = [
"What's the difference between ranked choice voting and the current voting system we use right now?",
"Let's look at Maine's 2018 2nd Congressional Election to see the differences between First Past the Post (FPTP) and Ranked Choice Voting (RCV). Here \
each dot represents ~2,000 votes",
"We can color each dot based off who their first choice was on the ballot.",
"Now, let's split up each group based off who they voted for.",
"We've simulated what you're used to seeing in an election. Here Brian Poliquin has won using FPTP. But notice that Poliquin does not have a majority of \
constituents who necessarily want him in office. What if there was a better way we could elect candidates?",
"Let's redo this election with a new method. In this method, when you fill out a ballot, you rank the candidates that you like.",
"If we split up the votes, then it looks the same as before. But notice we have not declared a winner, because no candidate has a majority of candidates that voted for them. We know that Hoar cannot win, but we also have information on who their next choice is. Let's see what happens",
"We moved the candidates votes to their next choice. Note that the 'No vote' choice means that the ballots did not specify their next choice (which is completely valid!). But notice we still don't who a majority of the citizens support. We can repeat the process, eliminating Bond and looking at her votes' next choices.",
"As it turns out, the majority of constituents prefer Jared F. Golden. In this case, RCV has produced a different winner than if we just counted all the first-choice votes with FPTP",
"Why does this matter? It means that people can vote for who they want to, like third party candidates, without worrying about who other people are voting for. It leads to less extreme candidates, and overall a better democracy."
]

description.innerHTML = descriptions[0]

let step = 0;
let update = ()=> {

	//step += 1

	description.innerHTML = descriptions[step]

	let meta;

	switch(step){
		case 1:
			renderGraph(dots)
			meta = initializeElectionData(dots)
			//console.log(meta)

			//kinda weird doing this, but it works?
			dots.meta = meta;
			runRound(dots, 0, 5, 0.2, legend, fptp=true)
			break;
		case 2:
			colorizeDots(dots);
			break;
		case 3:
			runRound(dots, 1, 5, 0.5, legend, true, fptp=true)
			//runRound1();
			break;
		case 4:
			break;
		case 5:
			runRound(dots, 0, 5, 0.2, legend)
			break;
		case 6:
			runRound(dots, 1, 5, 0.5, legend)
			break;
		case 7:
			runRound(dots, 2, 5, 0.5, legend)
			break;
		case 8:
			runRound(dots, 3, 5, 0.5, legend, true)
			break;
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

