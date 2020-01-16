// console.log(champions);
console.log(season_stats);

function get_team_colors(team) {
    return team_colors.filter(e =>e.team === team )[0]
};

console.log(get_team_colors('Atlanta Hawks'))


season_stats.forEach(function(d) {
    d.win_loss_pct = +(d.win_loss_pct *10).toFixed(2)
});

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






function addData(chart, label, data) {
    chart.data.labels.push(label);
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



var year = 2020

var year_stats = season_stats.filter(e => e.season === year)
console.log(year_stats)

year_data = year_stats.map(e => {
    return {
        label: [e.team],
        backgroundColor: get_team_colors(e.team)['color2'],
        borderColor: get_team_colors(e.team)['color1'],
        data: [{
            x: e.ortg,
            y: e.drtg,
            r: e.win_loss_pct *5
        }]
    }
})


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
      },
      legend: {
          display: true,
          position: 'left'
      }
    }
});
  


// document.addEventListener("DOMContentLoaded", function() {
//     new FancyGrid({
//         renderTo: 'table',
//         width: 500,
//         height: 400,
//         data: champions,
//         columns: [{
//         index: 'year',      
//         title: 'Season',
//         type: 'string',
//         width: 100
//         },{
//         index: 'team',
//         title: 'Team',
//         type: 'string',
//         width: 100
//         }]
//     });
// });


