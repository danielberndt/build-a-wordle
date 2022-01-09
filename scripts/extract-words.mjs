import {readFile} from "fs/promises";

const fileName = process.argv[2];

if (!fileName) throw new Error("please pass filename!");

const content = await readFile(fileName, "utf8");

const map = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  é: "e",
  á: "a",
};

const applyMapping = (word) =>
  Array.from(word)
    .map((letter) => map[letter] || letter)
    .join("");

const validWords = content
  .split("\n")
  .map((word) => word.toLowerCase())
  .map(applyMapping)
  .filter((w) => /^[a-z]+$/.test(w))
  .filter((w) => w.length === 5);

const uniqueWords = [...new Set(validWords)];

console.log(JSON.stringify(uniqueWords, null, 2));
