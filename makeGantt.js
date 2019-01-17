var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
  top: 20,
  right: 40,
  bottom: 20,
  left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.selectAll(".svg")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "svg");

// Placedholder code for onBrowserResize event listener
// window.onresize = doALoadOfStuff;
//
// function drawSVG() {
//     //do a load of stuff
// }

var eventData = [{
    "Task": "Job-1",
    "Start": 1,
    "Finish": 2,
    "Resource": "Complete"
  },
  {
    "Task": "Job-1",
    "Start": 15,
    "Finish": 15,
    "Resource": "Incomplete"
  },
  {
    "Task": "Job-2",
    "Start": 17,
    "Finish": 17,
    "Resource": "Not Started"
  },
  {
    "Task": "Job-2",
    "Start": 17,
    "Finish": 17,
    "Resource": "Complete"
  },
  {
    "Task": "Job-3",
    "Start": 10,
    "Finish": 20,
    "Resource": "Not Started"
  },
  {
    "Task": "Job-3",
    "Start": 1,
    "Finish": 20,
    "Resource": "Not Started"
  },
  {
    "Task": "Job-3",
    "Start": 18,
    "Finish": 18,
    "Resource": "Not Started"
  },
  {
    "Task": "Job-4",
    "Start": 14,
    "Finish": 14,
    "Resource": "Complete"
  }
];

function checkUnique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

function getCounts(arr) {
    var i = arr.length, // var to loop over
        obj = {}; // obj to store results
    while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
    return obj;
}


function getCount(word, arr) {
    return getCounts(arr)[word] || 0;
}

var resources = new Array();
for (var i = 0; i < eventData.length; i++) {
  resources.push(eventData[i].Resource);
}
var resourcesUnfiltered = resources;
resources = checkUnique(resources);


var timeScale = d3.scaleLinear()
  .domain([d3.min(eventData, function(d) {
      return d.Start
    }),
    d3.max(eventData, function(d) {
      return d.Finish
    })
  ])
  .range([0, width - 150]);

var title = svg.append("text")
  .text("Gantt Chart")
  .attr("x", width / 2)
  .attr("y", 25)
  .attr("text-anchor", "middle")
  .attr("font-size", 18)
  .attr("fill", "#000");


function drawRects(eventData, theGap, theTopPad, theSidePad, theBarHeight, width, height) {

  var bigRects = svg.append("g")
    .selectAll("rect")
    .data(eventData)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d, i) {
      return i * theGap + theTopPad - 2;
    })
    .attr("width", function(d) {
      return width - theSidePad / 2;
    })
    .attr("height", theGap)
    .attr("stroke", "none")
    // .attr("fill", function(d) {
    //   for (var i = 0; i < resources.length; i++) {
    //     if (d.type == resources[i]) {
    //       return d3.rgb(theColorScale(i));
    //     }
    //   }
    // })
    .attr("opacity", 0.2);


  var rectangles = svg.append('g')
    .selectAll("rect")
    .data(eventData)
    .enter();


  var innerRects = rectangles.append("rect")
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("x", function(d) {
      return timeScale(d.Start) + theSidePad;
    })
    .attr("y", function(d, i) {
      return i * theGap + theTopPad;
    })
    .attr("width", function(d) {
      return (timeScale(d.Finish) - timeScale(d.Start));
    })
    .attr("height", theBarHeight)
    .attr("stroke", "none")
    // .attr("fill", function(d) {
    //   for (var i = 0; i < resources.length; i++) {
    //     if (d.type == resources[i]) {
    //       return d3.rgb(theColorScale(i));
        // }
      // }
    // })


  var rectText = rectangles.append("text")
    .text(function(d) {
      return d.task;
    })
    .attr("x", function(d) {
      return (timeScale(d.Finish) - timeScale(d.Start)) / 2 + timeScale(d.Start) + theSidePad;
    })
    .attr("y", function(d, i) {
      return i * theGap + 14 + theTopPad;
    })
    .attr("font-size", 11)
    .attr("text-anchor", "middle")
    .attr("text-height", theBarHeight)
    .attr("fill", "#fff");


  rectText.on('mouseover', function(e) {
    // console.log(this.x.animVal.getItem(this));
    var tag = "";

    if (d3.select(this).data()[0].details != undefined) {
      tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
        "Type: " + d3.select(this).data()[0].type + "<br/>" +
        "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
        "Ends: " + d3.select(this).data()[0].endTime + "<br/>" +
        "Details: " + d3.select(this).data()[0].details;
    } else {
      tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
        "Type: " + d3.select(this).data()[0].type + "<br/>" +
        "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
        "Ends: " + d3.select(this).data()[0].endTime;
    }
    var output = document.getElementById("tag");

    var x = this.x.animVal.getItem(this) + "px";
    var y = this.y.animVal.getItem(this) + 25 + "px";

    output.innerHTML = tag;
    output.style.top = y;
    output.style.left = x;
    output.style.display = "block";
  }).on('mouseout', function() {
    var output = document.getElementById("tag");
    output.style.display = "none";
  });


  innerRects.on('mouseover', function(e) {
    //console.log(this);
    var tag = "";

    if (d3.select(this).data()[0].details != undefined) {
      tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
        "Type: " + d3.select(this).data()[0].type + "<br/>" +
        "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
        "Ends: " + d3.select(this).data()[0].endTime + "<br/>" +
        "Details: " + d3.select(this).data()[0].details;
    } else {
      tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
        "Type: " + d3.select(this).data()[0].type + "<br/>" +
        "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
        "Ends: " + d3.select(this).data()[0].endTime;
    }
    var output = document.getElementById("tag");

    var x = (this.x.animVal.value + this.width.animVal.value / 2) + "px";
    var y = this.y.animVal.value + 25 + "px";

    output.innerHTML = tag;
    output.style.top = y;
    output.style.left = x;
    output.style.display = "block";
  }).on('mouseout', function() {
    var output = document.getElementById("tag");
    output.style.display = "none";

  });



}


