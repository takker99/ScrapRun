import { JSZip } from "../deps/deno-jszip.ts";
import { ensureDir, exists } from "../deps/fs.ts";
import { Spinner } from "../deps/cli.ts";

const spinner = new Spinner();

if (!await exists(new URL("../dist", import.meta.url))) {
  spinner.message = "Downloading assets...";
  spinner.start();
  const [bakoma, amsfonts, tikzjaxRepo] = await Promise.all([
    fetch(
      "http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma.zip",
    ).then((res) => res.arrayBuffer()),

    fetch("http://mirrors.ctan.org/fonts/amsfonts.zip").then((res) =>
      res.arrayBuffer()
    ),
    fetch("https://github.com/takker99/tikzjax/archive/refs/tags/0.3.1.zip")
      .then((res) => res.arrayBuffer()),
  ]);

  spinner.message = "Extracting assets...";

  await ensureDir(new URL("../dist", import.meta.url));
  await Promise.all([
    new JSZip().loadAsync(bakoma).then((zip) => zip.unzip("./dist")),
    new JSZip().loadAsync(amsfonts).then((zip) => zip.unzip("./dist")),
    new JSZip().loadAsync(tikzjaxRepo).then((zip) => zip.unzip("./dist")),
  ]);
}

spinner.message = "Loading TFM files...";
spinner.start();

const files = new Map<string, Uint8Array>();
for (const dir of ["../dist/bakoma/tfm", "../dist/amsfonts/tfm"]) {
  for await (const fsFile of Deno.readDir(new URL(dir, import.meta.url))) {
    if (!fsFile.isFile) continue;
    if (!fsFile.name.endsWith(".tfm")) continue;
    files.set(
      fsFile.name,
      await Deno.readFile(new URL(`${dir}/${fsFile.name}`, import.meta.url)),
    );
  }
}

spinner.message = "Loading ttf files...";

for (const dir of ["../dist/bakoma/ttf"]) {
  for await (const fsFile of Deno.readDir(new URL(dir, import.meta.url))) {
    if (!fsFile.isFile) continue;
    if (!fsFile.name.endsWith(".ttf")) continue;
    files.set(
      fsFile.name,
      await Deno.readFile(new URL(`${dir}/${fsFile.name}`, import.meta.url)),
    );
  }
}

spinner.message = "Loading gzipped assets...";

for (const dir of ["../dist/tikzjax-0.3.1/assets"]) {
  for await (const fsFile of Deno.readDir(new URL(dir, import.meta.url))) {
    if (!fsFile.isFile) continue;
    if (!fsFile.name.endsWith(".gz")) continue;
    const decompressed =
      (await Deno.open(new URL(`${dir}/${fsFile.name}`, import.meta.url)))
        .readable.pipeThrough(new DecompressionStream("gzip"));
    files.set(
      fsFile.name,
      new Uint8Array(await new Response(decompressed).arrayBuffer()),
    );
  }
}

spinner.message = "Compressing assets...";

const zip = new JSZip();
for (const [name, content] of files) {
  zip.addFile(name, content);
}
const compressed = await zip.generateAsync({
  type: "uint8array",
  compression: "DEFLATE",
  compressionOptions: { level: 9 },
});
await Deno.writeFile(
  new URL("../dist/assets.zip", import.meta.url),
  compressed,
);

spinner.stop();
