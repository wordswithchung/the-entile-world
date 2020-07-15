export class LetterCalculator {
  allConsonants = {
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
  }

  easyConsonants = {
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
  }

  hardConsonants = {
    j: 2,
    k: 2,
    q: 2,
    v: 3,
    x: 2,
    z: 2
  }

  vowels = {
    a: 13,
    e: 18,
    i: 12,
    o: 11,
    u: 6,
  }

  /**
   * Logic: at least 25% of the tiles provided need to be vowels
   * Try to randomize as much as possible
   * @param {number} numberOfTiles
   * @returns {string[]} a list of letters; length matches number of tiles requested
   */
  getListOfLetters(numberOfTiles) {
    const numOfConsonants = this.getNumberOfConsonants(numberOfTiles);
    const numOfVowels = numberOfTiles - numOfConsonants;
    return [
      ...this.getLetters(numOfConsonants, {...this.allConsonants}), 
      ...this.getLetters(numOfVowels, {...this.vowels})
    ];
  }

  /**
   * 
   * @param {number} totalTiles 
   * @returns {number}
   */
  getNumberOfConsonants(totalTiles) {
    const maxPercentage = 75;
    const minPercentage = 65;
    const randomConsonantPercentage = Math.round(Math.random() * (maxPercentage - minPercentage) + minPercentage);
    return Math.floor(totalTiles * randomConsonantPercentage * 0.01);
  }

  /**
   * 
   * @param {number} numberOfTiles 
   * @param {object} letters 
   * @returns {string[]}
   */
  getLetters(numberOfTiles, letters) {
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

} 