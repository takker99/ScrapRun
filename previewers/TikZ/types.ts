export type WorkerCommand = {
  type: "asset-url";
  url: string;
} | {
  type: "compile";
  input: string;
};
export interface SVGResult {
  svg?: string;
  log: Uint8Array;
}
export type WorkerResult =
  | {
    type: "asset-url";
  }
  | { type: "stdout"; message: string }
  | {
    type: "compile";
  } & SVGResult;
