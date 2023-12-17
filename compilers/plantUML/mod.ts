import { content } from "../../codeBlock.ts";
import { Compile } from "../../compile.ts";
import { toPlantUML } from "./toPlantumlURL.ts";

export const previewPlantUML: Compile = (compileInit) => {
  if (!("after" in compileInit)) return undefined;
  const url = toPlantUML(content(compileInit.after));
  const img = document.createElement("img");
  img.src = url;
  compileInit.render(img);
  return undefined;
};
