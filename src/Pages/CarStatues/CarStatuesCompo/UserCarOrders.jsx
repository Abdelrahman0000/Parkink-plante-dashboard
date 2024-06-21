// UserCarOrders.jsx
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from "victory";

import Skeleton from "../../../Component/Skeleton";
// const fetchBookingsData = async (path) => {
//   const token = localStorage.getItem("token");
//   console.log(token);
//   const response = await axios.get(`https://comfyparking.tryasp.net${path}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

const virtualData = {
  lastYear: [
    { month: "Jan", orders: 20000 },
    { month: "Feb", orders: 15000 },
    { month: "Mar", orders: 22000 },
    { month: "Apr", orders: 8000 },
    { month: "May", orders: 17000 },
    { month: "Jun", orders: 6000 },
    { month: "Jul", orders: 11000 },
    { month: "Aug", orders: 9000 },
    { month: "Sep", orders: 14000 },
    { month: "Oct", orders: 20000 },
    { month: "Nov", orders: 18000 },
    { month: "Dec", orders: 25000 },
  ],
  lastMonth: [
    { day: "1", orders: 1000 },
    { day: "2", orders: 1200 },
    { day: "3", orders: 1300 },
    { day: "4", orders: 900 },
    { day: "5", orders: 1500 },
    { day: "6", orders: 1700 },
    { day: "7", orders: 1600 },
    { day: "8", orders: 1800 },
    { day: "9", orders: 1900 },
    { day: "10", orders: 2000 },
    { day: "11", orders: 2200 },
    { day: "12", orders: 2100 },
    { day: "13", orders: 2300 },
    { day: "14", orders: 2400 },
    { day: "15", orders: 2500 },
    { day: "16", orders: 2600 },
    { day: "17", orders: 2700 },
    { day: "18", orders: 2800 },
    { day: "19", orders: 2900 },
    { day: "20", orders: 3000 },
    { day: "21", orders: 3100 },
    { day: "22", orders: 3200 },
    { day: "23", orders: 3300 },
    { day: "24", orders: 3400 },
    { day: "25", orders: 3500 },
    { day: "26", orders: 3600 },
    { day: "27", orders: 3700 },
    { day: "28", orders: 3800 },
    { day: "29", orders: 3900 },
    { day: "30", orders: 4000 },
  ],
  lastWeek: [
    { day: "Mon", orders: 2000 },
    { day: "Tue", orders: 2300 },
    { day: "Wed", orders: 2100 },
    { day: "Thu", orders: 2200 },
    { day: "Fri", orders: 2400 },
    { day: "Sat", orders: 2600 },
    { day: "Sun", orders: 2800 },
  ],
};

const UserCarOrders = () => {
  //   const [timeframe, setTimeframe] = useState(
  //     "/Bookings/NumberOfBookingsLastMonth"
  //   );
  //   const { data, error, isLoading } = useQuery([timeframe], () =>
  //     fetchBookingsData(timeframe)
  //   );
  const [timeframe, setTimeframe] = useState("lastYear");
  const data = virtualData[timeframe];
  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };
  const xLabel = timeframe === "lastYear" ? "month" : "day";
  const yMax = Math.max(...data.map((d) => d.orders));

  return (
    <div className="p-6 bg-gray-800 text-white order-chart rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">User Car Orders</h2>
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={timeframe}
          onChange={handleTimeframeChange}
        >
          <option value="/Bookings/NumberOfBookingsLastYear">Last Year</option>
          <option value="/Bookings/NumberOfBookingsLastMonth">
            Last Month
          </option>
          <option value="/Bookings/NumberOfBookingsLastWeek">Last Week</option>
        </select>
      </div>
      {/* {isLoading ? (
          <div>
                <Skeleton width={250} height={400} />
              </div>
      ) : error ? (
        <div>Error loading data</div>
      ) : ( */}
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={50}
        height={200}
        width={400}
        padding={{ top: 20, bottom: 60, left: 50, right: 20 }}
        domain={{ y: [0, yMax * 0.8] }} // Add padding above the max value
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#FFFFFF" },
            tickLabels: { fill: "none" },
          }}
          tickFormat={data.map((d) => d[xLabel])}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#FFFFFF" },
            tickLabels: { fill: "#FFFFFF" },
          }}
          tickFormat={(x) => `${x / 1000}k`}
        />
        <VictoryBar
          data={data}
          x={xLabel}
          y="orders"
          style={{
            data: { fill: "#FFA500" },
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        />
      </VictoryChart>

      {/* )} */}
    </div>
  );
};

export default UserCarOrders;
