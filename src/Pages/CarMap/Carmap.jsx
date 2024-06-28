import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "./CarMap.css";
import LeftColCar from "./CarMapCompo/LeftColCar";
import RightColCar from "./CarMapCompo/RightColCar";
import { IoIosArrowForward } from "react-icons/io";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import Skeleton from "../../Component/Skeleton";

const carImageUrl =
  "https://s3-alpha-sig.figma.com/img/7f2e/9d59/d0bd09ee0dcb61774ed72d4104f88139?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TH5epAvFbJEQYSWVuAV8AlYOG8TCEoPHxAvI~-4kerqvtlX~f520KBVNc4Y-YrNJSJnEyY3JgPyBpNAy~MqRLEfATVKp2tDlYDeBvv~TXCOMl39YftVsxoQEPyifUE3fXBk9KRr-PxYts33EVuwuVqxDnHAvnMylY3vk~yo3WUrq~qSE8pGPxRKy~gWYqwI6mI7Wst~siIQv84vYmKdvHs75rUC3HGhZwr-UP-ivATyu-bv1UjALpBl~Wg4xHeLOGGe5IDamjxaiwYOT-UiVP6mYcjqK5YZZ8HqSi8CGcVKIVkgAByl9GyPXt60e~vsuBba5qrJ9h~g~HO5K3fUH2Q__"; // Replace with actual URL

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
              className="w-6/12 lg:w-full flex-wrap mt-14 flex justify-center items-start"
            >
              <h2
                className="text-3xl text-gray-400 mb-10 text-center font-bold"
                style={{ width: "100%" }}
              >
                ENTRANCE FLOOR {floor.floorNumber}
              </h2>
              <div className="w-4/12 md:w-full">
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
              <div className="w-4/12 md:w-full">
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
