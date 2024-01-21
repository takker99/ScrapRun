import { Blocks } from "./codeBlock.ts";
import { BaseLine } from "./deps/scrapbox.ts";

export type PreviewInit =
  /** 新規作成 or 更新された場合 */
  {
    filename: string;
    before?: Blocks<BaseLine>;
    after: Blocks<BaseLine>;
    render: (...elements: Node[]) => void;
  } | /** 削除された場合 */ {
    filename: string;
    before: Blocks<BaseLine>;
  };
export type Preview = (
  compileInit: PreviewInit,
) => Promise<(() => Promise<void>) | undefined>;
