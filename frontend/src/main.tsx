import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SchedulePage from "./Pages/SchedulePage/SchedulePage.tsx";
import PatientListPage from "./Pages/PatientListPage/PatientListPage.tsx";
import DoctorListPage from "./Pages/DoctorListPage/DoctorListPage.tsx";
import AuthPage from "./Pages/AuthPage/AuthPage.tsx";
import EditorPage from "./Pages/EditorPage/EditorPage.tsx";
import TestComponentPage from "./Pages/TestComponentPage/TestComponentPage.tsx";
import NotFound from "./components/NotFound/NotFound.tsx";
import MainPage from "./Pages/MainPage/MainPage.tsx";
import MePage from "./components/MePage/MePage.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainPage />
      },
      {
        path: '/schedule',
        element: <SchedulePage />
      },
      {
        path: '/patients',
        element: <PatientListPage />
      },
      {
        path: '/doctors',
        element: <DoctorListPage />
      },
      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: '/editor',
        element: <EditorPage />
      },
      {
        path: '/me',
        element: <MePage />
      },
      {
        path: '/test',
        element: <TestComponentPage />
      },
      {
        path: '*',
        element: <NotFound message="404 Not Found" />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);
