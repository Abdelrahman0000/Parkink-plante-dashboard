/* eslint-disable react/prop-types */
import { useQuery } from "react-query";
import axios from "axios";
import { FaCircleExclamation } from "react-icons/fa6";
import Skeleton from "../../../Component/Skeleton";
import { useState } from "react";

const fetchDriverListData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const response = await axios.get(
    `https://comfyparking.tryasp.net/Drivers/GetALLDriver`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

const DriverList = () => {
  const { data, error, isLoading } = useQuery(
    "DriverList",
    fetchDriverListData
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data
    ? data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (isLoading)
    return (
      <div>
        <Skeleton width={250} height={400} />
      </div>
    );
  if (error) return <div>Error loading data</div>;

  return (
    <div
      className=" bg-gray-800 text-white table-contain rounded-lg shadow-md my-5"
      style={{ overflow: "hidden" }}
    >
      <h2
        style={{ backgroundColor: "#536298D9" }}
        className="text-lg px-6 py-3 font-bold flex justify-start items-center gap-1 mb-4"
      >
        {" "}
        <span style={{ color: "#f9ca42" }}>
          <FaCircleExclamation />
        </span>{" "}
        <span> Admin can only see users info</span>
      </h2>
      <div className="px-6 pb-4 input-search">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-80 p-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
        />
      </div>
      <div className="p-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading data</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2 b-left">Driver name</th>
                <th className="pb-2">Car model</th>
                <th className="pb-2 b-right">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.licensePlateNumber}</td>
                    <td className="py-2">{item.phoneNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverList;
