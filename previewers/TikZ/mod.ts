import { content } from "../../codeBlock.ts";
import { Preview } from "../../preview.ts";
import { renderToSVG } from "./renderToSVG.ts";
import { toDataURL } from "../../deps/dvi2html.ts";

export const previewTikZ = (
  workerURL: string | URL,
  zippedAssetURL: string | URL,
): Preview =>
async (previewInit) => {
  if (!("after" in previewInit)) return undefined;

  const logger = makeLogger();
  let compileLog = "Compile is not started yet. Please wait...";
  const log = (message: string) => {
    compileLog = [...compileLog.split("\n"), message].join("\n");
    logger.log(compileLog);
  };
  const img = document.createElement("img");
  const timer = setTimeout(() => {
    previewInit.render(logger.div);
    logger.log(compileLog);
  }, 2000);
  const { svg } = await renderToSVG(
    content(previewInit.after),
    workerURL,
    zippedAssetURL,
    log,
  );
  clearTimeout(timer);

  if (!svg) {
    previewInit.render(logger.div);
    logger.log(compileLog);
    return;
  }

  img.src = await toDataURL(new Blob([svg], { type: "image/svg+xml" }));
  previewInit.render(img);
};
const makeLogger = () => {
  const div = document.createElement("div");
  const shadowRoot = div.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent =
    '*{box-sizing:border-box;}pre{display:block;padding:9.5px;margin:0 0 10px;border:1px solid #ccc;border-radius:4px;height:20em;overflow:auto;font-size:13px;line-height:1.428571429;}pre code{padding:0;font-family:Menlo,Monaco,Consolas,"Courier New",monospace;font-size:inherit;word-break:break-all;word-wrap:break-word;white-space:pre-wrap;color:var(--code-color,#342d9c);background-color: rgba(0,0,0,0);border-radius:0;}';
  shadowRoot.append(style);
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.append(code);
  shadowRoot.append(pre);

  return {
    div,
    log: (message: string) => {
      code.textContent = message;
      // 最下部までスクロールして、エラー部分がすぐ見えるようにする
      pre.scroll(0, pre.scrollHeight);
    },
  };
};
