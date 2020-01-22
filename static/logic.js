
// constants
const resize = 0.5;

//----- Helper functions -----

// returns team colors from team_colors.js
function get_team_colors(team) {
  // console.log(team_colors.filter(e =>e.team === team )[0]);
  return team_colors.filter(e =>e.team === team )[0];
}

// populates select tag with options
function createOptions (sel, array) {
  var options = sel.selectAll("option")
   .data(array)
   .enter()
   .append("option");
 
  options.text(function(d) {
     return d;
  })
   .attr("value", function(d) {
     return d;
  });
}

// creates table view of data 
function createTable() {
  document.addEventListener("DOMContentLoaded", function() {
    new FancyGrid({
      title: 'Season Stats',
      renderTo: 'stats-table',
      width: 700,
      height: 500,
      data: season_stats,
      paging: true,
      columns: [{
      index: 'season',
      title: 'Season',
      type: 'string',
      filter:{header: true},
      width: 100
      },{
      index: 'team',
      title: 'Team',
      type: 'string',
      filter:{header: true},
      width: 150
      },{
      index: 'win_loss_pct',
      title: 'Winning Percentage',
      type: 'number',
      width: 150
      },{
      index: 'drtg',
      title: 'Defensive Rating',
      type: 'number',
      width: 120
      },{
      index: 'ortg',
      title: 'Offensive Rating',
      type: 'number',
      flex: 1
      }]
    });
  });
}

// updates bubble chart with new year input
function updateChart(year) {
  var year_stats = season_stats.filter(e => e.season == year);
  var year_data = year_stats.map(e => {
      return {
          label: [e.team],
          backgroundColor: get_team_colors(e.team)['color1'],
          borderColor: get_team_colors(e.team)['color2'],
          borderWidth: 2.5,
          data: [{
              x: e.ortg,
              y: e.drtg,
              r: e.win_loss_pct *resize
          }]
      };
  });

  bubbleChart.data.datasets = year_data;
  bubbleChart.options.title.text = 'Offensive Rating vs. Defensive Rating vs. Winning % for ' + year;

  bubbleChart.update();

  // display winner of championship
  d3.select("#winner").text(champions.filter(e => e.year==year)[0].team);
}

// updates histogram with new year input
function updateHistogram(year) {
  var year_stats = season_stats.filter(e => e.season == year);
  var of_rtg = year_stats.map(e => e.ortg);
  var df_rtg = year_stats.map(e => e.drtg);

  var update = {
    x: [of_rtg, df_rtg]
  }

  var layout_update = {
    title: "Count of Teams by Defensive/Offensive Ratings in " + year,
  };
  var data_update;

  Plotly.restyle('histogram', update, [0, 1]);
  Plotly.update('histogram', data_update, layout_update, [0,1]);
}


// update line chart with team for new year
function updateLineChart(year){
  var team=champions.filter(e => e.year==year)[0].team;
  // console.log(team);
  updateLChart(team,year);
};

function updateLChart(team,year){
  var new_team_stats = season_stats.filter(e => e.team === team);
  console.log(new_team_stats);
  var new_team_data = {
    labels: new_team_stats.map(e => e.season),
    datasets: [{
      data: new_team_stats.map(e => e.drtg),
      label: "Defensive Rating",
      borderColor: "#007a33",
      // get_team_colors(e.team)['color1'],
      fill: false
    }, {
      data: new_team_stats.map(e => e.ortg),
      label: "Offensive Rating",
      borderColor: "#ba9653",
      // get_team_colors(e.team)['color2'],
      fill: false
    }]
  }
  console.log(new_team_data);
  new Chart(document.getElementById("line-chart"), {
    type: 'line',
    
    data: new_team_data,
    options: {
      title: {
        display: true,
        text: 'Defensive Rating vs. Offensive Rating for ' +year+' Champion '+team ,
        fontSize: 16
      }
      ,
      scales: {
    //     yAxes: [{
    //         ticks: { 
    //             beginAtZero: true
    //         }
    //     }]
    xAxes: [{
      ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 60
      }
  }]
    }
      
    }
  });

};

// update charts with new year input
function yearUpdate(year) {
  updateChart(year);
  updateHistogram(year);
  updateLineChart(year);
}

// convert percentage
season_stats.forEach(function(d) {
  d.win_loss_pct = +(d.win_loss_pct *100).toFixed(2);
  d.ortg = +d.ortg.toFixed(2);
  d.drtg = +d.drtg.toFixed(2);
});

