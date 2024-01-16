import { encode64 } from "./encode.ts";

export const toPlantUML = async (
  uml: string,
  type: "svg" | "png" | "dsvg" | "dpng" = "svg",
): Promise<string> => {
  const stream = new Blob([new TextEncoder().encode(uml)]).stream()
    .pipeThrough(
      new CompressionStream("deflate"),
    );
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer());

  return `https://www.plantuml.com/plantuml/${type}/~1${encode64(compressed)}`;
};
