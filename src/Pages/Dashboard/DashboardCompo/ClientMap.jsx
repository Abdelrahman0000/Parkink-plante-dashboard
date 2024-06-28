import LineChart from "./LineChart"; // Adjust the path as per your project structure

const ClientMap = () => {
  // Sample data
  const data = [
    [10, 20, 15, 40, 20, 60, 55],
    [15, 35, 25, 45, 55, 25, 65],
    [20, 60, 30, 40, 70, 50, 75],
    [20, 60, 20, 40, 100, 20, 85],
  ];

  const backgroundColors = ["#53757f57", "#3f706d56", "#6f79645c", "#3756615d"];
  const lineColors = ["#3e7492", "#9baa92", "#5fb1ab", "#67a3b1"];
  const lineLabels = ["2021", "2022", "2023", "2024"]; // Labels for the lines

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "20px",
        backgroundColor: "#3d3d3df0",
      }}
      className="py-5 mb-5 chartLine-inner"
    >
      <h2 className="text-xl text-white font-bold ml-24">Revenue</h2>
      <div className="legend-container px-4 flex justify-center mt-5">
        {lineLabels.map((label, index) => (
          <div key={index} className="flex items-center mx-4 md:mx-2">
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill={lineColors[index]} />
            </svg>
            <span className="text-white text-base ml-2">{label}</span>
          </div>
        ))}
      </div>
      <div
        className="line-chart-container"
        style={{ width: "100%", height: "400px" }}
      >
        <LineChart
          data={data}
          lineColors={lineColors}
          backgroundColors={backgroundColors}
        />
      </div>
    </div>
  );
};

export default ClientMap;
