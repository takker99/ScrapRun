import { deflate, initSyncBundledOnce } from "../../deps/denoflate.ts";
import { encode64, textToBuffer } from "./encode.ts";

export const toPlantUML = (
  uml: string,
  type: "svg" | "png" | "dsvg" | "dpng" = "svg",
) => {
  initSyncBundledOnce();
  return `https://www.plantuml.com/plantuml/${type}/${
    encode64(deflate(textToBuffer(uml), 9))
  }`;
};
