import { createBrowserRouter } from "react-router-dom";
import DefaultPdf from "./pages/DefaultPdf";
import Layout from "./Layout";

export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/defaultPdf",
        element: <DefaultPdf />,
      },
    ],
  },
]);
