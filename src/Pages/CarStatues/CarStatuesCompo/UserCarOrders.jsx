/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
// UserCarOrders.jsx
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from "victory";

import Skeleton from "../../../Component/Skeleton";

const fetchBookingsData = async (path) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`https://comfyparking.tryasp.net/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const UserCarOrders = () => {
  const [chartWidth, setChartWidth] = useState(13);
  const [timeframe, setTimeframe] = useState(
    "Bookings/NumberOfBookingsLastYear"
  );

  const fetchAndStoreData = async (path) => {
    const localData = localStorage.getItem(path);
    if (localData) {
      return JSON.parse(localData);
    } else {
      const data = await fetchBookingsData(path);
      localStorage.setItem(path, JSON.stringify(data));
      return data;
    }
  };

  const { data, error, isLoading } = useQuery([timeframe], () =>
    fetchAndStoreData(timeframe)
  );

  useEffect(() => {
    if (timeframe.includes("Year")) {
      setChartWidth(13);
    } else if (timeframe.includes("Mounth")) {
      setChartWidth(7);
    } else if (timeframe.includes("Week")) {
      setChartWidth(25);
    }
  }, [timeframe]);

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  let xLabel;
  let tickFormat;

  if (timeframe.includes("Year")) {
    xLabel = "monthName";
    tickFormat = data ? data.map((d) => d.monthName) : [];
  } else if (timeframe.includes("Mounth")) {
    xLabel = "day";

    // Function to get the days of the last month
    function getLastMonthDays() {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // 0th day of the current month gives us the last day of the previous month
      const daysInLastMonth = lastMonth.getDate();

      const days = [];
      for (let i = 1; i <= daysInLastMonth; i++) {
        days.push(i);
      }

      return days;
    }

    // Set tickFormat to days of the last month
    tickFormat = getLastMonthDays();
  } else if (timeframe.includes("Week")) {
    xLabel = "dayOfWeek";
    tickFormat = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  }

  const yMax = data ? Math.max(...data.map((d) => d.bookingsCount)) : 0;

  if (isLoading) {
    return (
      <div>
        <Skeleton width={250} height={400} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-800 text-white TopCar rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Most car booked</h2>
        </div>
        <div className="flex justify-center items-center car-h">
          <div
            className="relative car-inner flex justify-center items-center"
            style={{ height: "250px" }}
          >
            <div className="text-gray-400 text-xl">Error loading data</div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure data is sorted correctly for the week case
  if (timeframe.includes("Week") && data) {
    const dayOrder = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    data.sort(
      (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-white order-chart rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Most car booked</h2>
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={timeframe}
          onChange={handleTimeframeChange}
        >
          <option value="Bookings/NumberOfBookingsLastYear">Last Year</option>
          <option value="Bookings/NumberOfBookingsLastMounth">
            Last Mounth
          </option>
          <option value="Bookings/NumberOfBookingsLastWeek">Last Week</option>
        </select>
      </div>
      {data && data.length > 0 ? (
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={50}
          height={200}
          width={400}
          padding={{ top: 20, bottom: 60, left: 50, right: 20 }}
          domain={{ y: [0, yMax * 1.2] }} // Add padding above the max value
        >
          <VictoryAxis
            style={{
              axis: { stroke: "#FFFFFF" },
              tickLabels: { fill: "#FFFFFF" },
            }}
            tickFormat={tickFormat} // Use the appropriate tick format
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: "#FFFFFF" },
              tickLabels: { fill: "#FFFFFF" },
            }}
            tickFormat={(x) => `${x * 2}`}
          />
          <VictoryBar
            data={data}
            x={xLabel}
            y="bookingsCount"
            style={{
              data: { fill: "#FFA500" },
            }}
            barWidth={chartWidth} // Adjust the value to control the gap between bars (e.g., 0.8 for 80% of the available space)
          />
        </VictoryChart>
      ) : (
        <div className="py-2 text-center">No data available</div>
      )}
    </div>
  );
};

export default UserCarOrders;
