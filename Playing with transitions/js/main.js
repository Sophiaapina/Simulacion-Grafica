const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

let flag = true;

const g = d3.select("#chart-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);

const y = d3.scaleLinear()
  .range([height, 0]);

const xAxisGroup = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`);

const yAxisGroup = g.append("g")
  .attr("class", "y-axis");

g.append("text")
  .attr("class", "x label")
  .attr("x", width / 2)
  .attr("y", height + 60)
  .attr("font-size", "22px")
  .attr("text-anchor", "middle")
  .text("Month");

const yLabel = g.append("text")
  .attr("class", "y label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "22px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue");

d3.json("data/revenues.json").then((data) => {
  data.forEach((d) => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  update(data);

  d3.interval(() => {
    const newData = flag ? data : data.slice(1);
    update(newData);
    flag = !flag;
  }, 1000);
}).catch((error) => {
  console.log(error);
});

function update(data) {
  const value = flag ? "revenue" : "profit";
  const label = flag ? "Revenue" : "Profit";

  x.domain(data.map(d => d.month));
  y.domain([0, d3.max(data, d => d[value])]);

  const xAxisCall = d3.axisBottom(x);
  const yAxisCall = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d => "$" + d);

  xAxisGroup
    .transition()
    .duration(1000)
    .call(xAxisCall);

  xAxisGroup.selectAll("text")
    .attr("y", 10)
    .attr("x", -5)
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  yAxisGroup
    .transition()
    .duration(1000)
    .call(yAxisCall);

  yLabel.text(label);

  const bars = g.selectAll("rect")
    .data(data, d => d.month);

  bars.exit()
    .transition()
    .duration(1000)
    .attr("y", height)
    .attr("height", 0)
    .remove();

  bars.transition()
    .duration(1000)
    .attr("x", d => x(d.month))
    .attr("y", d => y(d[value]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[value]))
    .attr("fill", "yellow");

  bars.enter()
    .append("rect")
    .attr("x", d => x(d.month))
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", "yellow")
    .transition()
    .duration(1000)
    .attr("y", d => y(d[value]))
    .attr("height", d => height - y(d[value]));
}