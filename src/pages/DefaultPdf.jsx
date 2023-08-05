import { useEffect, useRef, useState } from "react";
import OperationButtons from "../components/OperationButtons";
import useLeafer from "../hooks/useLeafer";
import { Col, Row, Menu } from "antd";

const DefaultPdf = () => {
  const defaultRef = useRef(null);
  const { pdfLoader, pdfOutlines, keyPageMap } = useLeafer({
    view: defaultRef,
  });

  return (
    <Row>
      <Col xl={6} lg={6} md={6} sm={24} xs={24}>
        <Menu
          items={pdfOutlines}
          onClick={(e) => pdfLoader?.goTo(keyPageMap.get(e.key))}
        />
      </Col>
      <Col xl={18} lg={18} md={18} sm={24} xs={24}>
        <div
          style={{
            minHeight: "80vh",
          }}
          ref={defaultRef}
        >
          <OperationButtons
            onPrev={() => pdfLoader?.prev()}
            onNext={() => pdfLoader?.next()}
            onEnlarge={() => pdfLoader?.enLarge()}
            onShrink={() => pdfLoader?.shrink()}
          />
        </div>
      </Col>
    </Row>
  );
};
export default DefaultPdf;
