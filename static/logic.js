
//----- Helper functions -----

// returns team colors from team_colors.js
function get_team_colors(team) {
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

  var resize = 0.5;
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
  var newTitle = 'Offensive Rating vs. Defensive Rating vs. Winning % for ' + year;
  bubbleChart.options.title.text = newTitle;

  bubbleChart.update();
  d3.select("#winner").text(champions.filter(e => e.year==year)[0].team);
}

// update charts with new year input
function yearUpdate(year) {
  updateChart(year);
}







// initialize bubble chart with 2019 data
season_stats.forEach(function(d) {
  d.win_loss_pct = +(d.win_loss_pct *100).toFixed(2)
});

var year = 2019;
var year_stats = season_stats.filter(e => e.season === year);

var resize = 0.5;
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
    }
});

var bubbleChart = new Chart(document.getElementById("bubble-chart"), {
    type: 'bubble',
    data: {
      datasets: year_data
    },
    options: {
      title: {
        display: true,
        text: 'Offensive Rating vs. Defensive Rating vs. Winning % for ' + year,
        fontSize: 24
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
      }, tooltips: {
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
      }, legend: {
          display: true,
          position: 'left'
      }
    }
});

// display 2019 winner of championship
d3.select("#winner").text(champions.filter(e => e.year==2019)[0].team);



// var x1 = [];
// var x2 = [];
// for (var i = 1; i < 500; i++) {
// 	k = Math.random();
// 	x1.push(Math.random() + 1);
// 	x2.push(Math.random() + 1.1);
// }
// var trace1 = {
//   x: x1,
//   type: "histogram",
//   opacity: 0.5,
//   marker: {
//      color: 'green',
//   },
// };
// var trace2 = {
//   x: x2,
//   type: "histogram",
//   opacity: 0.6,
//   marker: {
//      color: 'red',
//   },
// };

// var data = [trace1, trace2];
// var layout = {barmode: "overlay"};
// Plotly.newPlot('myDiv', data, layout);




// population options list with season years
var seasonSelect = d3.select("#season-select");
createOptions(seasonSelect, champions.map(e => e.year));

// display data table
createTable();
