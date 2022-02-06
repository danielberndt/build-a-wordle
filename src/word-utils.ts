export const letterScores = {
  e: 1, // 64.5%
  a: 2, // 36.5%
  r: 2, // 32.8%
  n: 2, // 31.6%
  i: 3, // 28.5%
  t: 3, // 27.5%
  s: 3, // 27.4%
  l: 3, // 25.6%
  o: 3, // 22.2%
  u: 3, // 21.6%
  h: 4, // 14.9%
  k: 4, // 14.8%
  b: 4, // 13.6%
  m: 4, // 13.3%
  d: 4, // 13.3%
  g: 4, // 12.9%
  p: 5, // 10.8%
  f: 5, // 10.6%
  c: 5, // 9.6%
  w: 6, // 6.2%
  z: 6, // 6.1%
  v: 8, // 2.6%
  j: 8, // 1.9%
  y: 8, // 1.8%
  x: 8, // 1.3%
  q: 10, // 0.4%
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
