import { content } from "../codeBlock.ts";
import { Preview } from "../preview.ts";
import { toDataURL } from "../deps/dvi2html.ts";

export const previewSVG: Preview = async (previewInit) => {
  if (!("after" in previewInit)) return undefined;
  const svg = content(previewInit.after);
  const dom = new DOMParser().parseFromString(svg, "image/svg+xml");
  const error = dom.querySelector("parsererror");
  // if failed to parse
  if (error) {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.innerText = error.innerHTML;
    pre.append(code);
    previewInit.render(pre);
    return;
  }

  const url = await toDataURL(new Blob([svg], { type: "image/svg+xml" }));
  const img = document.createElement("img");
  img.src = url;
  previewInit.render(img);
};
