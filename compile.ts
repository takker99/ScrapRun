import { Blocks } from "./codeBlock.ts";
import { BaseLine } from "./deps/scrapbox.ts";

export type CompileInit =
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
export type Compile = (
  compileInit: CompileInit,
) => Promise<(() => Promise<void>) | undefined>;
