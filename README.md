<img src="https://github.com/vbhaip/ranked-choice/raw/main/images/banner.png" height="300px" />


### Background

This repository contains the code for https://vinaybhaip.com/ranked-choice. This data visualization provides a visual walk-through of the Maine 2018 2nd Congressional District Election to explain Ranked Choice Voting and then provides an election simulation system to explore the differences between the current system and Ranked Choice Voting.


### How It Works

This project uses D3.js for the visualization. For simulating elections, the program samples from the selected distribution (normal, bimodal, uniform, left-skewed, right-skewed) to decide where each voter lies on the ideological spectrum. Then, the program looks at the location of each voter in relation to each candidate's position on the ideological spectrum to determine which candidates each voter would vote for. The simulation includes a randomness factor to more accurately reflect the true nature of elections.  

### Acknowledgements

This project was created for the class SARC 5400: Data Visualization, taught by Professor Eric Field at the University of Virginia. The processed election data for the Maine Election comes from [ranked.vote's Github repositories](https://github.com/ranked-vote).
