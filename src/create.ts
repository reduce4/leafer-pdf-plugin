import {
  IPlugin,
  IObject,
  ILeaferTypeCreator,
  ILeafer,
} from "@leafer-ui/interface";
import MuBackend from "./lib/MuBackend.js";

export const plugin: IPlugin = {
  name: "leafer-pdf-plugin",
  importVersion: "1.0.0-beta.6",
  import: ["LeaferTypeCreator"],
  run(LeaferUI: IObject): void {
    const LeaferTypeCreator: ILeaferTypeCreator = LeaferUI.LeaferTypeCreator;
    LeaferTypeCreator.register("board", pdfType);
  },
};

function pdfType(leafer: ILeafer) {
  leafer.backend = MuBackend;
}
