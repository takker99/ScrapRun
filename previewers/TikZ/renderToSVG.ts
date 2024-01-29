import { SVGResult } from "./types.ts";
import { WorkerCommand, WorkerResult } from "./types.ts";

let job = Promise.resolve<SVGResult>({ log: new Uint8Array(0) });
let worker: Worker | undefined;

export const renderToSVG = (
  tikz: string,
  workerURL: string | URL,
  zippedAssetURL: string | URL,
  console: (message: string) => void,
) => {
  job = (async () => {
    await job;
    worker ??= await init(workerURL, zippedAssetURL);

    const promise = new Promise<SVGResult>(
      (resolve) => {
        const callback = (e: MessageEvent<WorkerResult>) => {
          if (e.data.type === "stdout") {
            console(e.data.message);
            return;
          }
          if (e.data.type !== "compile") return;
          resolve(e.data);
          worker!.removeEventListener("message", callback);
        };
        worker!.addEventListener("message", callback);
      },
    );
    const command: WorkerCommand = { type: "compile", input: tikz };
    worker.postMessage(command);

    return promise;
  })();

  return job;
};

const init = async (workerURL: string | URL, zippedAssetURL: string | URL) => {
  const worker = new Worker(workerURL, { type: "module" });
  const initialized = new Promise<void>((resolve) => {
    const callback = (e: MessageEvent<WorkerResult>) => {
      if (e.data.type !== "asset-url") return;
      resolve();
      worker!.removeEventListener("message", callback);
    };
    worker!.addEventListener("message", callback);
  });
  const command: WorkerCommand = {
    type: "asset-url",
    url: `${zippedAssetURL}`,
  };
  worker.postMessage(command);
  await initialized;
  return worker;
};
