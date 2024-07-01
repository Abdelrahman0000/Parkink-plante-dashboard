/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import LineChart from "./LineChart"; // Adjust the path as per your project structure

import Skeleton from "../../../Component/Skeleton";
const fetchMonthlyReportData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const response = await axios.get(
    "https://comfyparking.tryasp.net/Bookings/MonthlyReport",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

const transformData = (data) => {
  const months = [
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
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];

  const completedBookingsData = years.map((year) =>
    months.map((month) => {
      const entry = data.find((d) => d.year === year && d.month === month);
      return entry ? entry.completedBookings : 0;
    })
  );

  return completedBookingsData;
};

const ClientMap = () => {
  const { data, error, isLoading } = useQuery(
    "monthlyReportData",
    fetchMonthlyReportData
  );
  if (isLoading)
    return (
      <div>
        <Skeleton width={250} height={200} />
      </div>
    );
  if (error) return <div>Error loading data</div>;

  const transformedData = transformData(data);
  const lineColors = ["#3e7492", "#9baa92"];
  const backgroundColors = ["#53757f57", "#3f706d56"];
  const lineLabels = ["Completed Bookings 2023", "Completed Bookings 2024"];

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
      <div className="legend-container flex justify-center mt-5">
        {lineLabels.map((label, index) => (
          <div key={index} className="flex items-center mx-4">
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" fill={lineColors[index]} />
            </svg>
            <span className="text-white ml-2">{label}</span>
          </div>
        ))}
      </div>
      <div
        className="line-chart-container"
        style={{ width: "100%", height: "400px" }}
      >
        <LineChart
          data={transformedData}
          lineColors={lineColors}
          backgroundColors={backgroundColors}
        />
      </div>
    </div>
  );
};

export default ClientMap;
