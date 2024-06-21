/* eslint-disable react/prop-types */
import ContentLoader from "react-content-loader";

const Skeleton = ({ width, height }) => (
  <div className="rounded-lg" style={{ backgroundColor: "#fff" }}>
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#c7c7c7"
      foregroundColor="#ecebeb"
    >
      <rect x="10" y="10" rx="3" ry="3" width="80" height="10" />

      <rect x="10" y="30" rx="3" ry="3" width={width - 20} height="10" />
      <rect x="10" y="50" rx="3" ry="3" width={width - 20} height="10" />
      <rect x="10" y="70" rx="3" ry="3" width={width - 20} height="10" />
    </ContentLoader>
  </div>
);

export default Skeleton;
