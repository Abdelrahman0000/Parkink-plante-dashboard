import { useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const [showMessages, setShowMessages] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://comfyparking.tryasp.net/notification")
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connection started successfully");
      })
      .catch((err) => {
        console.error("Error starting connection:", err.toString());
      });

    connection.on("sendNotification", (Title, Message) => {
      const newNotification = { Title, Message, timestamp: new Date() };
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);

      // Update local storage with new notifications
      localStorage.setItem("notifications", JSON.stringify(notifications));
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
  }, []);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  console.log(notifications);
  return (
    <div className="" id="notifications">
      <div
        className={`absolute left z-10 mt-5 notifi-inner flex max-w-max -translate-x-1/2 px-4 ${
          !showNotifications && "hidden"
        }`}
        style={{ height: isCollapsed ? "50px" : "calc(50.5vh)" }}
      >
        <div className="flex-auto overflow-hidden rounded-3xl text-sm leading-6 shadow-lg ring-gray-900/6 notifi-bg">
          <div className="p-4">
            <button
              type="button"
              className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              aria-expanded="false"
              onClick={handleCollapse}
            >
              <FaBell className="fa-shake" />
              <FaChevronDown className="text-gray-600 group-hover:text-indigo-600 animate-bounce" />
            </button>
            <div
              id="messages"
              className={`${!showMessages && "hidden"}`}
              style={{ display: isCollapsed ? "none" : "block" }}
            >
              {notifications.length === 0 ? (
                <div className="text-gray-400 text-xl">
                  There are no notifications available
                </div>
              ) : (
                notifications.map((item, index) => (
                  <div
                    key={index}
                    className="group relative mb-3 flex gap-x-6 rounded-lg p-5 bg-white"
                  >
                    <div style={{ height: "auto" }}>
                      <a href="#" className="font-semibold text-gray-900">
                        {item.Title} <br />
                        <span className="text-xs mydate text-gray-400 animate-pulse">
                          {item.timestamp.toLocaleString()}
                        </span>
                        <span className="absolute inset-0"></span>
                      </a>
                      <p className=" text-xs font-normal text-gray-600">
                        {item.Message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
