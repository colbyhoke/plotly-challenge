const dropdown = d3.select("#selDataSet"); // Grab the dropdown html element




/**
 * Populate the dropdown menu with the test subject names
 * 
 */
function init(){
    d3.json("../../data/samples.json").then((data) => {
        data.names.forEach((name) => { // Go through each name in samples.json
            dropdown.append("option").text(name).property("value"); // Add each value to the dropdown
        });
    });
};





/**
 * 
 * @param {*} subjectID 
 */
function makePlots(subjectID){
    d3.json("../../data/samples.json").then((data) => {
        // console.log(data.names);

        var sample = data.samples.filter(s => s.id.toString() === subjectID)[0];
        //console.log(sample);

        var otuValues = (sample.sample_values.slice(0,10)).reverse();
        //console.log(otuValues);

        var otuIDs = (sample.otu_ids.slice(0,10)).reverse().map(id => "OTU: " + id);
        console.log(otuIDs);

        var otuLabels = sample.otu_labels.slice(0,10);
        //console.log(otuLabels);
        
        var trace = {
            x: otuValues,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        var data = [trace];

        var layout = {
            title: "Top 10 OTUs for Test Subject: " + subjectID,
            xaxis: {
                title: "OTU Value"
            }
        };

        Plotly.newPlot("bar", data, layout);

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





/**
 * 
 * 
 * @param {*} selectedSubject
 */
function optionChanged(selectedSubject) {
    console.log("Selection: " + selectedSubject)
    makePlots(selectedSubject);
    fillInfo(selectedSubject);
};

init();