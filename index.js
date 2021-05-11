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

var width = window.innerWidth;
var leftwidth = window.innerWidth*.63;
var rightwidth = width - leftwidth;
//var height = 500;
var height = width*.35

var svg = d3.select("#viz")
	.attr("width", width)
	.attr("height", height)
	.style("display", "block")

var maine = true;

var scaleMaineX = d3.scaleLinear().domain([0, 1]).range([width*.2, width*.8])
var scaleX = d3.scaleLinear().domain([0, 1]).range([width*.2, width*.8])

var scaleLeftX= d3.scaleLinear().domain([0, 1]).range([0, leftwidth])
var scaleRightX= d3.scaleLinear().domain([0, 1]).range([leftwidth, width])

var scaleY = d3.scaleLinear().domain([0, 1]).range([0, height])

var scaleColor = d3.schemeDark2;

var currentForces = []


var tooltip = d3.select("body")
	.append("div")
	.attr('id', 'tooltip')
	.attr('style', 'position: absolute; opacity: 0;')

var simdistrib = "gauss"

var orderingmap = [0, 1, 2, 3]

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
		
		if(maine){
			switch(d.votes[0]){
				case '0':
					return '#b7245c'
					break;
				case '1':
					return '#4361EE'
					break;
				case '2':
					return '#4A7C59'
					break;
				case '3':
					return '#EF8354'
					break;

			}
		}

		if(d.votes[0] == "X"){
			return "#2F2D2E";
		}

		return scaleColor[parseInt(d.votes[0])];


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
	.attr("cx", function(d) { return maine ? scaleX(d.x) : scaleLeftX(d.x)} )
	.attr("cy", function(d) { return scaleY(d.y)} )
	.attr("r", function(d) { return 4} )
	.on('mouseover', function(event, d) {
		tooltip
			.transition()
			.duration(80)
			.style('display', 'block')
			.style('opacity', 1)
			.text(d.text)
			.style('left', (event.pageX+15) + 'px')
			.style('top', (event.pageY-15) + 'px')
			.transition()
			.duration(3000)
			.style('opacity', 0)
			.transition()
			.delay(1000)
			.style("display", "none")
	})
	.on('mouseout', function(e) {
		tooltip
			.style('opacity', 0)
			.style('display', 'none')
	})

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

	svg.selectAll(".viz-circle")
		.style("opacity", 1)

	svg.selectAll(".cluster-label")
	.remove()

	svg.selectAll(".cluster-number")
	.remove()

	svg.selectAll(".toptext")
	.remove()

	clearForces()

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
	  .force('forceX', maine ? d3.forceX(scaleX(xcenter)) : d3.forceX(scaleLeftX(xcenter)))
	  .force('forceY', d3.forceY(scaleY(ycenter)))
	.force("charge", d3.forceManyBody().strength(1))
	//.force('center', d3.forceCenter(scaleX(xcenter), scaleY(ycenter)).strength(1))
	//.alphaDecay(0.032)
	.alpha(0.6)
	//.velocityDecay(0.5)
	
	currentForces.push(force)

	return force;

}

