import { content } from "../../codeBlock.ts";
import { Preview } from "../../preview.ts";
import { renderToSVG } from "./renderToSVG.ts";
import { toDataURL } from "../../deps/dvi2html.ts";

// ported from https://github.com/artisticat1/tikzjax/blob/ba892f23a2d280d018681a4f88b39f5a8648c7c7/src/index.js#L39C66-L39C835
const loadingSVG =
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100pt" height="100pt" viewBox="0 0 100 100"><rect width="100" height="100" rx="5pt" ry="5pt" fill="#000" fill-opacity="0.2"/><circle cx="50" cy="50" r="15" stroke="#f3f3f3" fill="none" stroke-width="3"/><circle cx="50" cy="50" r="15" stroke="#3498db" fill="none" stroke-width="3" stroke-linecap="round"><animate attributeName="stroke-dasharray" begin="0s" dur="2s" values="56.5 37.7;1 93.2;56.5 37.7" keyTimes="0;0.5;1" repeatCount="indefinite"></animate><animate attributeName="stroke-dashoffset" begin="0s" dur="2s" from="0" to="188.5" repeatCount="indefinite"></animate></circle></svg>';
const loadingSVGURL = await toDataURL(
  new Blob([loadingSVG], { type: "image/svg+xml" }),
);

export const previewTikZ = (
  workerURL: string | URL,
  zippedAssetURL: string | URL,
): Preview =>
async (previewInit) => {
  if (!("after" in previewInit)) return undefined;
  const tikz = content(previewInit.after);

  const img = document.createElement("img");
  const timer = setTimeout(() => {
    img.src = loadingSVGURL;
    previewInit.render(img);
  }, 500);
  const { svg, log } = await renderToSVG(tikz, workerURL, zippedAssetURL);
  clearTimeout(timer);

  if (!svg) {
    const pre = document.createElement("pre");
    const code = document.createElement("code");

    pre.style.height = "20em";
    pre.append(code);
    code.textContent = new TextDecoder().decode(log);

    previewInit.render(pre);
    // 最下部までスクロールして、エラー部分がすぐ見えるようにする
    pre.scroll(0, pre.scrollHeight);
    return;
  }

  img.src = await toDataURL(new Blob([svg], { type: "image/svg+xml" }));
  previewInit.render(img);
};
