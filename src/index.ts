import { plugin } from "./create";
import { Leafer, usePlugin, Debug, Image } from "leafer-ui";
// Debug.enable = true;

usePlugin(plugin);

const leafer = new Leafer({ view: window, type: "board" });
const b = new leafer.backend();
init();
async function init() {
  await b._init("/test.pdf");
  const page = 1;
  const w = await b.mu_pageWidth(page);
  const h = await b.mu_pageHeight(page);
  const res = await b.mu_countPages();
  const svg = await b.render.renderSVG(page);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image({
    width: w,
    height: h,
    url,
  });
  leafer.add(img);
}
