import { readCodeBlocks } from "./readCodeBlocks.ts";
import { assertEquals } from "./deps/testing.ts";
import { Blocks } from "./codeBlock.ts";
import { BaseLine } from "./deps/scrapbox.ts";

Deno.test("readCodeBlocks()", () => {
  const lines = [
    { id: "1", text: "title: Sample Title" },
    { id: "2", text: "line: Some line" },
    { id: "3", text: "code:main.cpp" },
    { id: "4", text: "   #include <iostream>" },
    { id: "5", text: "   int main() {" },
    { id: "6", text: '     std::cout << "Hello, C++" << std::endl;' },
    { id: "7", text: "   }" },
    { id: "8", text: "line: Another line" },
    { id: "9", text: "code:main.cpp" },
    { id: "10", text: "   int main() {" },
    { id: "11", text: '     std::cout << "Hello, C++" << std::endl;' },
    { id: "12", text: "   }" },
  ];

  const expected = new Map<string, Blocks<{ id: string; text: string }>>([
    [
      "main.cpp",
      [
        [
          { id: "3", text: "code:main.cpp" },
          { id: "4", text: "   #include <iostream>" },
          { id: "5", text: "   int main() {" },
          { id: "6", text: '     std::cout << "Hello, C++" << std::endl;' },
          { id: "7", text: "   }" },
        ],
        [
          { id: "9", text: "code:main.cpp" },
          { id: "10", text: "   int main() {" },
          { id: "11", text: '     std::cout << "Hello, C++" << std::endl;' },
          { id: "12", text: "   }" },
        ],
      ],
    ],
  ]);

  assertEquals(readCodeBlocks(lines), expected);

  const lines2 = [{
    "id": "63b7aeeb5defe7001ddae116",
    "text": "コードブロック記法",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982645,
    "updated": 1672982645,
  }, {
    "id": "63b7b0761280f00000c9bc21",
    "text": "ここでは[コードブロック]を表現する[scrapbox記法]を示す",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982645,
    "updated": 1672982671,
  }, {
    "id": "63b7b0791280f00000c9bc22",
    "text": "",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982648,
    "updated": 1672982648,
  }, {
    "id": "63b7b12b1280f00000c9bc3d",
    "text": "サンプル",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982826,
    "updated": 1672982828,
  }, {
    "id": "63b7b12c1280f00000c9bc3e",
    "text": " from [/villagepump/記法サンプル#61dd289e7838e30000dc9cb5]",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982828,
    "updated": 1672982835,
  }, {
    "id": "63b7b1261280f00000c9bc26",
    "text": "code:コードブロック.py",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982821,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc27",
    "text": ' print("Hello World!")',
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc28",
    "text": "無名コードブロック",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672983021,
  }, {
    "id": "63b7b1261280f00000c9bc29",
    "text": "code:py",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc2a",
    "text": ' print("Hello World!")',
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc2b",
    "text": "インデントつき",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc2c",
    "text": " code:インデント.md",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc2d",
    "text": "  - インデント",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc2e",
    "text": "    - インデント",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc2f",
    "text": "言語を強制",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc30",
    "text": " code:python(js)",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc31",
    "text": '  console.log("I\'m JavaScript");',
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc32",
    "text": "文芸的プログラミング",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982825,
  }, {
    "id": "63b7b1261280f00000c9bc33",
    "text": " 標準ヘッダファイルをインクルード",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc34",
    "text": "  code:main.cpp",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc35",
    "text": "   #include <iostream>",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc36",
    "text": "   ",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc37",
    "text": " main函数の定義",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc38",
    "text": "  code:main.cpp",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc39",
    "text": "   int main() {",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc3a",
    "text":
      '     std::cout << "Hello, C++" << "from scrapbox.io" << std::endl;',
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc3b",
    "text": "   }",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b1261280f00000c9bc3c",
    "text": "   ",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982822,
    "updated": 1672982822,
  }, {
    "id": "63b7b0911280f00000c9bc23",
    "text": "",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982673,
    "updated": 1672982673,
  }, {
    "id": "63b7b0911280f00000c9bc24",
    "text": "#2023-01-06 14:24:35 ",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982673,
    "updated": 1672982674,
  }, {
    "id": "63b7b0931280f00000c9bc25",
    "text": "",
    "userId": "5ef2bdebb60650001e1280f0",
    "created": 1672982674,
    "updated": 1672982674,
  }];
  assertEquals(
    readCodeBlocks(lines2),
    new Map<string, Blocks<BaseLine>>([
      ["コードブロック.py", [[
        {
          id: "63b7b1261280f00000c9bc26",
          text: "code:コードブロック.py",
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982821,
          updated: 1672982822,
        },
        {
          id: "63b7b1261280f00000c9bc27",
          text: ' print("Hello World!")',
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
      ]]],
      ["py", [[
        {
          id: "63b7b1261280f00000c9bc29",
          text: "code:py",
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
        {
          id: "63b7b1261280f00000c9bc2a",
          text: ' print("Hello World!")',
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
      ]]],
      ["インデント.md", [[
        {
          id: "63b7b1261280f00000c9bc2c",
          text: " code:インデント.md",
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
        {
          id: "63b7b1261280f00000c9bc2d",
          text: "  - インデント",
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
        {
          id: "63b7b1261280f00000c9bc2e",
          text: "    - インデント",
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
      ]]],
      ["python(js)", [[
        {
          id: "63b7b1261280f00000c9bc30",
          text: " code:python(js)",
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
        {
          id: "63b7b1261280f00000c9bc31",
          text: `  console.log("I'm JavaScript");`,
          userId: "5ef2bdebb60650001e1280f0",
          created: 1672982822,
          updated: 1672982822,
        },
      ]]],
      ["main.cpp", [
        [
          {
            id: "63b7b1261280f00000c9bc34",
            text: "  code:main.cpp",
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
          {
            id: "63b7b1261280f00000c9bc35",
            text: "   #include <iostream>",
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
          {
            id: "63b7b1261280f00000c9bc36",
            text: "   ",
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
        ],
        [
          {
            id: "63b7b1261280f00000c9bc38",
            text: "  code:main.cpp",
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
          {
            id: "63b7b1261280f00000c9bc39",
            text: "   int main() {",
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
          {
            id: "63b7b1261280f00000c9bc3a",
            text:
              '     std::cout << "Hello, C++" << "from scrapbox.io" << std::endl;',
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
          {
            id: "63b7b1261280f00000c9bc3b",
            text: "   }",
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
          {
            id: "63b7b1261280f00000c9bc3c",
            text: "   ",
            userId: "5ef2bdebb60650001e1280f0",
            created: 1672982822,
            updated: 1672982822,
          },
        ],
      ]],
    ]),
  );
});
