import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Component/ProtectedRoute";
import "./index.css";
import { Navbar } from "./Component";
import Skeleton from "./Component/Skeleton";

// Lazy load components
const LazyLogin = React.lazy(() => import("./Pages/LogIn/Login"));
const LazyDashboard = React.lazy(() => import("./Pages/Dashboard/Dashboard"));
const LazyCarStatues = React.lazy(() =>
  import("./Pages/CarStatues/CarStatues")
);
const LazyCarmap = React.lazy(() => import("./Pages/CarMap/Carmap"));
const LazyAllDriver = React.lazy(() => import("./Pages/AllDriver/AllDriver"));

const App = () => {
  // function clearAllItems() {
  //   localStorage.clear();
  //   alert("All items deleted");
  // }
  // clearAllItems();
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<Skeleton width={"100%"} height={600} />}>
              <LazyLogin />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <ProtectedRoute>
                <Suspense fallback={<Skeleton width={"100%"} height={600} />}>
                  <div className="main">
                    <LazyDashboard />
                  </div>
                </Suspense>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/status"
          element={
            <>
              <Navbar />
              <ProtectedRoute>
                <Suspense fallback={<Skeleton width={"100%"} height={600} />}>
                  <div className="main">
                    <LazyCarStatues />
                  </div>
                </Suspense>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/garage-map"
          element={
            <>
              <Navbar />
              <ProtectedRoute>
                <Suspense fallback={<Skeleton width={"100%"} height={600} />}>
                  <div className="main">
                    <LazyCarmap />
                  </div>
                </Suspense>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/driver-list"
          element={
            <>
              <Navbar />
              <ProtectedRoute>
                <Suspense fallback={<Skeleton width={"100%"} height={600} />}>
                  <div className="main">
                    <LazyAllDriver />
                  </div>
                </Suspense>
              </ProtectedRoute>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
