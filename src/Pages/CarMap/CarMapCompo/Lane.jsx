/* eslint-disable react/prop-types */
import { IoIosArrowForward } from "react-icons/io";

const Lane = ({ slot, carImageUrl, index }) => (
  <div className="flex items-center slot-num justify-between">
    {slot.status === "Busy" ? (
      <img
        className="slot-img"
        src={carImageUrl}
        style={{ animationDelay: `${index * 0.3}s` }}
      />
    ) : (
      <div className="text-xl slot-p font-bold">{slot.name}</div>
    )}
    <span>
      <IoIosArrowForward />
    </span>
    <span className="end-span">
      <IoIosArrowForward />
    </span>
  </div>
);

export default Lane;
