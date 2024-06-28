// Pages/Dashboard/Dashboard.jsx
import React, { Suspense } from "react";
import "./Dash.css";
import Skeleton from "../../Component/Skeleton";
import Car from "../../assets/car.png";
// Lazy-loaded components
const ClinteContainer = React.lazy(() =>
  import("./DashboardCompo/ClinteContainer")
);
const InfoContainer = React.lazy(() =>
  import("./DashboardCompo/InfoContainer")
);
const Notifications = React.lazy(() =>
  import("./DashboardCompo/Notifications")
);

const Dashboard = () => {
  return (
    <div className="dash">
      <div className="flex">
        <div className="left w-9/12 md:w-full">
          <div className="text-5xl font-bold mb-24">
            <div className="car-card">
              <span className="car-icons">
                <img src={Car} alt="" />
              </span>
              <h2>
                Comfy Parking <span>Dashboard</span>
              </h2>
            </div>
            <div className="md:block hidden">
              <Suspense fallback={<Skeleton width={200} height={20} />}>
                <Notifications />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={<Skeleton height={150} />}>
            <InfoContainer />
          </Suspense>
        </div>
        <div className="right w-3/12">
          <Suspense fallback={<Skeleton height={100} />}>
            <Notifications />
          </Suspense>
        </div>
      </div>
      <div className="left 2xl:w-full xl:w-full md:w-full">
        <Suspense fallback={<Skeleton height={150} />}>
          <ClinteContainer />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
