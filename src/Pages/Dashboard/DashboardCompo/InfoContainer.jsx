import InfoCard from ".//InfoCard";
import Balance from "../../../assets/balance.png";
import ClinteCard from "./ClinteCard";
import Employe from "../../../assets/employe.png";
import Spend from "../../../assets/spand.png";

export default function InfoContainer() {
  return (
    <div className="dash-inner flex-wrap flex items-start  justify-start ">
      <InfoCard
        path="/Admin/ParkingBalance"
        title={
          <>
            <span>Your Bank</span>
            <br />
            <span>Balance</span>
          </>
        }
        photo={Balance}
      />
      <InfoCard
        path="/Admin/ParkingBalance"
        title={
          <>
            <span>Employees </span>
            <br />
            <span>Working today</span>
          </>
        }
        photo={Employe}
      />
      <InfoCard
        path="
/Admin/WeekBalance"
        title={
          <>
            <span>This week’s </span>
            <br />
            <span> card spending</span>
          </>
        }
        photo={Spend}
      />
      <div className="left-data  w-3/12 px-3 flex md:my-4  justify-center flex-col   md:w-full">
        {" "}
        <ClinteCard
          title={"New clients"}
          color={"#05FF00"}
          path={"/Admin/NewClients"}
        />
        {/* <ClinteCard
            title={"invoices overdue"}
            color={"#FF0000BD"}
            path={"/Admin/NewClients"}
          /> */}
      </div>
    </div>
  );
}
