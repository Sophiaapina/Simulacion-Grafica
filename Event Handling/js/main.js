const margin = { top: 50, right: 180, bottom: 100, left: 100 };
const width = 1200 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

let yearIndex = 0;

const svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleLog()
  .domain([142, 150000])
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

const area = d3.scaleLinear()
  .domain([2000, 1400000000])
  .range([25 * Math.PI, 1500 * Math.PI]);

const color = d3.scaleOrdinal()
  .range(["#ff6b81", "#70a1ff", "#2ed573", "#ffa502", "#5352ed"]);

const xAxisCall = d3.axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$,"));

const yAxisCall = d3.axisLeft(y)
  .ticks(10);

const xAxisGroup = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`);

const yAxisGroup = g.append("g")
  .attr("class", "y-axis");

g.append("text")
  .attr("class", "x label")
  .attr("x", width / 2)
  .attr("y", height + 60)
  .attr("text-anchor", "middle")
  .text("Income per person ($)");

g.append("text")
  .attr("class", "y label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Life expectancy");

const yearLabel = g.append("text")
  .attr("class", "year-label")
  .attr("x", width / 2)
  .attr("y", height / 2 + 40)
  .attr("text-anchor", "middle")
  .text("");

d3.json("data/data.json").then((data) => {
  const formattedData = data.map(year => ({
    year: year.year,
    countries: year.countries
      .filter(c => c.income && c.life_exp && c.population)
      .map(c => ({
        country: c.country,
        continent: c.continent,
        income: +c.income,
        life_exp: +c.life_exp,
        population: +c.population
      }))
  }));

  const continents = [...new Set(
    formattedData.flatMap(d => d.countries.map(c => c.continent))
  )];

  color.domain(continents);

  const legend = g.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + 20}, 20)`);

  continents.forEach((continent, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 30})`);

    row.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("rx", 4)
      .attr("fill", color(continent));

    row.append("text")
      .attr("x", 28)
      .attr("y", 13)
      .text(continent);
  });

  update(formattedData[yearIndex]);

  d3.interval(() => {
    yearIndex = (yearIndex + 1) % formattedData.length;
    update(formattedData[yearIndex]);
  }, 1000);
}).catch((error) => {
  console.log(error);
});

function update(yearData) {
  const t = d3.transition().duration(800);

  xAxisGroup.transition(t).call(xAxisCall);
  yAxisGroup.transition(t).call(yAxisCall);

  yearLabel.text(yearData.year);

  const circles = g.selectAll("circle")
    .data(yearData.countries, d => d.country);

  circles.exit()
    .transition(t)
    .attr("r", 0)
    .remove();

  circles.transition(t)
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
    .attr("fill", d => color(d.continent));

  circles.enter()
    .append("circle")
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("r", 0)
    .attr("fill", d => color(d.continent))
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .attr("opacity", 0.8)
    .merge(circles)
    .transition(t)
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI));
}