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
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "20px",
        backgroundColor: "#3d3d3df0",
      }}
      className="py-5 mb-5"
    >
      <h2 className="text-xl text-white font-bold  ml-24">
        Line Chart Example
      </h2>
      <div style={{ height: "400px" }}>
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
