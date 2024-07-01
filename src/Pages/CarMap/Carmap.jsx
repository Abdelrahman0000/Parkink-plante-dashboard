import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "./CarMap.css";
import LeftColCar from "./CarMapCompo/LeftColCar";
import RightColCar from "./CarMapCompo/RightColCar";
import { IoIosArrowForward } from "react-icons/io";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import Skeleton from "../../Component/Skeleton";
import Car from "../../assets/car.png";
const carImageUrl = Car;

const fetchSpaces = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(
      `https://comfyparking.tryasp.net/Spaces/GetSpaces`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Backend error: ", error);
    throw error;
  }
};

const Carmap = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery("spaces", fetchSpaces);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    if (data) {
      setFloors(data.floors);
    }
  }, [data]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://comfyparking.tryasp.net/getSpace")
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connection started successfully");
      })
      .catch((err) => {
        console.error("Error starting connection:", err.toString());
      });

    connection.on("spaceStatus", (id, name, status) => {
      const updateFloorSpaces = (floorSpaces) =>
        floorSpaces.map((space) =>
          space.id === id ? { ...space, name, status } : space
        );

      setFloors((prevFloors) =>
        prevFloors.map((floor) => ({
          ...floor,
          spaces: updateFloorSpaces(floor.spaces),
        }))
      );

      queryClient.invalidateQueries("spaces");
    });

    return () => {
      connection
        .stop()
        .then(() => {
          console.log("Connection stopped successfully");
        })
        .catch((err) => {
          console.error("Error stopping connection:", err.toString());
        });
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div>
        <Skeleton width={"100%"} height={600} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="car-map p-4">
      <div className="flex justify-center flex-wrap items-center">
        {floors.map((floor) => {
          const leftColumnSpaces = floor.spaces.slice(
            0,
            Math.ceil(floor.spaces.length / 2)
          );
          const rightColumnSpaces = floor.spaces.slice(
            Math.ceil(floor.spaces.length / 2)
          );

          return (
            <div
              key={floor.floorNumber}
              className="w-6/12 lg:w-full flex-wrap mt-14 flex justify-center md:justify-between items-start"
            >
              <h2
                className="text-3xl text-gray-400 mb-10 text-center font-bold"
                style={{ width: "100%" }}
              >
                ENTRANCE FLOOR {floor.floorNumber}
              </h2>
              <div className="w-4/12 md:6/12">
                {leftColumnSpaces && (
                  <LeftColCar
                    lanes={leftColumnSpaces}
                    carImageUrl={carImageUrl}
                  />
                )}
              </div>
              <div className="slot-group-name mt-7 md:w-full w-4/12">
                <div className="arrow-group text-2xl text-gray-400 font-bold">
                  <span>
                    <IoIosArrowForward />
                  </span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                  <span>
                    <IoIosArrowForward />
                  </span>
                </div>
                <p className="text-xl text-gray-400 font-bold">
                  {floor.numberOfAvailableSpaces} SLOTS IS EMPTY
                </p>
              </div>
              <div className="w-4/12 md:6/12">
                {rightColumnSpaces && (
                  <RightColCar
                    lanes={rightColumnSpaces}
                    carImageUrl={carImageUrl}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carmap;
