import { Blocks, CodeBlock, content } from "./codeBlock.ts";
import { BaseLine } from "./deps/scrapbox.ts";

export interface Diff {
  filename: string;
  changed: boolean;
}

export function* diff<
  Line1 extends BaseLine,
  Line2 extends BaseLine,
  Block1 extends CodeBlock<Line1>,
>(
  oldMap: Map<string, Block1>,
  newMap: Map<string, Blocks<Line2>>,
): Generator<Diff> {
  for (const [filename, blocks] of newMap.entries()) {
    const oldCode = oldMap.get(filename);
    if (oldCode && content(oldCode.blocks) === content(blocks)) {
      yield { changed: false, filename };
    }
    yield { changed: true, filename };
  }
  for (const filename of oldMap.keys()) {
    if (newMap.has(filename)) continue;
    yield { changed: true, filename };
  }
}
