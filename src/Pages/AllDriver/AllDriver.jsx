import DriverList from "./Drivercompo/DriverList";
// import "./AllDriver.css";
const AllDriver = () => {
  return (
    <div className="min-h-screen">
      <div className="flex  justify-between flex-wrap items-center  ">
        <div className="w-6/12  lg:w-full" style={{ width: "100%" }}>
          {" "}
          <DriverList />
        </div>
      </div>
    </div>
  );
};

export default AllDriver;
