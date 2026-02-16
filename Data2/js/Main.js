var data = [25, 20, 15, 10, 5];

var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

var barWidth = 40;
var svgHeight = 400;
var scaleFactor = 10;

svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return i * barWidth;
  })
  .attr("width", barWidth)
  .attr("height", function(d) {
    return d * scaleFactor;
  })
  .attr("y", function(d) {
    return svgHeight - (d * scaleFactor);
  })
  .attr("fill", "steelblue");
