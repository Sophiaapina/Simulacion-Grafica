d3.csv("data/ages.csv")
  .then((data) => console.log("CSV:", data))
  .catch((err) => console.error("CSV error:", err));

d3.tsv("data/ages.tsv")
  .then((data) => console.log("TSV:", data))
  .catch((err) => console.error("TSV error:", err));

d3.json("data/ages.json")
  .then((data) => {
    data.forEach((d) => {
      d.age = +d.age;
    });

    console.log("JSON parsed:", data);

    var svg = d3.select("#chart-area")
      .append("svg")
      .attr("width", 400)
      .attr("height", 150);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d, i) { return 60 + i * 70; })
      .attr("cy", 75)
      .attr("r", function(d) { return d.age * 3; })
      .attr("fill", function(d) { return d.age > 10 ? "orange" : "blue"; });
  })
  .catch((err) => console.error("JSON error:", err));
