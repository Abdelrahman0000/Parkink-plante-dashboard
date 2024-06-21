/* eslint-disable react/prop-types */
import Lane from "./Lane";

const LeftColCar = ({ lanes, carImageUrl }) => (
  <div className="flex flex-col left-col-car">
    {lanes.map((lane, index) => (
      <Lane key={index} slot={lane} carImageUrl={carImageUrl} index={index} />
    ))}
  </div>
);

export default LeftColCar;
