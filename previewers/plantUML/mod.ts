import { content } from "../../codeBlock.ts";
import { Preview } from "../../preview.ts";
import { toPlantUML } from "./toPlantumlURL.ts";

export const previewPlantUML: Preview = async (previewInit) => {
  if (!("after" in previewInit)) return undefined;
  const img = document.createElement("img");
  const url = await toPlantUML(content(previewInit.after));
  img.src = url;
  previewInit.render(img);
  return undefined;
};
