import { BaseLine } from "./deps/scrapbox.ts";
import { Blocks, CodeBlock, content } from "./codeBlock.ts";
import { Compile } from "./compile.ts";
import { getLineDOM } from "./deps/scrapbox-std-browser.ts";

export class Viewer<Line extends BaseLine> implements CodeBlock<Line> {
  get filename(): string {
    return this._filename;
  }
  get blocks(): Blocks<Line> {
    return this._blocks ?? [];
  }

  constructor(
    private _filename: string,
    blocks: Blocks<Line>,
    private _compile: Compile,
  ) {
    this.update(blocks);
  }

  /** コードブロックの更新を反映する
   *
   * @param after 更新後のコードブロック
   * @returns 削除された場合はtrue
   */
  update(after?: Blocks<Line>): boolean {
    this._dispose?.();
    if (!after || content(after) === "") {
      this._compile({ filename: this.filename, before: this.blocks });
      this._area?.remove?.();
      this._style?.remove?.();
      this._area = undefined;
      this._style = undefined;
      this._blocks = undefined;
      return true;
    }
    const before = this.blocks;
    this._blocks = after;

    this.makeStyle();
    const area = this.makeArea();
    const id = after.at(0)?.at?.(-1)?.id;
    const lineDOM = getLineDOM(id);
    if (!lineDOM) {
      throw new Error(`"div.lines#L${id}" could not be found.`);
    }
    lineDOM.insertAdjacentElement("afterend", area);

    const render = (...elements: Node[]) => {
      area.textContent = "";
      area.append(...elements);
    };
    this._dispose = this._compile({
      filename: this.filename,
      before,
      after,
      render,
    });
    return false;
  }

  /** previewの表示領域を作成する */
  private makeArea(): HTMLDivElement {
    if (this._area) return this._area;
    const area = document.createElement("div");
    area.classList.add("scrap-run");
    area.dataset.filename = this.filename;
    this._area = area;
    return area;
  }

  private makeStyle(): void {
    const bodyIds = this.blocks.flatMap((lines) =>
      lines.slice(1).map(({ id }) => `#L${id}`)
    );
    const ids = this.blocks.flatMap((lines) =>
      lines.map(({ id }) => `#L${id}`)
    );

    if (!this._style) {
      this._style = document.createElement("style");
      document.head.append(this._style);
    }

    this._style.textContent = `.lines:not(:has(:is(${
      [...ids].join(",")
    }).cursor-line)) :is(${[...bodyIds].join(",")}){display:none}`;
  }

  private _blocks: Blocks<Line> | undefined;
  private _dispose: (() => void) | undefined;
  private _area: HTMLDivElement | undefined;
  private _style: HTMLStyleElement | undefined;
}
