import InfoCard from ".//InfoCard";
import Balance from "../../../assets/balance.png";

import Employe from "../../../assets/employe.png";
import Spend from "../../../assets/spand.png";

export default function InfoContainer() {
  return (
    <div
      className="dash-inner flex-wrap flex items-start  justify-start "
      style={{ gap: "20px" }}
    >
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
    </div>
  );
}
