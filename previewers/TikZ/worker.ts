/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { compile } from "../../deps/tikzjax.ts";
import { decode } from "https://raw.githubusercontent.com/takker99/deno-zip/0.0.2/mod.ts";
import { WorkerCommand, WorkerResult } from "./types.ts";
import { findLatestCache, saveCache } from "./cache.ts";
import {
  Color,
  color,
  convertToHTML,
  Papersize,
  papersize,
  parse,
  ParseInfo,
  PS,
  ps,
  Rule,
  Special,
  SVG,
  svg,
  Text,
} from "../../deps/dvi2html.ts";

globalThis.onmessage = async (e) => {
  const data: WorkerCommand = e.data;
  switch (data.type) {
    case "asset-url":
      {
        assetsURL = data.url;
        const result: WorkerResult = { type: data.type };
        globalThis.postMessage(result);
      }
      break;
    case "compile":
      {
        const { dvi, log } = await compile(data.input, {
          fileLoader: loadDecompress,
          console: (message: string) => {
            const result: WorkerResult = { type: "stdout", message };
            globalThis.postMessage(result);
          },
        });
        if (!dvi) {
          const result: WorkerResult = { type: data.type, log };
          globalThis.postMessage(result, [log.buffer]);
          return;
        }

        const commands:
          (Special | PS | Papersize | SVG | Color | Text | Rule | ParseInfo)[] =
            [];
        const fontNames = new Set<string>();
        for await (
          const command of parse(dvi, {
            plugins: [papersize, ps(), svg(), color()],
            tfmLoader: loadDecompress,
          })
        ) {
          commands.push(command);
          if (command.type !== "text") continue;
          fontNames.add(command.font.name);
        }
        const xml = await convertToHTML(commands, {
          fileLoader: loadDecompress,
          svg: true,
        });

        const result: WorkerResult = { type: data.type, svg: xml, log };
        globalThis.postMessage(result, [log.buffer]);
      }
      break;
  }
};

let files: Map<string, () => Promise<ArrayBuffer>> | undefined;

const loadDecompress = async (file: string) => {
  files ??= await loadAssets();
  const extract = files.get(file);
  if (!extract) {
    const error = new Error(`File ${file} not found in assets`);
    console.log(error);
    throw error;
  }
  return new Uint8Array(await extract());
};

let assetsURL = "";
const loadAssets = async () => {
  const req = new Request(assetsURL);
  const cacheRes = await findLatestCache(req, { ignoreSearch: true });
  const res = cacheRes ?? await fetch(req);
  if (!cacheRes) await saveCache(req, res);

  const files = new Map<string, () => Promise<ArrayBuffer>>();
  for await (const { name, arrayBuffer } of decode(await res.arrayBuffer())) {
    files.set(name, arrayBuffer);
  }
  return files;
};
