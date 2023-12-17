import { content } from "../codeBlock.ts";
import { Compile } from "../compile.ts";
import { encodeBase64Url } from "../deps/base64url.ts";

export const previewSVG: Compile = (compileInit) => {
  if (!("after" in compileInit)) return undefined;
  const url = `data:image/svg+xml;base64,${
    encodeBase64Url(content(compileInit.after))
  }`;
  const img = document.createElement("img");
  img.src = url;
  compileInit.render(img);
  return undefined;
};
