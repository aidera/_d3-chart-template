import {
  select,
  csv,
  scaleLinear,
  scaleBand,
  max,
  axisLeft,
  axisBottom,
  format
} from "d3";


/* РОДИТЕЛЬСКИЙ КОНТЕЙНЕРНЫЙ ЭЛЕМЕНТ */
const DOMElement = select("#element");

const width = +DOMElement.attr("width");
const height = +DOMElement.attr("height");


/* ГРАФИК */
const render = (data) => {
  /* Отображаемые данные */
  const xValue = d => d.population;
  const yValue = d => d.country;
  const title = "Top 10 most populous countries";

  /* Стилевые настройки графика */
  const margin = { top: 20, right: 20, bottom: 40, left: 100 }
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  /* Вычисление ширины столбика по данным в диапазоне от 0 до максимума */
  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth])

  /* Равномерное распределение высоты по всем элементам в графике */
  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  /* Элемент графика */
  const container = DOMElement.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


  /* Label - Ось X */
  const xAxisTickFormat = (number) => // Форматирование чисел
    format(".3s")(number)
      .replace("G", "B")

  const xAxis = axisBottom(xScale)  // Определение
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight) // Вертикальные полосы

  const xAxisG = container.append("g") // Вставка
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`);

  xAxisG.select(".domain").remove(); // Удаление лишних элементов

  xAxisG.append("text") // Текст оси
    .attr("y", 40)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text("Population")



  /* Label - Ось Y */
  const yAxis = axisLeft(yScale); // Определение

  const yAxisG = container.append("g") // Вставка
    .call(yAxis);

  yAxisG.selectAll(".domain, .tick line") // Удаление лишних элементов
    .remove();



  /* Конфигурация столбиков */
  container.selectAll("rect").data(data)
    .enter().append("rect")
      .attr("y", d => yScale(yValue(d)))
      .attr("width", d => xScale(xValue(d)))
      .attr("height", yScale.bandwidth())



  /* Заголовок */
  container.append("text")
    .attr("y", -10)
    .text(title)
}



/* Получение данных из csv файла */
csv("data.csv").then((data) => {
  data.forEach(d => {
    d.population = +d.population * 1000;
  });
  render(data);
});