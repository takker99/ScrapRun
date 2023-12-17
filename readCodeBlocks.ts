import {
  convertToBlock,
  packRows,
  parseToRows,
} from "./deps/scrapbox-parser.ts";
import { Blocks } from "./codeBlock.ts";

export const readCodeBlocks = <Line extends { id: string; text: string }>(
  lines: readonly Line[],
): Map<string, Blocks<Line>> => {
  const codeBlocks = new Map<string, Blocks<Line>>();
  if (lines.length === 0) return codeBlocks;
  const packs = packRows(
    parseToRows(lines.map((line) => line.text).join("\n")),
    { hasTitle: true },
  );

  /** 現在読んでいる`pack.rows`の行番号 */
  let counter = 0;

  for (const pack of packs) {
    switch (pack.type) {
      case "title":
      case "line":
        counter++;
        break;
      case "table":
        counter += pack.rows.length;
        break;
      case "codeBlock": {
        const block = convertToBlock(pack);
        if (block.type !== "codeBlock") throw Error("Must be a codeblock");
        const blocks = codeBlocks.get(block.fileName) ??
          [];
        blocks.push(lines.slice(counter, counter + pack.rows.length));
        codeBlocks.set(block.fileName, blocks);
        counter += pack.rows.length;
        break;
      }
    }
  }
  return codeBlocks;
};
