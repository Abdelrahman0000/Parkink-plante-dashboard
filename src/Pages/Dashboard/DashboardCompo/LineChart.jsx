/* eslint-disable react/prop-types */
import { VictoryChart, VictoryGroup, VictoryArea, VictoryAxis } from "victory";

const LineChart = ({ data, lineColors, backgroundColors }) => {
  const generatePatternId = (index) => `pattern-${index}`;

  return (
    <VictoryChart
      style={{
        parent: {
          backgroundColor: "transparent", // Set the background color of the chart to transparent
          width: "100%",
          height: "100%",
        },
      }}
      domainPadding={{ x: [20, 20], y: [20, 20] }}
      padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
    >
      <defs>
        {data.map((lineData, index) => (
          <pattern
            id={generatePatternId(index)}
            key={generatePatternId(index)}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <rect
              width="8"
              height="8"
              fill={backgroundColors[index % backgroundColors.length]}
            />
          </pattern>
        ))}
      </defs>
      <VictoryGroup>
        {data.map((lineData, index) => (
          <VictoryArea
            key={index}
            data={lineData.map((value, i) => ({ x: i, y: value }))}
            interpolation="natural" // Use natural interpolation for smooth curves
            style={{
              data: {
                fill: `url(#${generatePatternId(index)})`, // Use SVG pattern for background fill
                stroke: lineColors[index % lineColors.length], // Line color
                strokeWidth: 3, // Adjust the width of the line
                strokeLinecap: "round", // Rounded line ends
              },
            }}
          />
        ))}
      </VictoryGroup>
      <VictoryAxis
        tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
        tickFormat={[
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]}
        style={{
          axisLabel: { fill: "#ffffff" }, // Set axis label color to white
          ticks: { stroke: "#ffffff" }, // Set tick color to white
          tickLabels: { fill: "#ffffff" }, // Set tick label color to white
        }}
      />
      <VictoryAxis
        dependentAxis
        style={{
          axisLabel: { fill: "#ffffff" }, // Set axis label color to white
          ticks: { stroke: "#ffffff" }, // Set tick color to white
          tickLabels: { fill: "#ffffff" }, // Set tick label color to white
        }}
      />
    </VictoryChart>
  );
};

export default LineChart;
