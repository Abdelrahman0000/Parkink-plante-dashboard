import { useState, useEffect } from "react";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { useQueryClient } from "react-query";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

const fetchNotificationData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await axios.get(
    `https://comfyparking.tryasp.net/notification`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

const Notifications = () => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const [showMessages, setShowMessages] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Fetch initial notifications
    fetchNotificationData().then(setNotifications).catch(console.error);

    // Setup SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://comfyparking.tryasp.net/notificationHub")
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connection started successfully");
      })
      .catch((err) => {
        console.error("Error starting connection:", err.toString());
      });

    connection.on("ReceiveNotification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
      queryClient.invalidateQueries("Notification");
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

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!notifications) return null;
  console.log(notifications);
  return (
    <div className="" id="notifications">
      <div
        className={`absolute left z-10 mt-5 notifi-inner flex max-w-max -translate-x-1/2 px-4 ${
          !showNotifications && "hidden"
        }`}
        style={{ height: isCollapsed ? "50px" : "calc(100vh - 28.5vh)" }}
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
            <div id="messages" className={`${!showMessages && "hidden"}`}>
              {notifications.length === 0 ? (
                <div className="text-gray-400 text-xl">
                  There is no New Message
                </div>
              ) : (
                notifications.map((item, index) => (
                  <div
                    key={index}
                    className="group relative mb-3 flex gap-x-6 rounded-lg p-5 bg-white"
                  >
                    <div>
                      <a href="#" className="font-semibold text-gray-900">
                        {item.Title} <br />
                        <span className="text-xs mydate text-gray-400 animate-pulse">
                          just now
                        </span>
                        <span className="absolute inset-0"></span>
                      </a>
                      <p className="h-6 text-xs font-normal text-gray-600">
                        {item.Message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-100">
              <a
                href="#"
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-blue-200"
                onClick={() => setShowMessages(!showMessages)}
                id="toggleButton"
              >
                {showMessages ? "Clear" : "Undo"}
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-blue-200"
                onClick={() => setShowNotifications(!showNotifications)}
                id="closeButton"
              >
                {showNotifications ? "Close" : "Show Notifications"}
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
