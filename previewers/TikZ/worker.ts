/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { compile } from "../../deps/tikzjax.ts";
import { JSZip } from "../../deps/jszip.ts";
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
          showLog: false,
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

let files: Map<string, Uint8Array> | undefined;

const loadDecompress = async (file: string) => {
  files ??= await loadAssets();
  const data = files.get(file);
  if (!data) {
    const error = new Error(`File ${file} not found in assets`);
    console.log(error);
    throw error;
  }
  return data;
};

let assetsURL = "";
const loadAssets = async () => {
  const req = new Request(assetsURL);
  const cacheRes = await findLatestCache(req, { ignoreSearch: true });
  const res = cacheRes ?? await fetch(req);
  if (!cacheRes) await saveCache(req, res);

  const zip = await new JSZip().loadAsync(await res.arrayBuffer());
  const files = new Map<string, Uint8Array>();
  for (const file of Object.values(zip.files)) {
    if (file.dir) continue;
    files.set(file.name, await file.async("uint8array"));
  }
  return files;
};
