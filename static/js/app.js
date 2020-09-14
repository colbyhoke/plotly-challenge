const dropdown = d3.select("#selDataSet"); // Grab the dropdown html element

/**
 * Populate dropdown menu with the test subject names.
 * Initial state.
 */
function init(){
    d3.json("../../data/samples.json").then((data) => {
        data.names.forEach((name) => { // Go through each name in samples.json
            dropdown.append("option").text(name).property("value"); // Add each value to the dropdown
        });
    });
};

/**
 * Build dashboard when subject is selected.
 * 
 * @param {string} selectedSubject
 */
function optionChanged(selectedSubject) {
    console.log("Selection: " + selectedSubject)
    makePlots(selectedSubject);
    fillInfo(selectedSubject);
};

/**
 * 
 * 
 * @param {*} subjectID 
 */
function makePlots(subjectID){
    d3.json("../../data/samples.json").then((data) => {

        var sample = data.samples.filter(s => s.id.toString() === subjectID)[0]; // Comment

        var otuValues = sample.sample_values; // For bubble chart
        var otuIDs = sample.otu_ids; // For bubble chart
        var otuLabels = sample.otu_labels; // For bubble chart

        var otuValuesTop10 = otuValues.slice(0,10).reverse(); // For bar chart
        var otuIDsTop10 = otuIDs.slice(0,10).reverse().map(id => "OTU: " + id); // For bar chart
        var otuLabelsTop10 = otuLabels.slice(0,10); // For bar chart
        
        // Build the bar graph
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
        console.log("test");

        Plotly.newPlot("bar", data1, layout1); // Display the bar graph

        // Build the bubble chart
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

        var layout2 = {
            title: 'Bubble Chart',
            showlegend: false,
            //height: 400,
            //width: 600
        };

        Plotly.newPlot("bubble", data2, layout2);

    });
};

/**
 * 
 * 
 * @param {*} subjectID 
 */
function fillInfo(subjectID) {
    d3.json("../../data/samples.json").then((data) => {
        
        var metadataField = d3.select("#sample-metadata");

        var subjectData = data.metadata.filter(s => s.id.toString() === subjectID)[0];
        
        metadataField.html(""); // Clear out before populating with new info

        Object.entries(subjectData).forEach((key) => {
            metadataField.append("p").text(key[0] + ": " + key[1] + "\n");
        });
    });
};

init();