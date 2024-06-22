/* eslint-disable react/prop-types */

import axios from "axios";
import { useQuery } from "react-query";
import Skeleton from "../../../Component/Skeleton";
const fetchData = async (path) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(`https://comfyparking.tryasp.net${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error: ", error);
    throw error;
  }
};

const ClinteCard = ({ title, path, color }) => {
  const { data, error, isLoading } = useQuery([path], () => fetchData(path));

  if (isLoading)
    return (
      <div>
        <Skeleton width={250} height={200} />
      </div>
    );
  if (error) return <div>Error loading data</div>;

  return (
    <div className="flex  h-36 mb-7   flex-col info-card items-start p-4 bg-white rounded-lg ">
      <div className="text-black text-2xl font-medium">{title}</div>{" "}
      <div className="text-5xl 2xl:w-full xl:w-full flex items-center justify-between   font-bold mb-2   ">
        {data.number}{" "}
        <span
          className="ml-auto bg-gray-300 w-4/12 text-lg inline-block flex rounded-lg items-center justify-center   h-7"
          style={{ color: color }}
        >
          {" "}
          + {data.percentage} %
        </span>
      </div>{" "}
    </div>
  );
};

export default ClinteCard;
