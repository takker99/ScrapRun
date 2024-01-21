import { content } from "../codeBlock.ts";
import { Compile } from "../compile.ts";
import { GlslCanvas } from "../deps/glslCanvas.ts";

export const previewGLSL: Compile = (compileInit) => {
  if (!("after" in compileInit)) return Promise.resolve(undefined);
  const canvas = document.createElement("canvas");
  const sandbox = new GlslCanvas(canvas);
  sandbox.load(content(compileInit.after));
  compileInit.render(canvas);
  return Promise.resolve(undefined);
};