function makeGrid(theSidePad, theTopPad, w, h) {

  var xAxis = d3.axisBottom()
    .scale(timeScale)
    .ticks(1)
    .tickSize(-h + theTopPad + 20, 0, 0);

  var grid = svg.append('g')
    .attr('class', 'grid')
    .attr('transform', 'translate(' + theSidePad + ', ' + (h - 50) + ')')
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("fill", "#000")
    .attr("stroke", "none")
    .attr("font-size", 10)
    .attr("dy", "1em");
}

function vertLabels(theGap, theTopPad, theSidePad, theBarHeight, theColorScale) {
  var numOccurances = new Array();
  var prevGap = 0;

  for (var i = 0; i < resources.length; i++) {
    numOccurances[i] = [resources[i], getCount(resources[i], resourcesUnfiltered)];
  }

  var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
    .selectAll("text")
    .data(numOccurances)
    .enter()
    .append("text")
    .text(function(d) {
      return d[0];
    })
    .attr("x", 10)
    .attr("y", function(d, i) {
      if (i > 0) {
        for (var j = 0; j < i; j++) {
          prevGap += numOccurances[i - 1][1];
          // console.log(prevGap);
          return d[1] * theGap / 2 + prevGap * theGap + theTopPad;
        }
      } else {
        return d[1] * theGap / 2 + theTopPad;
      }
    })
    .attr("font-size", 11)
    .attr("text-anchor", "start")
    .attr("text-height", 14)
    .attr("fill", function(d) {
      for (var i = 0; i < resources.length; i++) {
        if (d[0] == resources[i]) {
          //  console.log("true!");
          return d3.rgb(theColorScale(i)).darker();
        }
      }
    });

}


function makeGantt(taskArray, pageWidth, pageHeight) {

  var barHeight = 20;
  var gap = barHeight + 4;
  var topPadding = 75;
  var sidePadding = 75;

  var colorScale = d3.scaleLinear()
    .domain([0, resources.length])
    .range(["#00B9FA", "#F95002"])
    .interpolate(d3.interpolateHcl);

  makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
  drawRects(taskArray, gap, topPadding, sidePadding, barHeight, pageWidth, pageHeight);
  vertLabels(gap, topPadding, sidePadding, barHeight, colorScale);

}

makeGantt(eventData, width, height);
