import {readFile} from "fs/promises";
import {join} from "path";

// const content = await readFile(fileName, "utf8");

// const words = [...content.matchAll(/(?:der|die|das)\s+([A-ZÄÖÜ][a-zßäöü]+)/g)].map((g) => g[1]);

// console.log(words.join("\n") + "\n");

const readFromStdin = () => {
  const inputChunks = [];

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", function (chunk) {
    inputChunks.push(chunk);
  });

  return new Promise((resolve, reject) => {
    process.stdin.on("end", function () {
      resolve(inputChunks.join());
    });
    process.stdin.on("error", function () {
      reject(Error("error during read"));
    });
    process.stdin.on("timeout", function () {
      reject(Error("timout during read"));
    });
  });
};

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

const input = await readFromStdin();

const validWords = input
  .split(/\s+/)
  .map((word) => word.toLowerCase())
  .map(applyMapping)
  .filter((w) => /^[a-z]+$/.test(w))
  .filter((w) => w.length === 5);

const existing = await readFile(join("./data/german-pruned.txt"), "utf8");
const existingSet = new Set(existing.split("\n"));

console.log(validWords.filter((w) => !existingSet.has(w)).join("\n"));
