import fs from "fs/promises";
import render from "preact-render-to-string";
import About from "./pages/about";

const doIt = async () => {
  const html = render(<About />);
  const filePath = `./dist/about.html`;
  const template = await fs.readFile(filePath, "utf-8");
  const fileContent = template
    .replace(`<!-- app-content -->`, html)
    .replace(/[ ]*\<script .+\<\/script\>[ ]*(:?\n)?/g, "")
    .replace(/[ ]*\<link rel="modulepreload.+\>[ ]*(:?\n)?/g, "");

  await fs.rm(filePath);
  await fs.mkdir("./dist/about");
  await fs.writeFile("./dist/about/index.html", fileContent);
  console.log("pre-rendered:", filePath);
};

doIt().catch((e) => console.error(e));
