// Pages/Dashboard/Dashboard.jsx
import React, { Suspense } from "react";
import "./Dash.css";
import Skeleton from "../../Component/Skeleton";

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
          <h2 className="text-5xl font-bold mb-24">
            Good Morning, saeed!{" "}
            <div className="md:block hidden">
              <Suspense fallback={<Skeleton width={200} height={20} />}>
                <Notifications />
              </Suspense>
            </div>
          </h2>
          <Suspense fallback={<Skeleton height={150} />}>
            <InfoContainer />
            <ClinteContainer />
          </Suspense>
        </div>
        <div className="right w-3/12">
          <Suspense fallback={<Skeleton height={100} />}>
            <Notifications />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
