import { content } from "../codeBlock.ts";
import { Preview } from "../preview.ts";
import { GlslCanvas } from "../deps/glslCanvas.ts";

export const previewGLSL: Preview = (previewInit) => {
  if (!("after" in previewInit)) return Promise.resolve(undefined);
  const canvas = document.createElement("canvas");
  const sandbox = new GlslCanvas(canvas);
  sandbox.load(content(previewInit.after));
  previewInit.render(canvas);
  return Promise.resolve(undefined);
};
