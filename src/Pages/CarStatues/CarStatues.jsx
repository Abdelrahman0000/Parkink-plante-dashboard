import React, { Suspense } from "react";
import "./CarStatues.css";
import Skeleton from "../../Component/Skeleton";
// Lazy loading components
const UserCarOrders = React.lazy(() =>
  import("./CarStatuesCompo/UserCarOrders")
);
const CarStatistics = React.lazy(() =>
  import("./CarStatuesCompo/CarStatistics")
);
const Blacklist = React.lazy(() => import("./CarStatuesCompo/Blacklist"));

const CarStatues = () => {
  return (
    <div className="min-h-screen">
      <div className="flex justify-between flex-wrap items-center">
        <div className="lg:w-full w-8/12 pr-4 pb-5 lg:pr-0">
          <Suspense
            fallback={
              <div>
                <Skeleton width={250} height={400} />
              </div>
            }
          >
            <UserCarOrders />
          </Suspense>
        </div>

        <div className="lg:w-full w-4/12 pl-4 pb-5 lg:pl-0">
          <Suspense
            fallback={
              <div>
                <Skeleton width={250} height={400} />
              </div>
            }
          >
            <CarStatistics />
          </Suspense>
        </div>

        <div className="lg:w-full w-6/12" style={{ width: "100%" }}>
          <Suspense
            fallback={
              <div>
                <Skeleton width={250} height={400} />
              </div>
            }
          >
            <Blacklist virtual />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CarStatues;
