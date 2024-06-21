import ClientMap from "./ClientMap";
import ClinteCard from "./ClinteCard";
export default function ClinteContainer() {
  return (
    <div className="mt-10">
      <div className="flex flex-wrap" style={{ gap: "20px" }}>
        <div className="left-data w-4/12 flex  justify-center flex-col mt-14  md:w-full">
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
        <div className="right-data   w-7/12 md:w-full">
          <ClientMap />
        </div>
      </div>
    </div>
  );
}
