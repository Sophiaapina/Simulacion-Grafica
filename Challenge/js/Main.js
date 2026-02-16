var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

d3.json("data/buildings.json")
  .then(function(data) {
    data.forEach(function(d) {
      d.height = +d.height;
    });

    var barWidth = 40;
    var spacing = 10;
    var baseline = 450;

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return 50 + i * (barWidth + spacing);
      })
      .attr("y", function(d) {
        return baseline - d.height;
      })
      .attr("width", barWidth)
      .attr("height", function(d) {
        return d.height;
      })
      .attr("fill", "steelblue");
  })
  .catch(function(err) {
    console.error(err);
  });
