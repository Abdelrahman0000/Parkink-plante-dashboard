/* eslint-disable react/prop-types */
import { useQuery } from "react-query";
import axios from "axios";
import { FaCircleExclamation } from "react-icons/fa6";
import Skeleton from "../../../Component/Skeleton";
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

  if (isLoading)
    return (
      <div>
        <Skeleton width={250} height={400} />
      </div>
    );
  if (error) return <div>Error loading data</div>;
  return (
    <div className=" bg-gray-800 text-white table-contain rounded-lg shadow-md my-5">
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
                <th className="pb-2 b-right">Car number</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
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
