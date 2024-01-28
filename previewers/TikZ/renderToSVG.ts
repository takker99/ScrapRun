import { SVGResult } from "./types.ts";
import { WorkerCommand, WorkerResult } from "./types.ts";

let job = Promise.resolve<SVGResult>({ log: new Uint8Array(0) });
let worker: Worker | undefined;

export const renderToSVG = (
  tikz: string,
  workerURL: string | URL,
  zippedAssetURL: string | URL,
) => {
  job = (async () => {
    await job;
    worker ??= await init(workerURL, zippedAssetURL);

    const promise = new Promise<SVGResult>(
      (resolve) => {
        const callback = (e: MessageEvent<WorkerResult>) => {
          if (e.data.type !== "compile") return;
          resolve(e.data);
          worker!.removeEventListener("message", callback);
        };
        worker!.addEventListener("message", callback);
      },
    );
    worker.postMessage({ type: "compile", input: tikz } as WorkerCommand);

    return promise;
  })();

  return job;
};

const init = async (workerURL: string | URL, zippedAssetURL: string | URL) => {
  const worker = new Worker(workerURL, {
    type: "module",
  });
  const initialized = new Promise<void>((resolve) => {
    const callback = (e: MessageEvent<WorkerResult>) => {
      if (e.data.type !== "asset-url") return;
      resolve();
      worker!.removeEventListener("message", callback);
    };
    worker!.addEventListener("message", callback);
  });
  worker.postMessage({ type: "asset-url", url: `${zippedAssetURL}` });
  await initialized;
  return worker;
};
