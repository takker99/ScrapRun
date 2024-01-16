import { content } from "../../codeBlock.ts";
import { Compile } from "../../compile.ts";
import { toPlantUML } from "./toPlantumlURL.ts";

export const previewPlantUML: Compile = (compileInit) => {
  if (!("after" in compileInit)) return undefined;
  const img = document.createElement("img");
  toPlantUML(content(compileInit.after)).then((url) => {
    img.src = url;
  });
  compileInit.render(img);
  return undefined;
};
