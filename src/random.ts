export const shuffleArray = <T>(list: T[]): T[] => {
  let currentIndex = list.length;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    const tmp = list[currentIndex];
    list[currentIndex] = list[randomIndex];
    list[randomIndex] = tmp;
  }

  return list;
};

export const getRandomElement = (list: string[]): string => {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
};
