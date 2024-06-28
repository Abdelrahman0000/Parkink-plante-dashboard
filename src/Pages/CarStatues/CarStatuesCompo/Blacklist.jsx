/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import Skeleton from "../../../Component/Skeleton";

const fetchBlacklistData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const response = await axios.get(
    `https://comfyparking.tryasp.net/Drivers/BlackList`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const undeleteDriver = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const response = await axios.put(
    `https://comfyparking.tryasp.net/Drivers/UnDelete`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { id },
    }
  );
  return response.data;
};

const Blacklist = ({ virtual = true }) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery("blacklist", fetchBlacklistData);
  const mutation = useMutation(undeleteDriver, {
    onMutate: async (id) => {
      await queryClient.cancelQueries("blacklist");
      const previousData = queryClient.getQueryData("blacklist");
      queryClient.setQueryData("blacklist", (old) =>
        old.filter((item) => item.id !== id)
      );
      return { previousData };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData("blacklist", context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries("blacklist");
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  if (isLoading)
    return (
      <div>
        <Skeleton width={250} height={400} />
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-gray-800 my-5 text-white table-contain rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Black List</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-2 b-left">Phone number / mail</th>
              <th className="pb-2">Car model</th>
              <th className="pb-2">Plate number</th>
              <th className="pb-2 b-right">name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="py-2 text-center">
                Error loading data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="p-6 bg-gray-800 my-5 text-white table-contain rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Black List</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="pb-2 b-left">Name</th>
            <th className="pb-2">Email</th>
            <th className="pb-2">Car model</th>
            <th className="pb-2">Plate number</th>
            <th className="pb-2 b-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.email}</td>
                <td className="py-2">{item.model}</td>
                <td className="py-2">{item.licensePlateNumber}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={mutation.isLoading}
                    className="ml-4"
                  >
                    {mutation.isLoading ? (
                      <span className="loader"></span>
                    ) : (
                      <FaTrash className="text-red-600 hover:text-red-800" />
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Blacklist;
