
/**
 * Logic: at least 25% of the tiles provided need to be vowels
 * Try to randomize as much as possible
 * @param {number} numberOfTiles
 * @param {number} gameLevel:
 * - 0 is default
 * - 1 is easy
 * - 2 is medium
 * - 3 is hard
 * @returns {string[]} a list of letters; length matches number of tiles requested
 */
export function getListOfLetters(numberOfTiles, gameLevel = 0) {
  const numOfConsonants = getNumberOfConsonants(numberOfTiles);
  const numOfVowels = numberOfTiles - numOfConsonants;
  if (gameLevel === 1) {
    // easy game
    return [
      ...getLetters(numOfConsonants * .3, {...ALL_LETTERS.allConsonants}), 
      ...getLetters(numOfConsonants * .7, {...ALL_LETTERS.easyConsonants}), 
      ...getLetters(numOfVowels, {...ALL_LETTERS.vowels})
    ];  
  } else if (gameLevel === 3) {
    // hard tame
    return [
      ...getLetters(numOfConsonants * .7, {...ALL_LETTERS.allConsonants}), 
      ...getLetters(numOfConsonants * .3, {...ALL_LETTERS.hardConsonants}), 
      ...getLetters(numOfVowels, {...ALL_LETTERS.vowels})
    ];  
  }
  return [
    ...getLetters(numOfConsonants, {...ALL_LETTERS.allConsonants}), 
    ...getLetters(numOfVowels, {...ALL_LETTERS.vowels})
  ];
}

export function getNumberOfConsonants(totalTiles) {
  const maxPercentage = 75;
  const minPercentage = 55;
  const randomConsonantPercentage = Math.round(Math.random() * (maxPercentage - minPercentage) + minPercentage);
  return Math.floor(totalTiles * randomConsonantPercentage * 0.01);
}

export function getLetters(numberOfTiles, letters) {
  const finalLetters = [];
  const keys = Object.keys(letters);
  for (let i = 0; i < numberOfTiles; i++) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    if (letters[randomKey] > 0) {
      letters[randomKey] = letters[randomKey] - 1;
      finalLetters.push(randomKey.toUpperCase());
    }
  }
  return finalLetters;
}


const ALL_LETTERS = {
  allConsonants: {
    b: 3,
    c: 3,
    d: 6,
    f: 3,
    g: 4,
    h: 3,
    j: 2,
    k: 2,
    l: 5,
    m: 3,
    n: 8,
    p: 3,
    q: 2,
    r: 9,
    s: 6,
    t: 9,
    v: 3,
    w: 3,
    x: 2,
    y: 3,
    z: 2
  },
  easyConsonants: {
    b: 3,
    c: 3,
    d: 6,
    f: 3,
    g: 4,
    h: 3,
    l: 5,
    m: 3,
    n: 8,
    p: 3,
    r: 9,
    s: 6,
    t: 9,
    w: 3,
    y: 3,
  },
  hardConsonants: {
    j: 2,
    k: 2,
    q: 2,
    v: 3,
    x: 2,
    z: 2
  },
  vowels: {
    a: 13,
    e: 18,
    i: 12,
    o: 11,
    u: 6,
  }
};