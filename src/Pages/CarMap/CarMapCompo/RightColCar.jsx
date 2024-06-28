/* eslint-disable react/prop-types */
import Lane from "./Lane";

const RightColCar = ({ lanes, carImageUrl }) => (
  <div className="flex flex-col right-col-car">
    {lanes.map((lane, index) => (
      <Lane key={index} slot={lane} carImageUrl={carImageUrl} index={index} />
    ))}
  </div>
);

export default RightColCar;
