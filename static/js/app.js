const dropdown = d3.select("#selDataSet"); // Grab the dropdown html element

/**
 * Populate dropdown menu with the test subject names.
 * Initial state.
 */
function init(){
    d3.json("data/samples.json").then(function(data) {
        data.names.forEach((name) => { // Go through each name in samples.json
            dropdown.append("option").text(name).property("value"); // Add each value to the dropdown in ../../index.html
        });
    });
};

/**
 * Build dashboard when subject is selected.
 * Calls the functions to build the various parts of the dashboard and passes the selected ID to them.
 * 
 * @param {string} selectedSubject
 */
function optionChanged(selectedSubject) {
    console.log("Selection: " + selectedSubject)
    
    fillInfo(selectedSubject);
    makeBarBubblePlots(selectedSubject);
    makeGaugePlot(selectedSubject);  
};

/**
 * Populate demographics field.
 * 
 * @param {string} subjectID 
 */
function fillInfo(subjectID) {
    d3.json("data/samples.json").then((data) => {
        
        const metadataField = d3.select("#sample-metadata"); // Where the info will be filled on index.html

        var subjectData = data.metadata.filter(s => s.id.toString() === subjectID)[0]; // Filter by selected ID
        
        metadataField.html(""); // Clear out html before populating with new info

        Object.entries(subjectData).forEach((key) => { // Iterate through the filtered data
            if (key[1] == null){ // Check for nulls
                metadataField.append("p").text(key[0] + ": No data" + "\n"); // Print "no data" for null values
            }
            else{
                metadataField.append("p").text(key[0] + ": " + key[1] + "\n"); // Otherwise, print the value
            }
        });
    });
};

/**
 * Build the bar chart and bubble plot.
 * 
 * @param {string} subjectID
 */
function makeBarBubblePlots(subjectID){
    d3.json("data/samples.json").then((data) => {

        console.log(subjectID); // Confirm selection

        // Set variable to be used by all charts
        var sample = data.samples.filter(s => s.id.toString() === subjectID)[0]; // Filter by selected ID

        // Gather data from json file
        var otuValues = sample.sample_values; // For both charts, but used explicitly by bubble chart
        var otuIDs = sample.otu_ids; // For both charts, used explicitly by bubble chart
        var otuLabels = sample.otu_labels; // For both charts, used explicitly by bubble chart

        // Need to slice the values above to limit to 10 items
        var otuValuesTop10 = otuValues.slice(0,10).reverse(); // For bar chart
        var otuIDsTop10 = otuIDs.slice(0,10).reverse().map(id => "OTU: " + id + " "); // Show IDs on the side and give them room
        var otuLabelsTop10 = otuLabels.slice(0,10); // Grab the name of the OTU
        
        // Build the bar graph
        console.log("Building bar chart");

        var trace1 = { 
            x: otuValuesTop10,
            y: otuIDsTop10,
            text: otuLabelsTop10,
            type: "bar",
            orientation: "h"
        };

        var data1 = [trace1]; 

        var layout1 = {
            title: "Top 10 OTUs for Test Subject: " + subjectID,
            xaxis: {
                title: "OTU Value"
            }
        };

        // Build the bubble chart
        console.log("Building bubble chart");

        var trace2 = {
            x: otuIDs,
            y: otuValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuIDs,
                size: otuValues
            }
        };

        var data2 = [trace2]; 

        // Build the plot's layout
        var layout2 = {
            title: 'Bubble Chart',
            showlegend: false,
            width: 1200
        };

        // Plot the bar graph
        Plotly.newPlot("bar", data1, layout1);

        // Plot the bubble chart
        Plotly.newPlot("bubble", data2, layout2);
    });
};

/**
 * 
 * 
 * BONUS WORK
 * Note: I couldn't get the speedometer approach to work...
 * 
 * @param {string} subjectID 
 */
function makeGaugePlot(subjectID){
    d3.json("data/samples.json").then((data) => {
        var gaugeSample = data.metadata.filter(s => s.id.toString() === subjectID)[0]; // Filter by selected ID
        var washFreqValue = gaugeSample.wfreq; // Get the wash frequency
        
        console.log(washFreqValue);

        // BONUS:
        // Build gauge chart
        // Adapted from: https://plotly.com/python/gauge-charts/
        var trace3 = {
            type: "indicator",
            mode: "gauge+number", // Use plotly's gauge
            value: washFreqValue,
            title: "<b>Belly Button Washing Frequency<b><br>Scrubs per week",
            gauge: {
                axis: {
                    range: [0, 9],
                    tickwidth: 1,
                    tickcolor: "black"
                },
                bar: { 
                    color: "gray" // Color of the bar
                },
                bgcolor: "white",
                ticks: "outside",
                borderwidth: 2,
                bordercolor: "black",
                steps: [ // Set colors for each step (used color picker to match homework example) 
                    { range: [0, 1], color: "rgb(247, 243, 246)" },
                    { range: [1, 2], color: "rgb(244, 241, 230)" },
                    { range: [2, 3], color: "rgb(233, 230, 204)" },
                    { range: [3, 4], color: "rgb(230, 231, 182)" },
                    { range: [4, 5], color: "rgb(216, 227, 162)" },
                    { range: [5, 6], color: "rgb(187, 203, 150)" },
                    { range: [6, 7], color: "rgb(150, 190, 139)" },
                    { range: [7, 8], color: "rgb(147, 186, 145)" },
                    { range: [8, 9], color: "rgb(142, 179, 140)" }
                ],
                threshold : { // Use a red threshold indicator to "cap" the bar drawn for better visibility
                    line: {
                        color: "red",
                        width: 4
                    },
                    thickness: 0.8,
                    value: washFreqValue
                }
            }
        };

        var data3 = [trace3];

        // Build the plot's layout
        var layout3 = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 }
        }
    
        // Plot it
        Plotly.newPlot("gauge", data3, layout3);
    });
};

// Initial state.
init();