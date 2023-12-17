import { content } from "../codeBlock.ts";
import { Compile } from "../compile.ts";

export const previewSVG: Compile = (compileInit) => {
  if (!("after" in compileInit)) return undefined;
  const url = `data:image/svg+xml;charset=utf8,${
    encodeURIComponent(content(compileInit.after))
  }`;
  const img = document.createElement("img");
  img.src = url;
  compileInit.render(img);
  return undefined;
};
