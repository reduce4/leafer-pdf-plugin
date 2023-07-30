import { IPlugin, IObject } from "@leafer-ui/interface";
import PdfLoader, { IPdfLoader, LoadParams } from "./PdfLoader";

export const PDF: IPlugin = {
  name: "leafer-pdf-plugin",
  importVersion: "1.0.0-beta.7",
  import: ["Leafer"],
  run(LeaferUI: IObject, config?: IObject): void {
    PDF.Loader = PdfLoader;
  },
  async load(url: string, loadParams?: LoadParams): Promise<IPdfLoader> {
    const loader: IPdfLoader = new PDF.Loader();
    await loader.load(url, loadParams);
    return loader;
  },
};
