import { parse } from "./deps/scrapbox-parser.ts";
import { Blocks } from "./codeBlock.ts";

export const readCodeBlocks = <Line extends { id: string; text: string }>(
  lines: readonly Line[],
): Map<string, Blocks<Line>> => {
  const codeBlocks = new Map<string, Line[][]>();
  if (lines.length === 0) return codeBlocks;
  const packs = parse(
    lines.map((line) => line.text).join("\n"),
    { hasTitle: true },
  );

  /** 現在読んでいる`pack.rows`の行番号 */
  let counter = 0;

  for (const block of packs) {
    switch (block.type) {
      case "title":
      case "line":
        counter++;
        break;
      case "table":
        counter += block.cells.length + 1;
        break;
      case "codeBlock": {
        const blocks = codeBlocks.get(block.fileName) ??
          [];
        const lineCount = block.content.split("\n").length + 1;
        blocks.push(lines.slice(counter, counter + lineCount));
        codeBlocks.set(block.fileName, blocks);
        counter += lineCount;
        break;
      }
    }
  }
  return codeBlocks;
};
