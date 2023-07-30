import { PDF } from "./create";
import { Leafer, usePlugin, Debug, Image } from "leafer-ui";
import { IObject } from "@leafer-ui/interface";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "antd";
usePlugin(PDF);
const App = () => {
  const [leafer, setLeafer] = useState<IObject>();
  const [pdfLoader, setPdfLoader] = useState();
  useEffect(() => {
    const fdata = async () => {
      const leafer = new Leafer({ view: window });
      setLeafer(leafer);
      const pdf = await PDF.load("/test.pdf", {
        zoomLevels: [
          50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150,
          160, 170, 180, 190, 200,
        ],
        dpi: 96,
      });
      setPdfLoader(pdf);
      leafer.add(pdf);
    };
    fdata();
  }, []);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 999,
        }}
      >
        <Button
          onClick={() => {
            pdfLoader?.prev();
          }}
        >
          上一页
        </Button>
        <Button
          onClick={() => {
            pdfLoader?.next();
          }}
        >
          下一页
        </Button>
      </div>
    </>
  );
};

ReactDOM.createRoot((document as any).getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
