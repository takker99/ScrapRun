import { BaseLine } from "./deps/scrapbox.ts";
import { Blocks, CodeBlock, content } from "./codeBlock.ts";
import { Preview } from "./preview.ts";
import { getLineDOM } from "./deps/scrapbox-std-browser.ts";
import { debounce } from "./debounce.ts";
import { Result } from "./debounce.ts";

export class Viewer<Line extends BaseLine> implements CodeBlock<Line> {
  get filename(): string {
    return this._filename;
  }
  get blocks(): Blocks<Line> {
    return this._blocks ?? [];
  }

  constructor(
    private _filename: string,
    preview: Preview,
  ) {
    this._preview = debounce(async (before, after, area) => {
      // previewerの実行
      this._dispose = await preview(
        area
          ? {
            filename: this.filename,
            before,
            after,
            render: (...elements: Node[]) => {
              area.textContent = "";
              area.append(...elements);
            },
          }
          : { filename: this.filename, before },
      );
      return false;
    });
  }

  async update(after?: Blocks<Line>): Promise<Result<boolean>> {
    await this._dispose?.();
    if (!after || content(after) === "") {
      // コードブロックが削除されたときの処理
      const result = await this._preview(this.blocks);
      if (result.type === "cancel") return result;
      if (result.type === "reject") throw result.value;
      this._area?.remove?.();
      this._style?.remove?.();
      this._area = undefined;
      this._style = undefined;
      this._blocks = undefined;
      return { type: "resolve", value: true };
    }
    const before = this.blocks;
    this._blocks = after;

    // 描画領域の構築
    this.makeStyle();
    const area = this.makeArea();

    // 挿入位置の特定と挿入
    const id = after.at(0)?.at?.(-1)?.id;
    const lineDOM = getLineDOM(id);
    if (!lineDOM) {
      throw new Error(`"div.lines#L${id}" could not be found.`);
    }
    lineDOM.insertAdjacentElement("afterend", area);

    // インデントを前の行に追随させる
    const fixMargin = () => {
      const indent = lineDOM.getElementsByClassName("indent")[0];
      if (!(indent instanceof HTMLElement)) return;
      area.style.marginLeft = indent.style.marginLeft;
    };
    this._observer?.disconnect?.();
    fixMargin();
    this._observer = new MutationObserver(fixMargin);
    this._observer.observe(lineDOM, { childList: true, subtree: true });

    return this._preview(before, after, area);
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
  private _dispose: (() => Promise<void>) | undefined;
  /** コードブロックの更新を反映する
   *
   * @param after 更新後のコードブロック
   * @returns 削除された場合はtrue
   */
  private _preview: (
    before: Blocks<Line>,
    after?: Blocks<Line>,
    area?: HTMLDivElement,
  ) => Promise<Result<boolean>>;
  private _area: HTMLDivElement | undefined;
  private _observer: MutationObserver | undefined;
  private _style: HTMLStyleElement | undefined;
}