// initialize bubble chart
var bubbleChart = new Chart(document.getElementById("bubble-chart"), {
    type: 'bubble',
    options: {
      title: {
        display: true,
        fontSize: 24
      }, layout: {
        padding: 50
      }, scales: {
        yAxes: [{ 
          scaleLabel: {
            display: true,
            labelString: "Defensive Rating",
            fontSize: 16
          }
        }],
        xAxes: [{ 
          scaleLabel: {
            display: true,
            labelString: "Offensive Rating",
            fontSize: 16
          }
        }]
      }, 
      tooltips: {
        callbacks : {
          label: function(t, d) {
            return d.datasets[t.datasetIndex].label;
          },
          afterLabel: function(t,d) {
            var datapoint = d.datasets[t.datasetIndex];
            var rLabel = datapoint.data[t.index].r;

            return [
              `Ortg: ${t.xLabel}`,
              `Drtg: ${t.yLabel}`,
              `Win %: ${(rLabel/resize).toFixed(2)}%`
            ];
          }
        }
      }, 
      legend: {
          display: true,
          position: 'left'
      }
    }
});

// initialize histogram

var trace1 = {
  type: "histogram",
  name: "Offensive Rating",
  opacity: 0.5,
  marker: {
     color: 'green',
  },
};
var trace2 = {
  type: "histogram",
  name: "Defensive Rating",
  opacity: 0.6,
  marker: {
     color: 'red',
  },
};
var data = [trace1, trace2];
var layout = {barmode: "overlay",
  bargap: 0.01, 
  bargroupgap: 0.0, 
  xaxis: {title: "Rating"}, 
  yaxis: {title: "Count"}  
};
Plotly.newPlot('histogram', data, layout);


// population options list with season years
var seasonSelect = d3.select("#season-select");
createOptions(seasonSelect, champions.map(e => e.year));

// display data table
createTable();


// js for slider
var rangeslider = document.getElementById("sliderRange"); 
var output = document.getElementById("sliderValue"); 
output.innerHTML = rangeslider.value; 
  
rangeslider.oninput = function() { 
  yearInput = this.value;
  output.innerHTML = yearInput;
  yearUpdate(yearInput);
} 

yearUpdate(rangeslider.value)

// initialize Line chart
var team ='Toronto Raptors';
var team_stats = season_stats.filter(e => e.team === team);

var team_data = {
  labels: team_stats.map(e => e.season),
  datasets: [{
    data: team_stats.map(e => e.drtg),
    label: "Defensive Rating",
    borderColor: get_team_colors(team)['color1'],
    fill: false
  }, {
    data: team_stats.map(e => e.ortg),
    label: "Offensive Rating",
    borderColor: get_team_colors(team)['color2'],
    fill: false
  }]
}
// an instance of a line chart
var lineChart= new Chart(document.getElementById("line-chart"), {
  type: 'line',
  
  data: team_data,
  options: {
    title: {
      display: true,
      text: 'Defensive Rating vs. Offensive Rating for 2019 Champion ' +team ,
      fontSize: 16
    }
    ,
    scales: {
  //     yAxes: [{
  //         ticks: { 
  //             beginAtZero: true
  //         }
  //     }]
  xAxes: [{
    ticks: {
        autoSkip: false,
        maxRotation: 90,
        minRotation: 60
    }
}]
  }
    
  }
});


// console.log(lineChart)

// populate the drop down list with team names for line chart
var team_names=[];
for(var i = 0; i < 37; i++) {
  var team_name=team_colors[i].team
  team_names.push(team_name );
  // console.log(team_colors[i].team);
};
// console.log(team_names);

var select = document.getElementById("selectTeam");
// createOptions (sel, team_names);
select.innerHTML = "";
// Populate list with options:
for(var i = 0; i < team_names.length; i++) {
    var opt = team_names[i];
    // select.innerHTML += "<option value=\" " + opt + "\">" + opt + "</option>";
    select.innerHTML += "<option value=\" " + " " + "\">"+ opt + "</option>";
}



// Function runs on chart type select update
function updateChartType() {
  // here we destroy/delete the old or previous chart and redraw it again
  lineChart.destroy();
  updated_team=toString(document.getElementById("selectTeam").value);
  console.log(updated_team);
  updateLChart(updated_team);
  
};