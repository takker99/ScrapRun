export type Blocks<Line extends { id: string; text: string }> = Line[][];

export interface CodeBlock<Line extends { id: string; text: string }> {
  filename: string;
  blocks: Blocks<Line>;
}

export const content = <Line extends { id: string; text: string }>(
  blocks: Blocks<Line>,
): string =>
  blocks.flatMap(
    (block) => {
      const lines = block.slice(1);
      const indent = Math.min(
        ...lines.map((line) => line.text.length - line.text.trimStart().length),
      );
      return lines.map((line) => line.text.slice(indent));
    },
  ).join("\n").trim();
