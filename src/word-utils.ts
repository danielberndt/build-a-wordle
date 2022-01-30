const letterScores = {
  e: 1,
  n: 1,
  s: 1,
  i: 1,
  r: 1,
  t: 1,
  u: 1,
  a: 1,
  d: 1,
  h: 2,
  g: 2,
  l: 2,
  o: 2,
  m: 3,
  b: 3,
  w: 3,
  z: 3,
  c: 4,
  f: 4,
  k: 4,
  p: 4,
  ä: 6,
  j: 6,
  ü: 6,
  v: 6,
  ö: 8,
  x: 8,
  q: 10,
  y: 10,
};

export const scoreWord = (word: string) => {
  const seenLetter = new Set();
  let score = 0;
  for (let letter of Array.from(word)) {
    let letterScore = letterScores[letter as keyof typeof letterScores] || 0;
    if (seenLetter.has(letter)) letterScore *= 2 + 2;
    score += letterScore;
    seenLetter.add(letter);
  }
  return score;
};
