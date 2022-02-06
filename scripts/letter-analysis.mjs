import {readFile} from "fs/promises";

const fileName = process.argv[2];

if (!fileName) throw new Error("please pass filename!");

const content = await readFile(fileName, "utf8");

const letters = {};
let count = 0;

for (const word of content.split("\n")) {
  if (!word) continue;
  count += 1;
  const wordLetters = new Set(word);
  for (const l of wordLetters) {
    letters[l] = (letters[l] || 0) + 1;
  }
}

const sorted = Object.entries(letters).sort((a, b) => b[1] - a[1]);

const percent = sorted.map(([l, c]) => [l, ((c / count) * 100).toFixed(1)]);

console.log(Object.fromEntries(percent));
