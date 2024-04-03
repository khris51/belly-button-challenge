          
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


let data = d3.json(url).then(function(data) {
    console.log(data);
});


function init () {
    
    let dropdownMenu = d3.select("#selDataset");
    
    d3.json(url).then(function(data) {
        let sampleNames = data.names;
        
        sampleNames.forEach((name) => {
            
            dropdownMenu.append("option")
            .text(name)
            .property("value", name);
        });
          
        
          let firstSample = sampleNames[0]
          
          buildBarPlot(firstSample);
          buildBubblePlot(firstSample);
          buildMetadata(firstSample);
  });
};

init()

function buildMetadata (sampleID) {
  
  d3.json(url).then(function(data) {
      let metadata = data.metadata;
      
      let sampleArray = metadata.filter(sample => sample.id == sampleID);
      
      let sample = sampleArray[0];
      
      let panel = d3.select("#sample-metadata");
      panel.html("");
      
      for (key in sample) {
          panel.append("h6").text(key.toUpperCase()+": "+sample[key])
      }

      console.log(sample);

      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: sample.wfreq,
          title: { text: "<b>Belly Buton Washing Frequency</b><br>per Week" },
          type: "indicator",
          mode: "gauge+number",
          delta: { reference: 400 },
          gauge: { axis: { range: [null, 9] } }
        }
      ];
      
      var layout = { width: 600, height: 400 };
      Plotly.newPlot('gauge', data, layout);
  })
}


function buildBarPlot (sampleID) {
  d3.json(url).then(function(data) {
      let samples = data.samples;
  
      
  let sampleArray = samples.filter(sample => sample.id == sampleID);
  let sample = sampleArray[0];
  
  
  let otu_ids = sample.otu_ids
  let sample_values = sample.sample_values
  let otu_labels = sample.otu_labels
  
  
  let trace1 = [
      {x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h" }
  ];

  
  let layout = {
      title:""
  };
  
  Plotly.newPlot("bar", trace1, layout)
  });
};

function buildBubblePlot (sampleID) {
  d3.json(url).then(function(data) {
      let samples = data.samples;
  
  let sampleArray = samples.filter(sample => sample.id == sampleID);
  let sample = sampleArray[0];
  
  
  let otu_ids = sample.otu_ids
  let sample_values = sample.sample_values
  let otu_labels = sample.otu_labels

  let trace2 = [
      {x: otu_ids,
       y: sample_values,
       text: otu_labels,
       mode:"markers",
       marker:{
          size: sample_values, 
          color: otu_ids,
          colorscale: "Earth"
       }
       
      }];
  
  let layout = {
      xaxis: {title:"OTU ID"},
      width: '100%'
  };
  
  Plotly.newPlot("bubble", trace2,layout)
  });
};
function optionChanged (sampleID) {
buildMetadata (sampleID);
buildBarPlot (sampleID);
buildBubblePlot (sampleID);

};