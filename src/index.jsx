import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { StyleProvider } from "@ant-design/cssinjs";
import { RouterProvider } from "react-router-dom";
import routers from "./router";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyleProvider hashPriority="high">
      <RouterProvider router={routers}>
        <App />
      </RouterProvider>
    </StyleProvider>
  </React.StrictMode>
);
