import { Compile } from "./compile.ts";
import { takeInternalLines } from "./deps/scrapbox-std-browser.ts";
import { BaseLine, Scrapbox } from "./deps/scrapbox.ts";
import { diff } from "./diff.ts";
import { readCodeBlocks } from "./readCodeBlocks.ts";
import { Viewer } from "./viewer.ts";
declare const scrapbox: Scrapbox;

export interface Compiler {
  when: RegExp;
  compile: Compile;
}

/** ScrapRunを起動する */
export const setup = (
  { compilers }: { compilers: Compiler[] },
): () => void => {
  const viewers = new Map<string, Viewer<BaseLine>>();
  const update = () => {
    const codeBlocks = readCodeBlocks(takeInternalLines());
    for (const { changed, filename } of diff(viewers, codeBlocks)) {
      if (!changed) continue;
      const newBlocks = codeBlocks.get(filename);
      const viewer = viewers.get(filename);
      if (!viewer) {
        if (!newBlocks) continue;
        // create
        const compile = compilers.find(({ when }) => when.test(filename))
          ?.compile;
        if (!compile) continue;
        viewers.set(filename, new Viewer(filename, newBlocks, compile));
        continue;
      }
      // update or delete
      const deleted = viewer.update(newBlocks);
      if (deleted) viewers.delete(filename);
      continue;
    }
  };

  const handlePageChanged = () => {
    if (scrapbox.Layout !== "page") {
      scrapbox.off("lines:changed", update);
      return;
    }
    update();
    scrapbox.on("lines:changed", update);
  };

  handlePageChanged();
  scrapbox.on("page:changed", handlePageChanged);

  const style = document.createElement("style");
  style.textContent = `.scrap-run{display:block;width:95%}`;
  document.head.append(style);

  return () => {
    scrapbox.off("page:changed", handlePageChanged);
    style.remove();
  };
};
