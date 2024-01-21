import { content } from "../codeBlock.ts";
import { Compile } from "../compile.ts";
import { toDataURL } from "../deps/dvi2html.ts";

export const previewSVG: Compile = async (compileInit) => {
  if (!("after" in compileInit)) return undefined;
  const svg = content(compileInit.after);
  const dom = new DOMParser().parseFromString(svg, "image/svg+xml");
  const error = dom.querySelector("parsererror");
  // if failed to parse
  if (error) {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.innerText = error.innerHTML;
    pre.append(code);
    compileInit.render(pre);
    return;
  }

  const url = await toDataURL(new Blob([svg], { type: "image/svg+xml" }));
  const img = document.createElement("img");
  img.src = url;
  compileInit.render(img);
};
