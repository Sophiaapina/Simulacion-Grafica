const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data/revenues.json").then((data) => {
  data.forEach((d) => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([height, 0]);

  const xAxisCall = d3.axisBottom(x);

  const yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(d => "$" + (d / 1000) + "K");

  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisCall);

  g.append("g")
    .attr("class", "y-axis")
    .call(yAxisCall);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.revenue))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.revenue))
      .attr("fill", "yellow");

  g.append("text")
    .attr("class", "x label")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("font-size", "22px")
    .attr("text-anchor", "middle")
    .text("Month");

  g.append("text")
    .attr("class", "y label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "22px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (dlls.)");
}).catch((error) => {
  console.log(error);
});