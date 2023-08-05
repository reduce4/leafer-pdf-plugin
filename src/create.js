import PdfLoader from "./PdfLoader";

export const PDF = {
  name: "leafer-pdf-plugin",
  importVersion: "1.0.0-beta.7",
  import: ["Leafer"],
  run(LeaferUI, config) {
    PDF.Loader = PdfLoader;
  },
  async load(url, loadParams) {
    const loader = new PDF.Loader();
    await loader.load(url, loadParams);
    return loader;
  },
};
