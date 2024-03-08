import { Header } from "./components/Header/Header";
import { useAppDispatch } from "./store/store";
import { useEffect } from "react";
import { setUser } from "./store/slices/userSlice";

import "./App.scss";
import { Outlet } from "react-router-dom";
import { useMeQuery } from "./api/api";

function App() {
  const dispatch = useAppDispatch();
  const { data, isError, isLoading, isSuccess } = useMeQuery({});
  if (isError) {

  }
  if (isLoading) {
  }
  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser({ phone: data.phone_number }));
    }
  }, [data]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
