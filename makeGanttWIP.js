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

// Sample Data
// {
//   "Task": "Job-2",
//   "Start": 17,
//   "Finish": 17,
//   "Resource": "Complete"
// },

eventData.forEach(function(data) {
  data.Start = +data.Start;
  data.Finish = +data.Finish;
});


var timeScale = d3.scaleLinear()
  .domain([d3.min(eventData, function(d) {
      return d.Start
    }),
    d3.max(eventData, function(d) {
      return d.Finish
    })
  ])
  .range([0, width - 50]);

var title = svg.append("text")
  .text("Gantt Chart")
  .attr("x", width / 2)
  .attr("y", 25)
  .attr("text-anchor", "middle")
  .attr("font-size", 18)
  .attr("fill", "#000");


function drawRects(eventData, theGap, theTopPad, theSidePad, theBarHeight, width, height) {

  var rectGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var rectangles = svg.append('g')
    .selectAll("rect")
    .data(eventData)
    .enter();

  var Rects = rectangles.append("rect")
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("x", function(d) {
      return timeScale(d.Start) + theSidePad;
    })
    .attr("y", function(d, i) {
      return i * theGap + theTopPad;
    })
    .attr("width", function(d) {
      return (timeScale(d.Finish) - timeScale(d.Start - 1));
    })
    .attr("height", theBarHeight)
    .attr("stroke", "none")
    .attr("fill", "#444");


  var rectText = rectangles.append("text")
    .text(function(d) {
      return d.Task;
    })
    .attr("x", function(d) {
      return (timeScale(d.Finish) - timeScale(d.Start)) / 2 + timeScale(d.Start + 0.5) + theSidePad;
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
};


function makeGantt(taskArray, pageWidth, pageHeight) {

  var barHeight = 20;
  var gap = barHeight + 4;
  var topPadding = 75;
  var sidePadding = 75;

  drawRects(taskArray, gap, topPadding, sidePadding, barHeight, pageWidth, pageHeight);

}

makeGantt(eventData, width, height);
