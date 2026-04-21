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
  .attr("transform", `translate(0, ${height})`);

const yAxisGroup = g.append("g");

const yLabel = g.append("text")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Revenue");

d3.json("data/revenues.json").then((data) => {
  data.forEach((d) => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  d3.interval(() => {
    const newData = flag ? data : data.slice(1);
    update(newData);
    flag = !flag;
  }, 1000);

  update(data);
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

  xAxisGroup.call(xAxisCall);
  yAxisGroup.call(yAxisCall);

  yLabel.text(label);

  const bars = g.selectAll("rect")
    .data(data, d => d.month);

  bars.exit().remove();

  bars
    .attr("x", d => x(d.month))
    .attr("y", d => y(d[value]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[value]))
    .attr("fill", "yellow");

  bars.enter()
    .append("rect")
    .attr("x", d => x(d.month))
    .attr("y", d => y(d[value]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[value]))
    .attr("fill", "yellow");
}