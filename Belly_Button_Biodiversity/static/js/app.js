function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log(data)
    var metadata = d3.select("#sample-metadata");
 
    // Use `.html("") to clear any existing metadata
    metadata.html("");
 
    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(data).forEach(([key, value]) => {
      metadata.append("h6").text(`${key}: ${value}`);
    });
 
   
  });

}


 // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function buildCharts(sample) {
  console.log(sample)
  console.log("starting of plot for Pie Chart");
  var descriptions=[];

  d3.json("/samples/" + sample).then(function(response){
    //   if(error) console.warn(error);
    console.log('Plot Pie Inside');
    console.log(response);
      var pielabels=response['otu_ids'].slice(0,10);
      var pievalues=response['sample_values'].slice(0,10);
      var piedescription=response['otu_labels'].slice(0,10);
    //   for(var i=0;i<10;i++){
    //       pielabels.push(response.otu_ids[i]);
    //       pievalues.push(response.sample_values[i]);
    //       piedescription.push(response.otu_labels[i]);
    //       }
      console.log("pielabels " + pielabels) ;
      console.log("pievalues " + pievalues) ;
      console.log("piedescription " + piedescription)   ; 
      var trace1 = { 
          values: pievalues,
          labels: pielabels,
          type:"pie",
          name:"Top 10 Samples",
          textinfo:"percent",
          text: piedescription,
          textposition: "inside",
          hoverinfo: 'label+value+text+percent'
      }
      var data=[trace1];
      var layout={
          title: "<b>Top 10 Samples: " + sample + "</b>"
        //   height: 450,
        //   //height: 400,
        //   width: 500,
        //   margin: {
        //       l: 10,
        //       r: 10,
        //       b: 5,
        //       t: 5,
        //       pad: 5
            // },
      }
      console.log("ready to plot pie chart")
      Plotly.newPlot("pie",data,layout);
  })


    // @TODO: Build a Bubble Chart using the sample data

    console.log("Beginning Bubble Chart");
    d3.json("/samples/"+sample).then(function(response){
      console.log(response)
      var scatter_description = response['otu_labels'];
      console.log("logging scatter_description list")
      console.log(scatter_description.slice(0,10))
      var trace1 = {
        x: response['otu_ids'],
        y: response['sample_values'],
        marker: {
            size: response['sample_values'],
            color: response['otu_ids'].map(d=>100+d*20),
            colorscale: "Earth"
        },
        type:"scatter",
        mode:"markers",
        text: scatter_description,
        hoverinfo: 'x+y+text',
    };
    console.log("trace1" + trace1)
      var data = [trace1];
      console.log(data)
      var layout = {
          xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
          yaxis:{title: "# of germs in Sample",zeroline:true, hoverformat: '.2r'},
          height: 500,
          width:1200,
          margin: {
              l: 100,
              r: 10,
              b: 70,
              t: 10,
              pad: 5
            },
          hovermode: 'closest',
      };
      console.log(layout)
      console.log("starting scatter plot/bubble chart")
      Plotly.newPlot("bubble",data,layout);
      
  })
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample)
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
