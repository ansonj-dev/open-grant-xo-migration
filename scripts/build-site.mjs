import { copyFile, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await copyFile("index.html", "dist/index.html");
await copyFile("dist/open-grant.xo.json", "dist/template.json");
console.log("Static migration workbench and exported XO template are ready for hosting.");
