import { content } from "../../codeBlock.ts";
import { Compile } from "../../compile.ts";
import { toPlantUML } from "./toPlantumlURL.ts";

export const previewPlantUML: Compile = async (compileInit) => {
  if (!("after" in compileInit)) return undefined;
  const img = document.createElement("img");
  const url = await toPlantUML(content(compileInit.after));
  img.src = url;
  compileInit.render(img);
  return undefined;
};
