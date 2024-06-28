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

const InfoCard = ({ title, photo, path }) => {
  const { data, error, isLoading } = useQuery([path], () => fetchData(path));

  if (isLoading)
    return (
      <div>
        <Skeleton width={250} height={200} />
      </div>
    );
  if (error) return <div>Error loading data</div>;
  return (
    <div className=" w-3/12 px-3 lg:w-4/12 md:w-full md:my-4">
      <div className="flex   flex-col info-card items-start p-4 bg-white rounded-lg ">
        <div className="w-12 h-12 mb-4">
          <img src={photo} alt="Icon" className="object-cover" />
        </div>
        <div className="text-4xl font-bold mb-2 ">{data}</div>
        <div className="text-black font-medium">{title}</div>
      </div>
    </div>
  );
};

export default InfoCard;
