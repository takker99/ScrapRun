import { deflate, initBundledOnce, Memory } from "../../deps/denoflate.ts";
import { encode64, textToBuffer } from "./encode.ts";

await initBundledOnce();
export const toPlantUML = (
  uml: string,
  type: "svg" | "png" | "dsvg" | "dpng" = "svg",
) => {
  return `https://www.plantuml.com/plantuml/${type}/${
    encode64(deflate(new Memory(textToBuffer(uml)), 9).bytes)
  }`;
};
