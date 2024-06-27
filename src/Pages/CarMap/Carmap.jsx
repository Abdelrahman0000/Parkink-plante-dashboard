import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "./CarMap.css";
import LeftColCar from "./CarMapCompo/LeftColCar";
import RightColCar from "./CarMapCompo/RightColCar copy";
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
  const [firstFloor, setFirstFloor] = useState([]);
  const [secondFloor, setSecondFloor] = useState([]);
  const [thirdFloor, setThirdFloor] = useState([]);
  const [fourthFloor, setFourthFloor] = useState([]);
  const [availableSpaces, setAvailableSpaces] = useState({});

  useEffect(() => {
    if (data) {
      const floors = data.floors;
      setFirstFloor(
        floors.find((floor) => floor.floorNumber === 1)?.spaces || []
      );
      setSecondFloor(
        floors.find((floor) => floor.floorNumber === 2)?.spaces || []
      );
      setThirdFloor(
        floors.find((floor) => floor.floorNumber === 3)?.spaces || []
      );
      setFourthFloor(
        floors.find((floor) => floor.floorNumber === 4)?.spaces || []
      );
      setAvailableSpaces(
        floors.reduce((acc, floor) => {
          acc[floor.floorNumber] = floor.numberOfAvailableSpaces;
          return acc;
        }, {})
      );
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

      setFirstFloor((prev) => updateFloorSpaces(prev));
      setSecondFloor((prev) => updateFloorSpaces(prev));
      setThirdFloor((prev) => updateFloorSpaces(prev));
      setFourthFloor((prev) => updateFloorSpaces(prev));

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
        <div className="w-6/12 lg:w-full flex-wrap flex justify-center items-start">
          <h2
            className="text-3xl text-gray-400 mb-10 text-center font-bold"
            style={{ width: "100%" }}
          >
            ENTRANCE FIRST FLOOR
          </h2>
          <div className="w-4/12 md:w-full">
            {firstFloor && (
              <LeftColCar lanes={firstFloor} carImageUrl={carImageUrl} />
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
            <p className="text-xl text-gray-400 font-bold">5 SLOTS IS EMPTY</p>
          </div>
          <div className="w-4/12 md:w-full">
            {secondFloor && (
              <RightColCar lanes={secondFloor} carImageUrl={carImageUrl} />
            )}
          </div>
        </div>
        <div className="w-6/12 lg:w-full flex-wrap flex justify-center items-start">
          <h2
            className="text-3xl text-gray-400 mb-10 text-center font-bold"
            style={{ width: "100%" }}
          >
            ENTRANCE FIRST FLOOR
          </h2>
          <div className="w-4/12 md:w-full">
            {thirdFloor && (
              <LeftColCar lanes={thirdFloor} carImageUrl={carImageUrl} />
            )}
          </div>
          <div className="slot-group-name md:w-full mt-7 w-4/12">
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
            <p className="text-xl text-gray-400 font-bold">5 SLOTS IS EMPTY</p>
          </div>
          <div className="w-4/12 md:w-full">
            {fourthFloor && (
              <RightColCar lanes={fourthFloor} carImageUrl={carImageUrl} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carmap;
