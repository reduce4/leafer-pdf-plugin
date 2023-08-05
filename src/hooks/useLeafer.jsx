import { PDF } from "leafer-pdf-plugin";
import { Leafer, usePlugin } from "leafer-ui";
import React, { useEffect, useState } from "react";
usePlugin(PDF);
const formatOutlines = (pdfOutline) => {
  if (pdfOutline == null) {
    return [];
  }
  const res = [];
  const keyPageMap = new Map();
  let key = 1;
  const travel = (outlines, res) => {
    for (let outline of outlines) {
      const item = {
        key: key++,
        label: outline.title,
        page: outline.page,
        children:
          outline.children == null ? undefined : travel(outline.children, []),
      };
      keyPageMap.set(item.key + "", item.page);
      res.push(item);
    }
    return res;
  };
  travel(pdfOutline, res);
  return [res, keyPageMap];
};
const useLeafer = ({ view }) => {
  const [leafer, setLeafer] = useState();
  const [pdfLoader, setPdfLoader] = useState(null);
  const [pdfOutlines, setPdfOutlines] = useState([]);
  const [keyPageMap, setKeyPageMap] = useState(new Map());
  useEffect(() => {
    view = view.current;
    if (view == null) {
      return;
    }
    const fdata = async () => {
      const leafer = new Leafer({ view });
      setLeafer(leafer);
      const pdf = await PDF.load("/test.pdf", {
        zoomLevels: [
          50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150,
          160, 170, 180, 190, 200,
        ],
        dpi: 96,
      });
      setPdfLoader(pdf);
      const [otls, maps] = formatOutlines(pdf.outline);
      setPdfOutlines(otls);
      setKeyPageMap(maps);
      leafer.add(pdf._group);
    };
    fdata();
  }, [view]);
  return {
    pdfLoader,
    pdfOutlines,
    keyPageMap,
  };
};
export default useLeafer;