function initializeElectionData(data, candidatesraw=[{index: 0},{index: 1},{index: 2},{index: 3}]){
	//data comes in as each item having a votes element
	//first add an array to each item for the value for each round
	//this should group all of the elements based off the first value
	//then remove the lowest val and update all of the eliminated ones to their next val
	
	let currRound = 0
	let currMaj = data.filter(x => !(x.votes.length == 0 || x.votes[0] == "X")).length/2
	
	data.forEach((item) => {
		item.roundVal = [item.votes[0]]
		item.currVoteInd = 0
		item.x = maine ? scaleX(item.x) : scaleLeftX(item.x);
		item.y = scaleY(item.y);
	})

	let metadata = {}
	metadata.currMaj = [currMaj]

	let candidates = []

	candidatesraw.forEach((d,i) => {
		candidates.push(i + "");
	})
	//console.log(candidates)

	let groups = candidates.map(x => data.filter( (item) => x == item.roundVal[0]))
	//console.log(groups)

	let sizes = groups.map(x => x.length)
	let maxsize = Math.max(...sizes);
	let minsize = Math.min(...(sizes.filter(x => x != 0)));

	let tempgroup = groups[sizes.indexOf(maxsize)][0]
	let fptpWinner = tempgroup.votes[tempgroup.currVoteInd]
	//console.log(fptpWinner)

	//console.log(maxsize)
	//console.log(currMaj)
	let eliminated = new Set([])
	let eliminatedlist = []

	while(maxsize <= currMaj && minsize < currMaj){
		eliminatedlist.push([])

		groups.forEach(group => {
			if(group.length == minsize){
				let tocheck = group[0].votes[group[0].currVoteInd];
				if(!(eliminated.has(tocheck))){
					eliminated.add(tocheck);
					eliminatedlist[eliminatedlist.length - 1].push(tocheck)
				}
			}
		})
		groups.forEach( group => {
			if(group.length == minsize){
				//we want to move all the items in this group to have their next votes
				group.forEach(datum => {
					
					while(eliminated.has(datum.votes[datum.currVoteInd])){
						datum.currVoteInd += 1
					}
				})
				//console.log(group)
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
		//console.log(data)


		//console.log(eliminated)
	}
	data.forEach( (d, i) => {
		//let text = "Voter " + i + " ballot: " +  "\n";
		let text = "Voter " + i + " ballot: \n";
		d.votes.forEach((vote,i) => {
			if(vote != "X"){
				if(maine){
					text += (i+1) + ". " + legend[vote] + "\n";
				}
				else{
					text += (i+1) + ". " + newlegend[vote] + "\n";
				}
			}
		});
		//if(d.votes[d.votes.length - 1] == 'X'){
		//	text += d.votes.slice(0, d.votes.length - 1)
		//}
		//else{
		//	text += d.votes
		//}
		d.text = text
	})

	tempgroup = groups[sizes.indexOf(maxsize)][0]
	let rankedWinner = tempgroup.votes[tempgroup.currVoteInd]
	//console.log(rankedWinner)

	metadata.rounds = currRound + 1;
	metadata.fptpWinner = fptpWinner
	metadata.rankedWinner = rankedWinner
	metadata.eliminated = eliminatedlist

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
			//console.log(orderingmap)
			//roundval = orderingmap[parseInt(roundval)]
			dot.newx = (parseInt(roundval) + 1)*1.0/(tot_candidates+1)
		}
	}


	//https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
	//array from 1 to n mapped to number divided by tot_candidates
	let x_locs = Array.from({length: tot_candidates}, (_, i) => i + 1).map(x => x*1.0/(tot_candidates+1))

	let all_subset_dots = x_locs.map(x => data.filter(dot => dot.newx == x));
	//console.log(all_subset_dots)

	let sizes = all_subset_dots.map(x => x.length)
	let maxsize = Math.max(...sizes);
	let minsize = Math.min(...sizes);

	let winnerind = sizes.indexOf(maxsize)
	//console.log(winnerind)

	for(ind in all_subset_dots){
		let subset_dots = all_subset_dots[ind]
		//console.log(x_locs)
		let x_loc = x_locs[orderingmap.indexOf(parseInt(ind))];
		
		//value is X so should be at the end
		if(ind == tot_candidates - 1){
			x_loc = x_locs[ind]
		}

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
	//console.log(legend)

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

			if(show_winner && all_subset_dots[orderingmap[i]].length == maxsize){
				return "🏆" + legend[orderingmap[i]]
			}
			else{
				return legend[orderingmap[i]]
			}

		})
		.attr("font-weight", (d,i) => {
			if(show_winner && i < all_subset_dots.length - 1 && all_subset_dots[orderingmap[i]].length == maxsize){
				return "bold"
			}
			return ""
		})
		.attr("text-decoration", (d,i) => {
			if(i == all_subset_dots.length - 1){
				return ""
			}

			if(all_subset_dots[orderingmap[i]].length == 0){
				return "line-through"
			}
		})
		.attr("id", (d,i) => "cluster-label-" + i)
		.attr("x", (d,i) => maine ? scaleX(x_locs[i]) : scaleLeftX(x_locs[i]))
		.attr("y", scaleY(newy+0.2))
		.attr("text-anchor", "middle")
		.attr("font-size", "1vw")

	svg.selectAll(".cluster-number")
		.data(all_subset_dots)
		.join("text")
		.attr("class", "cluster-number")
		.attr("id", (d,i) => "cluster-number-" + i)
		.text((d,i) => {
			let toreturn = "Count: "
			if(i == all_subset_dots.length-1){
				toreturn += all_subset_dots[i].length
			}
			else{
				toreturn += all_subset_dots[orderingmap[i]].length
			}
			return toreturn
		})
		.attr("x", (d,i) => {
			return maine ? scaleX(x_locs[i]) : scaleLeftX(x_locs[i])
			//if(i == all_subset_dots.length - 1){
			//	return scaleX(x_locs[all_subset_dots.length - 1])
			//}
			//return scaleX(x_locs[orderingmap[i]])
		})
		.attr("y", scaleY(newy+0.25))
		.attr("text-anchor", "middle")
		.attr("font-size", "1vw")

	svg.selectAll(".cluster-label")
		.transition()
		.duration(500)
		.style("opacity", (d,i) => {
			//console.log(i)
			//console.log(d)
			//console.log()
			//console.log(all_subset_dots)
			if(show_winner && i == all_subset_dots.length - 1){
				return 0.1
			}
			if(i == all_subset_dots.length - 1){
				return 1;
			}
			console.log("---")
			console.log(i)
			console.log(all_subset_dots.length)
			if(all_subset_dots[orderingmap[i]].length == 0){
				return 0.1
			}
			//if(show_winner && all_subset_dots[orderingmap[i]].length != maxsize){
			if(show_winner && all_subset_dots[orderingmap[i]][0].roundVal[ranknum] != winnerind){
				//console.log("---" + i + "---")
				return 0.1
			}
			return 1
		})
	svg.selectAll(".cluster-number")
		.transition()
		.duration(500)
		.style("opacity", (d,i) => {
			//console.log(i)
			//console.log(d)
			//console.log()
			//console.log(all_subset_dots)
			if(show_winner && i == all_subset_dots.length - 1){
				return 0.1
			}
			if(i == all_subset_dots.length - 1){
				return 1;
			}
			if(all_subset_dots[orderingmap[i]].length == 0){
				return 0.1
			}
			//code below buggy?
			//console.log(all_subset_dots)
			//if(show_winner && all_subset_dots[orderingmap[i]].length != maxsize){
			if(show_winner && all_subset_dots[orderingmap[i]][0].roundVal[ranknum] != winnerind){
				//console.log("..." + i + "...")
				return 0.1
			}
			return 1
		})

	//console.log(winnerind)
	svg.selectAll(".viz-circle")
		.transition()
		.duration(500)
		.style("opacity", d => {
			
			if(show_winner && d.roundVal[ranknum] != winnerind){
				return 0.1
			}
			else{
				return 1
			}

		})

	
	//main text at middle top of viz
	//create object if it doesnt exist
	let votetype = svg.select("#votetype").node() 
		? svg.select("#votetype") 
		: svg.append("text")
			.attr("id", "votetype")
			.attr("x", maine ? scaleX(0.5) : scaleLeftX(0.5))
			.attr("y", scaleY(newy-0.5))
			.attr("text-anchor", "middle")
			.attr("font-size", "20px")
			.attr("class", "toptext")

	let subtext = svg.select("#subtext").node() 
		? svg.select("#subtext") 
		: svg.append("text")
			.attr("id", "subtext")
			.attr("x", maine ? scaleX(0.5) : scaleLeftX(0.5))
			.attr("y", scaleY(newy - 0.45))
			.attr("text-anchor", "middle")
			.attr("font-size", "15px")
			.attr("class", "toptext")


	let boxedtext = svg.select("#boxedtext").node() 
		? svg.select("#boxedtext") 
		: svg.append("text")
			.attr("id", "boxedtext")
			.attr("x", maine ? scaleX(0.5) : scaleLeftX(0.5))
			.attr("y", scaleY(newy - 0.35))
			.attr("text-anchor", "middle")
			.attr("font-size", "0.9vw")
			.attr("class", "toptext")
			//.style("outline", "1px solid black")
			.attr("text-decoration", "underline")
			.style("width", maine ? scaleX(0.8) - scaleX(0.2) : scaleLeftX(0.8) - scaleLeftX(0.2))

	//console.log(votetype)
	if(fptp){
		votetype
			.text("First Past the Post")
		subtext
			.text("Goal: Most Votes")

		boxedtext
			.text("Voters pick one choice and the results are decided.")
	}
	else{
		votetype
			.text("Ranked Choice (Round " + roundnum + ")")
		subtext
			.text("Goal: 50% votes = " + data.meta["currMaj"][ranknum] + " votes")

		//tells us if we're on our final round
		let finalround = (ranknum+1 == data.meta.rounds);
		//console.log(finalround)
		if(ranknum > 0){
			if(finalround){
				if(data.meta.rankedWinner == data.meta.fptpWinner){
					boxedtext
						.text(legend["" + data.meta.rankedWinner] + " wins the election. First Past the Post and Ranked Choice Voting produced the same winners.")
				}
				else{
					boxedtext
						.text(legend["" + data.meta.rankedWinner] + " wins the election. First Past the Post and Ranked Choice Voting produced different winners. FPTP winner: " + legend["" + data.meta.fptpWinner])
				}
			}
			else{
				boxedtext
					.text("The candidate with the least votes (" + legend["" + data.meta["eliminated"][ranknum-1]] + ") is eliminated, and their votes go to their next choices.")
			}
		}
		else{
			if(finalround){
				boxedtext
					.text(legend["" + data.meta.rankedWinner] + " wins the election. First Past the Post and Ranked Choice Voting produced the same result.")
			}
			else{
				boxedtext
					.text("Voters pick their top choice candidates. Candidates need >50% of votes to win, so no winner is chosen yet.")
			}
		}

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

//not sure if this is right, double check
function bimodGaussianRand() {
	if(Math.random() < 0.5){
		return gaussianRand()*0.6
	}
	else{
		return 0.4+gaussianRand()*0.6
	}
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

function shuffleArray(array, start) {
    for (let i = array.length - 1; i > start; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//candidates: array with dictionaries. each dictionary contains index: [0,1] value on political spectrum, id: unique identifier
//size: number of people in election
//rng: how much randomness to add to people's votes
//return: array - ballots
function simulate(candidates, size, rng=0.05, novote = 0.01){
	//createBallots() - sample from distribution curve - for each sample order the candidates
	// - have taper off effect - if someone is so far from a candidate then make it a probability of whether or not they leave the ballot blank
	
	let ballots = []


	for(let i = 0; i < size; i++){
		let sample_index;
		if(simdistrib == "gauss"){
			sample_index = gaussianRand();
		}
		if(simdistrib == "bimodgauss"){
			sample_index = bimodGaussianRand();
		}
		if(simdistrib == "uniform"){
			sample_index = Math.random();
		}
		if(simdistrib == "leftskew"){
			sample_index = stdlib.base.random.beta(4,2)
		}
		if(simdistrib == "rightskew"){
			sample_index = stdlib.base.random.beta(2,4)
		}


		let diff_indices = candidates.map(x => Math.abs(x.index - sample_index) + rng*2*Math.random())

		let ballot = getRankedIndices(diff_indices);


		//so first part might be deterministic, but later on it gets more random
		for(let j = 0; j < ballot.length; j++){
			let differfactor = 20*Math.abs(diff_indices[j])
			if(Math.random() < novote*differfactor){
				ballot.splice(j, ballot.length - j, "X")
			}

			if(Math.random() < rng){
				shuffleArray(ballot, j)
				break;
			}
		}


		ballot = ballot.map(x => x + "")

		let dot = {votes: ballot, x: 0.5, y: 0.5}
		ballots.push(dot)
	}

	//console.log(ballots)
	renderGraph(ballots)
	runRound(ballots, 0, 5, 0.2, legend)
	return ballots

}

var candidates = [
	{index: 0.3, id: 0},
	{index: 0.4, id: 1},
	{index: 0.6, id: 2},
	{index: 0.7, id: 3},
]


let simulationBallots;

function updateSimulationInit() {

	simulationBallots = simulate(candidates, 200)
	colorizeDots(simulationBallots)
	meta = initializeElectionData(simulationBallots, candidates)
	simulationBallots.meta = meta
	runRound(simulationBallots, 0, 2, 0.4, legend)

}



//let ballots = simulate(candidates, 20)
//renderGraph(ballots)
//runRound(ballots, 0, 5, 0.2, legend)


//let candidates = []

//base code for selecting candidates on political spectrum
//https://observablehq.com/@d3/circle-dragging-i

function drawCandidates(w, xmid, ymid){



	let scaledw = w*rightwidth

	let xstart = scaleRightX(xmid) - scaledw/2
	let xend = scaleRightX(xmid) + scaledw/2

	//console.log(xstart)
	//console.log(xend)

	candidates.forEach((d) => {
		d.x = d.index*scaledw+xstart
		d.y = scaleY(ymid)
	})

	let drag = () => {

		let dragXScale = d3.scaleLinear()
			.domain([xstart,xend])
			.range([xstart, xend])
			.clamp(true)

		function dragstarted(event, d) {
			d3.select(this).raise()
				.attr("stroke", null)
				.attr("r", 10)
				.style("cursor", "grabbing");

			clearSimTimeouts()
			clearDescriptionText()

		}

		function dragged(event, d) {
			//console.log(event.x)
			d3.select(this)
				.attr("cx", d.x = dragXScale(event.x))
			//console.log(d.x)
			//console.log(d.index)
			//console.log()
			d.index = (d.x-xstart)/scaledw
		}

		function dragended(event, d) {
			d3.select(this)
				.attr("stroke", "black")
				.attr("r", 6)
				.style("cursor", "grab")
			updateSimulationInit();
			setOrderingMap()
		}

		return d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);

	}

	let rectDrawn = svg.select("#rectslider").node() 

	if(!rectDrawn){
		svg.append("rect")
			.attr("x", xstart)
			.attr("y", scaleY(ymid-0.02))
			.attr("width", scaledw)
			.attr("height", scaleY(0.04))
			.attr("fill","grey")
			.attr("opacity","0.1")
			.on("click", (event,d) => {
				//console.log(event)
				if(candidates.length < 8){
					console.log(candidates)
					let ind = (event.x-xstart)/scaledw
					candidates.push({
						index: ind,
						id: candidates.length,
						x: ind*scaledw+xstart,
						y: scaleY(ymid)
					})
					clearSimTimeouts()
					clearDescriptionText()

					updateSimulationInit();
					drawCandSliders()
					setOrderingMap()
					console.log(candidates)
				}
			})
			.attr("id", "rectslider")
			.style("cursor", "copy")
	}

	//console.log(candidates)
	function drawCandSliders(){
		svg.selectAll(".candidates")
			.data(candidates)
			.join("circle")
			.attr("class", "candidates")
			.attr("cx", d =>  d.x)
			.attr("cy", d => d.y)
			.attr("r", 6)
			.attr("id", (d,i) => "candidate" + i)
			.call(drag())
			.on("contextmenu", (event, d) => {
				if(candidates.length < 2){
					//console.log("yo")
					return;
				}
				event.preventDefault();
				//d3.select(this).remove()
				event.currentTarget.remove()
				candidates.splice(d.id, 1)

				//update ids to match index in array
				candidates.forEach((d,i) => {
					d.id = i;
				});

				//recolorize dots
				svg.selectAll(".candidates")
					.transition()
					.duration(500)
					.attr("fill", (d,i) => scaleColor[i])
					.call(updateSimulationInit)

				clearSimTimeouts()
				clearDescriptionText()

				setOrderingMap()

				//console.log(candidates)
			})
			.attr("fill", (d,i) => scaleColor[i])
			.attr("stroke", "black")
			.on('mouseover', function(event, d) {
				tooltip
					.transition()
					.duration(80)
					.style('display', 'block')
					.style('opacity', 1)
					.text(newlegend['' + d.id])
					.style('left', (event.pageX-15) + 'px')
					.style('top', (event.pageY+15) + 'px')
					.transition()
					.duration(2500)
					.style('opacity', 0)
					.transition()
					.delay(1000)
					.style("display", "none")
			})
			.on('mouseout', function(e) {
				tooltip
					.style('opacity', 0)
					.style('display', 'none')
			})
			.style("cursor", "grab")

	}

	function setOrderingMap(){
		orderingmap = getRankedIndices(candidates.map(x => x.index))
	}

	setOrderingMap();

	drawCandSliders();
}

//maybe helpful http://bl.ocks.org/phil-pedruco/88cb8a51cdce45f13c7e
//http://jsfiddle.net/NQDx9/1/
function getGaussianLine(w, h, xcenter, ycenter){
	w = rightwidth*w
	h = height*h
	xcenter = scaleRightX(xcenter)
	ycenter = scaleY(ycenter)
	 
	let normal = function(mean, variance) {
		// Precompute portion of the function that does not depend on x
		let predicate = 1 / Math.sqrt(variance * 2 * Math.PI);

		//console.log(predicate)
		return function(x) {
			// See the pdf function from http://en.wikipedia.org/wiki/Normal_distribution
			return predicate * Math.exp( -Math.pow(x - mean, 2) / (2 * variance));
		};
	}

	let xseries = [];
	xseries.push(-0.5)
	for (var i = 0; i <= 1000; i++) { xseries.push((i*1.0/1000-0.5)); }
	xseries.push(0.5)

	let normalTransform = normal(0, .5/8)
	let yseries = xseries.map(d => normalTransform(d));
	let max = Math.max(...yseries)
	yseries = yseries.map(d => d/max)

	yseries[0] = 0.1
	yseries[1002] = 0.1


	//console.log(yseries)
	let combinedSeries = d3.zip(xseries, yseries);

	//console.log(combinedSeries)
	let line = d3.line()
		.x(d => (d[0])*w+(xcenter))
		.y(d => (1-d[1])*(h)+(ycenter))

	return [line, combinedSeries]
	//d3.select("#viz").append('path').datum(combinedSeries)
	//	.attr('d', line)
	//	.attr("stroke", "red")
}

function getUniformLine(w, h, xcenter, ycenter){
	w = rightwidth*w
	h = height*h
	xcenter = scaleRightX(xcenter)
	ycenter = scaleY(ycenter)
	 

	let xseries = [];
	xseries.push(-0.5)
	for (var i = 0; i <= 1000; i++) { xseries.push((i*1.0/1000-0.5)); }
	xseries.push(0.5)

	let yseries = xseries.map(d => 0.5);
	yseries[0] = 0.1
	yseries[1002] = 0.1

	let combinedSeries = d3.zip(xseries, yseries);

	//console.log(combinedSeries)
	let line = d3.line()
		.x(d => d[0]*w+(xcenter))
		.y(d => (1-d[1])*(h)+(ycenter))

	return [line, combinedSeries]
	//d3.select("#viz").append('path').datum(combinedSeries)
	//	.attr('d', line)
	//	.attr("stroke", "red")
}

function getLeftSkewLine(w, h, xcenter, ycenter){
	w = rightwidth*w
	h = height*h
	xcenter = scaleRightX(xcenter)
	ycenter = scaleY(ycenter)
	 

	let xseries = [];
	xseries.push(-0.5)
	for (var i = 0; i <= 1000; i++) { xseries.push((i*1.0/1000-0.5)); }
	xseries.push(0.5)


	let yseries = xseries.map(d => stdlib.base.dists.beta.pdf(d+0.5, 4, 2));
	//console.log(yseries)
	let max = Math.max(...yseries)
	yseries = yseries.map(d => d/max + 0.1)

	yseries[0] = 0.1
	yseries[1002] = 0.1

	let combinedSeries = d3.zip(xseries, yseries);

	let line = d3.line()
		.x(d => d[0]*w+(xcenter))
		.y(d => (1-d[1])*(h)+(ycenter))

	return [line, combinedSeries]
}

function getRightSkewLine(w, h, xcenter, ycenter){
	w = rightwidth*w
	h = height*h
	xcenter = scaleRightX(xcenter)
	ycenter = scaleY(ycenter)
	 

	let xseries = [];
	xseries.push(-0.5)
	for (var i = 0; i <= 1000; i++) { xseries.push((i*1.0/1000-0.5)); }
	xseries.push(0.5)


	let yseries = xseries.map(d => stdlib.base.dists.beta.pdf(d+0.5, 2, 4));
	//console.log(yseries)
	let max = Math.max(...yseries)
	yseries = yseries.map(d => d/max + 0.1)

	yseries[0] = 0.1
	yseries[1002] = 0.1

	let combinedSeries = d3.zip(xseries, yseries);

	let line = d3.line()
		.x(d => d[0]*w+(xcenter))
		.y(d => (1-d[1])*(h)+(ycenter))

	return [line, combinedSeries]
}

function getBimodalGaussianLine(w, h, xcenter, ycenter){
	w = rightwidth*w
	h = height*h
	xcenter = scaleRightX(xcenter)
	ycenter = scaleY(ycenter)
	 
	let normal = function(mean, variance) {
		// Precompute portion of the function that does not depend on x
		let predicate = 1 / Math.sqrt(variance * 2 * Math.PI);

		//console.log(predicate)
		return function(x) {
			// See the pdf function from http://en.wikipedia.org/wiki/Normal_distribution
			return predicate * Math.exp( -Math.pow(x - mean, 2) / (2 * variance));
		};
	}

	let xseries = [];
	xseries.push(-0.5)
	for (var i = 0; i <= 1000; i++) { xseries.push((i*1.0/1000-0.5)); }
	xseries.push(0.5)

	let normalTransform1 = normal(-.25, .25/8)
	let normalTransform2 = normal(.25, .25/8)

	let yseries = xseries.map(d => normalTransform1(d) + normalTransform2(d) - 0.65);
	let max = Math.max(...yseries)
	yseries = yseries.map(d => d/max)

	yseries[0] = 0.1
	yseries[1002] = 0.1
	//console.log(yseries)
	let combinedSeries = d3.zip(xseries, yseries);

	//console.log(combinedSeries)
	let line = d3.line()
		.x(d => d[0]*w+(xcenter))
		.y(d => (1-d[1])*(h)+(ycenter))

	return [line, combinedSeries]
	//d3.select("#viz").append('path').datum(combinedSeries)
	//	.attr('d', line)
	//	.attr("stroke", "red")
}

function drawSimulationInit(){
	simFPTPButton.hidden = false 
	simRankedButton.hidden = false 
	resetButton.hidden = false 
	simChoiceSelect.hidden = false

	d3.select("#simcontrol")
		.style("position", "absolute")
		.style("left", scaleRightX(0) + "px")
		.style("top", scaleY(0.9) + "px")

	d3.select("#simchoicecontainer")
		.style("position", "absolute")
		.style("left", scaleRightX(0.115) + "px")
		.style("top", scaleY(0.7) + "px")
		.style("display", "inline")

	let simheader= svg.select("#simheader").node() 
		? svg.select("#simheader") 
		: svg.append("text")

	//console.log(simheader)
	simheader
		.attr("x", scaleRightX(0.5))
		.attr("y", scaleY(0.2/2))
		.attr("text-anchor", "middle")
		.text("Simulation Parameters")
		.style("font-size", "1.5vw")

	d3.select("#simhelp")
		.style("display", "block")
		.style("left", scaleRightX(0.13) + "px")
		.style("top", scaleY(1.2) + "px")
		.style("opacity", 0)
		.transition()
		.delay(4000)
		.transition()
		.duration(1000)
		.style("opacity", 1)

	d3.select("#examples")
		.style("display", "block")
		.style("position", "absolute")
		.style("left", scaleRightX(0.13) + "px")
		.style("top", scaleY(1.1) + "px")
		.style("opacity", 0)
		.transition()
		.delay(4000)
		.transition()
		.duration(1000)
		.style("opacity", 1)

}
function drawSimulation(){

	let simwidth = 0.75
	let simheight= 0.35
	let simystart = 0.2


	let simline, series;


	if(simdistrib == "gauss"){
		[simline, series] = getGaussianLine(simwidth, simheight, 0.5, simystart)
	}
	if(simdistrib == "bimodgauss"){
		[simline, series] = getBimodalGaussianLine(simwidth, simheight, 0.5, simystart)
	}
	if(simdistrib == "uniform"){
		[simline, series] = getUniformLine(simwidth, simheight, 0.5, simystart)
	}
	if(simdistrib == "leftskew"){
		[simline, series] = getLeftSkewLine(simwidth, simheight, 0.5, simystart)
	}
	if(simdistrib == "rightskew"){
		[simline, series] = getRightSkewLine(simwidth, simheight, 0.5, simystart)
	}

	drawCandidates(simwidth, 0.5, simheight + simystart)

	//console.log(simline)
	let distribpath= svg.select("#simline").node() 
		? svg.select("#simline") 
		: svg.append("path")

	distribpath
		.datum(series)
		.transition()
		.duration(1000)
		.attr('d', simline)
		.attr("fill", "url(#redbluegrad")
		.attr("id", "simline")

}


let nextButton = document.getElementById("next")
let prevButton = document.getElementById("prev")
let description = document.getElementById("description")

let simFPTPButton = document.getElementById("simfptp")
let simRankedButton = document.getElementById("simranked")
let resetButton= document.getElementById("reset")


let example1Button = document.getElementById("example1button")
let example2Button = document.getElementById("example2button")
let example3Button = document.getElementById("example3button")

let simChoiceSelect = document.getElementById("simchoice")

//let parties = [
//	"Industrial Party",
//	"Peace Party",
//	"Civic Party",
//	"Agrarian Party",
//	"Freedom Party",
//	"Tech Party",
//	"Patriot Party",
//	"Justice Party",
//	"Science Party",

let parties = [
	"Spider-Man",
	"Iron Man",
	"Thor",
	"Hulk",
	"Wanda",
	"Thanos",
	"Loki",
	"Hawkeye",
	"Groot",
	"Nick Fury",
	"Starlord",
	"Deadpool",
	"Dr. Strange",
	"Vision",
	"Falcon",
	"Gamora",
	"Ant-Man",
	"Wolverine"]

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
parties = parties 
  .map((a) => ({sort: Math.random(), value: a}))
  .sort((a, b) => a.sort - b.sort)
  .map((a) => a.value)


let newlegend = {
	'0': parties[0],
	'1': parties[1],
	'2': parties[2],
	'3': parties[3],
	'4': parties[4],
	'5': parties[5],
	'6': parties[6],
	'7': parties[7],
	'8': parties[8],
	'X': 'No vote'
}

example1Button.onclick = () => {
	clearSimTimeouts()
	simChoiceSelect.value = "leftskew"
	simdistrib = "leftskew"

	candidates = [
		{index: 0.05, id: 0},
		{index: 0.5, id: 1},
		{index: 0.75, id: 2},
		{index: 0.8, id: 3},
		{index: 0.85, id: 4},
		{index: 0.9, id: 5},
	]

	//drawSimulationInit()
	clearGraph()
	drawSimulation()
	updateSimulationInit()

	d3.select("#description")
		.style("width", "30vw")
		.style("opacity", 1)
		.text("Here, we have voters who primarily are conservative. But there are many candidates who are also conservative; how does our voting system affect the result? (Click each simulate button!)")
}


example2Button.onclick = () => {
	clearSimTimeouts()
	simChoiceSelect.value = "uniform"
	simdistrib = "uniform"

	candidates = [
		{index: 0.0, id: 0},
		{index: 0.25, id: 1},
		{index: 0.45, id: 2},
		{index: 0.60, id: 3},
		{index: 0.75, id: 4},
		{index: 0.85, id: 5},
	]

	drawSimulation()
	clearGraph()
	updateSimulationInit()

	d3.select("#description")
		.style("width", "30vw")
		.style("opacity", 1)
		.text("In this scenario, all the voters are distributed equally along the political spectrum. Sometimes, the two voting systems produce the same result, and sometimes they don't. Running the scenario multiple times may give different results!")
}

example3Button.onclick = () => {
	clearSimTimeouts()
	simChoiceSelect.value = "gauss"
	simdistrib = "gauss"

	candidates = [
		{index: 0.38, id: 0},
		{index: 0.39, id: 1},
		{index: 0.4, id: 2},
		{index: 0.65, id: 3},
	]

	drawSimulation()
	clearGraph()
	updateSimulationInit()

	d3.select("#description")
		.style("width", "30vw")
		.style("opacity", 1)
		.text("Here, we can see the spoiler effect in place. Three moderate candidates are clumped together, splitting the vote and allowing a more extreme candidate to win with the current system.")
}

simFPTPButton.hidden = true
simRankedButton.hidden = true
resetButton.hidden = true
simChoiceSelect.hidden = true

simFPTPButton.onclick = () => {
	runRound(simulationBallots, 1, candidates.length + 1, 0.7, newlegend, show_winners=true, fptp=true)
	resetButton.disabled = false;
}

var timeouts = []

function clearSimTimeouts(){
	timeouts.forEach((d) => {
		clearTimeout(d)
	})
	resetButton.disabled = true;
	simFPTPButton.disabled = false;
	simRankedButton.disabled = false;
}

function clearDescriptionText(){
	d3.select("#description")
		.style("opacity", 0)
		.style("width", "0vw")

}

simRankedButton.onclick = () => {
	simRankedButton.disabled = true;
	simFPTPButton.disabled = true;
	resetButton.disabled = false;

	for(let i = 1; i <= simulationBallots.meta["rounds"]; i++){
		let timeout = setTimeout( () => {
			let showresult = false
			if(i == simulationBallots.meta["rounds"]){
				showresult = true;
				simRankedButton.disabled = false;
				simFPTPButton.disabled = false;
			}
			runRound(simulationBallots, i, candidates.length + 1, 0.7, newlegend, show_winner=showresult)
		}, 3000*(i-1))

		timeouts.push(timeout)

	}

}
resetButton.onclick = () => {
	clearSimTimeouts()
	clearGraph()
	updateSimulationInit()
	
	resetButton.disabled = true;
	simFPTPButton.disabled = false;
	simRankedButton.disabled = false;
}

simChoiceSelect.onchange = () => {
	clearSimTimeouts()
	clearDescriptionText()

	simdistrib = simChoiceSelect.value
	drawSimulation()
	clearGraph()

	updateSimulationInit()
}



let descriptions = [
"Why should we use Ranked Choice Voting over what we already use? First, let's find out what Ranked Choice Voting even is.",
"Maine is one of few states that use Ranked Choice Voting. Let's look at Maine's 2018 2nd Congressional Election to see the differences between what we currently use&mdash;First Past the Post (FPTP)&mdash;and Ranked Choice Voting (RCV). Here \
each dot represents ~2,000 votes.",
"We can color each dot based off who each person voted for.",
"Let's split it up so it's easier to see. We've simulated what you're used to seeing in an election. Here Brian Poliquin has won using FPTP. (You may spot a 'No vote' choice on the right&mdash;this means that voters left the ballot blank or didn't fill it out correctly).",
"But notice out of the 144 total votes, only 67 went to him (46.5%). The problem with FPTP is that it only requires a plurality of the votes.\
 This means that a candidate may win even if a majority of the population doesn't support them.",
"Let's redo this election with a new method: Ranked Choice Voting. In this method, when you fill out a ballot, you rank the candidates that you like.\
 Hover over individual dots above to see how different voters filled out their ballots. Most voters picked only one choice&mdash;pay close attention to the green and yellow dots, however.",
"If we split up the votes, then it looks exactly the same as before. But notice we have not declared a winner, because no candidate has a majority (73) of votes supporting them yet. This is where ranking our ballots comes in: we know that Hoar cannot statistically win, but we also have information on voters' next choice. Let's see what happens.",
"We moved those who voted for Hoar to their next choice. One dot shifted to 'No vote', which means that those voters only wanted Hoar and left the rest of their ballot blank (which is totally okay!). But notice we still don't know who a majority of the citizens support. We can repeat the process, eliminating Bond and looking at her voters' next choices.",
"As it turns out, the majority of constituents in this election actually preferred Jared F. Golden. In this case, Ranked Choice Voting has produced a different winner than First Past the Post.",
"Why does this matter? Proponents of Ranked Choice Voting argue that it means that people can vote for who they want to, like third party candidates, without worrying about who others are voting for (called the 'spoiler effect'). This means we get less extreme candidates that represent the population. Critics argue that such a system is confusing and can reduce voter turnout.",
"Understanding the implications of Ranked Choice Voting compared with First Past the Post is crucial as it affects the foundation of the county: our democracy.",
"Now, you can explore Ranked Choice Voting for yourself using this simulation."
]

description.innerHTML = descriptions[0]

let step = 0;
var ballots;
var backward = false;

let update = ()=> {

	//step += 1

	description.innerHTML = descriptions[step]

	let meta;

	switch(step){
		case 0:
			d3.select("#jumpahead").style("display", "block")
			clearGraph()
			prevButton.disabled = true;

			svg.append("text")
				.attr("x", width/2)
				.attr("y", scaleY(0.4))
				.text("Ranked Choice Voting:")
				.attr("text-anchor", "middle")
				.style("font-size", "3vw")
				.attr("fill", "#A974D4")
				.attr("class", "title")
				.attr("font-weight", 900)

			svg.append("text")
				.attr("x", width/2)
				.attr("y", scaleY(0.5))
				.text("A Stronger Democracy?")
				.attr("text-anchor", "middle")
				.style("font-size", "2vw")
				.attr("fill", "#A974D4")
				.attr("class", "title")
				.attr("font-weight", 900)

			svg.append("text")
				.attr("x", width/2)
				.attr("y", scaleY(0.6))
				.text("a visual exploration by Vinay Bhaip")
				.attr("text-anchor", "middle")
				.style("font-size", "1vw")
				.attr("fill", "black")
				.attr("class", "title")



			break;
		case 1:
			d3.select("#jumpahead").style("display", "none")
			svg.selectAll(".title").remove()

			for(let i=0; i < dots.length; i++){
				dots[i]['x'] = 0.5
				dots[i]['y'] = 0.5
			}
			renderGraph(dots)
			meta = initializeElectionData(dots)
			//console.log(meta)

			//kinda weird doing this, but it works?
			dots.meta = meta;
			runRound(dots, 0, 5, 0.4, legend, fptp=true)
			break;
		case 2:
			if(backward){
				runRound(dots, 0, 5, 0.4, legend, fptp=true)
			}
			colorizeDots(dots);
			break;
		case 3:
			runRound(dots, 1, 5, 0.7, legend, true, fptp=true)
			//runRound1();
			break;
		case 4:
			if(backward){
				runRound(dots, 1, 5, 0.7, legend, true, fptp=true)
			}
			break;
		case 5:
			runRound(dots, 0, 5, 0.4, legend)
			break;
		case 6:
			runRound(dots, 1, 5, 0.7, legend)
			break;
		case 7:
			runRound(dots, 2, 5, 0.7, legend)
			break;
		case 8:
			if(backward){
				maine=true
			}
			runRound(dots, 3, 5, 0.7, legend, true)
			break;
		case 9:
			maine = false;
			break;
		case 10:
			if(backward){
				maine = true

				d3.select("#description")
					.interrupt()
					.style("opacity", 1)
					.style("width", "55vw")
				
				d3.select("#simhelp")
					.interrupt()
					.style("display", "none")

				simFPTPButton.hidden = true 
				simRankedButton.hidden = true 
				resetButton.hidden = true
				simChoiceSelect.hidden =  true


				d3.select("#simchoicecontainer")
					.style("display", "none")

				d3.select("#examples")
					.interrupt()
					.style("display", "none")

				svg.select("simheader").text("") 

				svg.selectAll("text,path,rect,.candidates").remove()

				for(let i=0; i < dots.length; i++){
					dots[i]['x'] = 0.5
					dots[i]['y'] = 0.5
				}
				renderGraph(dots)
				meta = initializeElectionData(dots)
				colorizeDots(dots)
				//console.log(meta)

				//kinda weird doing this, but it works?
				dots.meta = meta;
				runRound(dots, 3, 5, 0.7, legend, true)
				break;

			}

			break;
		case 11:
			maine=false;
			drawSimulationInit()
			drawSimulation()
			clearGraph()
			updateSimulationInit()

			
			d3.select("#description")
				.transition()
				.delay(3000)
				.transition()
				.duration(1000)
				.style("opacity", 0)
				.transition()
				.duration(1000)
				.style("width", "0vw")



			nextButton.disabled = true;
			resetButton.disabled= true 
			//ballots = simulate(candidates, 200)
			//colorizeDots(ballots)
			//meta = initializeElectionData(ballots, candidates)
			//ballots.meta = meta
			////console.log(meta)
			//runRound(ballots, 0, 2, 0.5, legend)
			break;
		case 12:
			break;
	}

};

nextButton.onclick = () => {
	backward = false;
	step += 1;
	prevButton.disabled = false;
	update()
}

prevButton.onclick = () => {
	backward = true;
	step -= 1;
	nextButton.disabled = false;
	update()
}

function jumpAhead() {
	svg.selectAll(".title").remove()
	d3.select("#jumpahead").style("display", "none")

	step = 11;
	update()
	nextButton.disabled=true;
	prevButton.disabled=false;

}

d3.select("body")
	.style("opacity", 0)
	.transition()
	.duration(1000)
	.style("opacity", 1)


update()


//for testing
//step = 8
