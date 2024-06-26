/* eslint-disable no-undef */
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Cars from "../../../assets/Cars.png";
import Skeleton from "../../../Component/Skeleton";
const fetchCarsData = async (path) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`https://comfyparking.tryasp.net${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const CarStatistics = () => {
  const [timeframe, setTimeframe] = useState(
    "/Bookings/MostCarsBookedLastYear"
  );

  const { data, error, isLoading } = useQuery(
    ["carsData", timeframe],
    () => fetchCarsData(timeframe),
    {
      keepPreviousData: true,
    }
  );

  const handleTimeframeChange = (e) => {
    const selectedTimeframe = e.target.value;
    setTimeframe(
      selectedTimeframe === "lastYear"
        ? "/Bookings/MostCarsBookedLastYear"
        : "/Bookings/MostCarsBookedLastMonth"
    );
  };

  if (isLoading)
    return (
      <div>
        <Skeleton width={250} height={400} />
      </div>
    );
  if (error)
    return (
      <div className="p-6 bg-gray-800 text-white TopCar rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Car Statistics</h2>
        </div>
        <div className="flex justify-center items-center car-h">
          <div
            className="relative car-inner flex justify-center items-center"
            style={{ height: "250px" }}
          >
            <div className="text-gray-400 text-xl"> Error loading data</div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="p-6 bg-gray-800 text-white TopCar rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Car Statistics</h2>
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={
            timeframe === "/Bookings/MostCarsBookedLastYear"
              ? "lastYear"
              : "lastMonth"
          }
          onChange={handleTimeframeChange}
        >
          <option value="lastYear">Last Year</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>
      <div className="flex justify-center items-center car-h">
        <div
          className="relative car-inner flex justify-center items-center"
          style={{ height: "250px" }}
        >
          {data.length === 0 ? (
            <div className="text-gray-400 text-xl">
              {" "}
              there is no data avilabel
            </div>
          ) : (
            <>
              <img
                src={Cars}
                alt="Cars"
                className="car-shape"
                style={{ height: "100%" }}
              />
              {data.map((item, index) => (
                <p
                  className={`car-${index} car-name text-small font-bold`}
                  key={index}
                >
                  {item.carModel}
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarStatistics;
