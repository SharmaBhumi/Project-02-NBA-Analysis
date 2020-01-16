console.log(season_stats);

season_stats.forEach(function(d) {
    d.win_loss_pct = +(d.win_loss_pct *100).toFixed(2)
});

function get_team_colors(team) {
  return team_colors.filter(e =>e.team === team )[0];
}

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


// function addData(chart, label, data) {
function addData(chart, data) {
    // chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function updateChart(chart, year) {
  removeData(chart);

  var year_stats = season_stats.filter(e => e.season === year);
  console.log(year_stats);

  var resize = 0.1;
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

  addData(chart, year_data);
}


var year = 2019


var year_stats = season_stats.filter(e => e.season === year)

var resize = 0.5
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

var chart = new Chart(document.getElementById("bubble-chart"), {
    type: 'bubble',
    data: {
      datasets: year_data
    },
    options: {
      title: {
        display: true,
        text: 'Offensive Rating vs. Defensive Rating vs. Winning %'
      }, scales: {
        yAxes: [{ 
          scaleLabel: {
            display: true,
            labelString: "Defensive Rating"
          }
        }],
        xAxes: [{ 
          scaleLabel: {
            display: true,
            labelString: "Offensive Rating"
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

var seasonSelect = d3.select("#season-select")

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
};

createOptions(seasonSelect, champions.map(e => e.year));

function buttonClick() {
  var seasonValue = d3.select("#season-select").property("value");
  console.log(seasonValue);
}

d3.select("#season-btn").on("click", buttonClick);


// console.log(champions)

var x1 = [];
var x2 = [];
for (var i = 1; i < 500; i++)
{
	k = Math.random();
	x1.push(Math.random() + 1);
	x2.push(Math.random() + 1.1);
}
var trace1 = {
  x: x1,
  type: "histogram",
  opacity: 0.5,
  marker: {
     color: 'green',
  },
};
var trace2 = {
  x: x2,
  type: "histogram",
  opacity: 0.6,
  marker: {
     color: 'red',
  },
};

var data = [trace1, trace2];
var layout = {barmode: "overlay"};
Plotly.newPlot('myDiv', data, layout);
