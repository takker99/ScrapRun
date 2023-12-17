import { Blocks, content } from "./codeBlock.ts";
import { assertEquals } from "./deps/testing.ts";

const blocks: Blocks<{ id: string; text: string }> = [
  [
    { "id": "63b7b1261280f00000c9bc34", "text": "  code:main.cpp" },
    { "id": "63b7b1261280f00000c9bc35", "text": "   #include <iostream>" },
    { "id": "63b7b1261280f00000c9bc36", "text": "   " },
  ],
  [
    { "id": "63b7b1261280f00000c9bc38", "text": "  code:main.cpp" },
    { "id": "63b7b1261280f00000c9bc39", "text": "   int main() {" },
    {
      "id": "63b7b1261280f00000c9bc3a",
      "text":
        '     std::cout << "Hello, C++" << "from scrapbox.io" << std::endl;',
    },
    { "id": "63b7b1261280f00000c9bc3b", "text": "   }" },
    { "id": "63b7b1261280f00000c9bc3c", "text": "   " },
  ],
];
Deno.test("content()", () => {
  assertEquals(
    content(blocks),
    '#include <iostream>\n\nint main() {\n  std::cout << "Hello, C++" << "from scrapbox.io" << std::endl;\n}',
  );
});
