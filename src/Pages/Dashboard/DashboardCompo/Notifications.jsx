import { useState } from "react";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { useQuery } from "react-query";
import axios from "axios";
const fetchNotificationData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  console.log(token);
  const response = await axios.get(
    `https://comfyparking.tryasp.net/notification`
  );

  return response.data;
};

const Notifications = () => {
  const { data, error, isLoading } = useQuery(
    "Notification",
    fetchNotificationData
  );

  const [showNotifications, setShowNotifications] = useState(true);
  const [showMessages, setShowMessages] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // const handleClose = () => {
  //   setShowNotifications(!showNotifications);
  // };

  // const handleToggle = () => {
  //   setShowMessages(!showMessages);
  // };

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  console.log(data);
  if (isLoading)
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
                <FaBell className="fa-shake" /> <span>Notifications</span>
                <FaChevronDown className="text-gray-600 group-hover:text-indigo-600 animate-bounce" />
              </button>
              <div id="messages" className={`${!showMessages && "hidden"}`}>
                <div className="group relative mb-3 flex gap-x-6 rounded-lg p-5 bg-white">
                  <div className="text-gray-400 text-sm">
                    There is no new messages
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  if (error)
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
                <FaBell className="fa-shake" /> <span>Notifications</span>
                <FaChevronDown className="text-gray-600 group-hover:text-indigo-600 animate-bounce" />
              </button>
              <div id="messages" className={`${!showMessages && "hidden"}`}>
                <div className="group relative mb-3 flex gap-x-6 rounded-lg p-5 bg-white">
                  <div className="text-gray-400 text-sm">
                    Error loading data . . . . .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
              <FaBell className="fa-shake" /> <span>Notifications</span>
              <FaChevronDown className="text-gray-600 group-hover:text-indigo-600 animate-bounce" />
            </button>
            <div id="messages" className={`${!showMessages && "hidden"}`}>
              {data.length === 0 ? (
                <div className="text-gray-400 text-xl">
                  There is no data available
                </div>
              ) : (
                data.map((item, index) => (
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
                        {item.Massage}
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
                onClick={handleToggle}
                id="toggleButton"
              >
                {showMessages ? "Clear" : "Undo"}
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-blue-200"
                onClick={handleClose}
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
