import React from "react";
// import DoctorList from "../../components/DoctorList/DoctorList";
// import data from '../../adata/doctordata.json';
import { useGetDoctorsQuery } from "../../api/doctorsApi";

const DoctorListPage: React.FC = () => {
  const { data, isError, isLoading, isSuccess } = useGetDoctorsQuery({});

  if (isError) {
    throw new Error("ошыбка чекни инет");
  }
  if (isSuccess) {
    return (
      <>
        {data.map((doctor) => {
          return <>{doctor}</>;
        })}
      </>
    );
  }
  return (
    <>
      <div>
        {isLoading && <>{"Здесь лоадер должен был быц, хехе"}</>}
        {/* <DoctorList doctors={data} /> */}
      </div>
    </>
  );
};

export default DoctorListPage;
