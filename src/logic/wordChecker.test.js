import React from "react";
import { getHorizontalWords, getVerticalWords, hasSoloTile, areWordsConnected } from "./wordChecker";

const mockLetters = {
  a: "A",
  b: "B",
  c: "C",
  d: "D"
}
const mockSoloTileEdgeCasesTrue = {
  bottom: [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    ["A", null, "A", null],
  ],
  top: [
    ["A", null, "A", null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ],
  left: [
    ["A", null, null, null],
    [null, null, null, "A"],
    [null, null, null, null],
    [null, null, null, null],
  ],
  right: [
    [null, null, null, "A"],
    [null, null, null, null],
    [null, null, null, "A"],
    [null, null, null, null],
  ]
}

const mockSoloTileEdgeCasesFalse = {
  bottom: [
    [null, null, null, null],
    [null, null, null, []],
    [["12321", "A"], null, null, []],
    [["12321", "A"], null, ["12321", "A"], ["12321", "A"]]
  ],
  top: [
    [["12321", "A"], null, ["12321", "A"], null],
    [["12321", "A"], null, ["12321", "A"], null],
    [null, null, null, []],
    [null, null, null, []]
  ],
  left: [
    [["12321", "A"], ["12321", "A"], null, null],
    [null, null, ["12321", "A"], ["12321", "A"]],
    [null, null, null, []],
    [null, null, null, []]
  ],
  right: [
    [null, null, ["12321", "A"], ["12321", "A"]],
    [null, null, null, []],
    [null, null, ["12321", "A"], ["12321", "A"]],
    [null, null, null, []]
  ]
}

test("hasSoloTile should return true on mockSoloTileEdgeCasesTrue", () => {
  Object.values(mockSoloTileEdgeCasesTrue).map((mock) => {
    const actual = hasSoloTile(mock);
    expect(actual).toEqual(true);
  });
});

test("hasSoloTile should return false on falsey test cases", () => {
  Object.values(mockSoloTileEdgeCasesFalse).map((mock) => {
    const actual = hasSoloTile(mock);
    expect(actual).toEqual(false);
  })
});

const mockHorizontalWords = [
  {
    expected: [],
    board: [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
  },
  {
    expected: ['AB'],
    board: [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [mockLetters.a, mockLetters.b, null, null]
    ]
  },
  {
    expected: ["AC", "DB"],
    board: [
      [mockLetters.a, mockLetters.c, null, null],
      [mockLetters.d, mockLetters.b, null, null],
      [null, null, null, []],
      [null, null, null, []]
    ]
  },
  {
    expected: ["AC", "DB"],
    board: [
      [mockLetters.a, mockLetters.c, null, null],
      [null, null, null, []],
      [null, null, null, []],
      [mockLetters.d, mockLetters.b, null, null],
    ]
  },
  {
    expected: ["AC", "DB"],
    board: [
      [null, null, mockLetters.a, mockLetters.c],
      [null, null, null, []],
      [null, null, null, []],
      [[], [], mockLetters.d, mockLetters.b],
    ]
  },
  {
    // acceptable vertical board, but should not 
    // return anything for horizontal search
    expected: [],
    board: [
      [null, null, null, null],
      [null, null, null, []],
      [mockLetters.b, null, null, []],
      [mockLetters.a, null, null, null]
    ]
  },
]

test("getHorizontalWords works", () => {
  mockHorizontalWords.forEach(({board, expected}) => {
    const value = getHorizontalWords(board);
    expect(value).toEqual(expected)
  })
})

const mockVerticalWords = [
  {
    expected: [],
    board: [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
  },
  {
    expected: ['BA'],
    board: [
      [null, null, null, null],
      [null, null, null, null],
      [mockLetters.b, null, null, null],
      [mockLetters.a, null, null, null]
    ]
  },
  {
    expected: ["AD", "CB"],
    board: [
      [mockLetters.a, mockLetters.c, null, null],
      [mockLetters.d, mockLetters.b, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
  },
  {
    expected: ["AD", "CB"],
    board: [
      [null, null, null, null],
      [null, null, null, null],
      [mockLetters.a, mockLetters.c, null, null],
      [mockLetters.d, mockLetters.b, null, null],
    ]
  },
  {
    expected: ["DA", "BC"],
    board: [
      [[], [], mockLetters.d, mockLetters.b],
      [null, null, mockLetters.a, mockLetters.c],
      [null, null, null, null],
      [null, null, null, null],
    ]
  },
  {
    // acceptable horizontal board, but should not return
    // anything for vertical search
    expected: [],
    board: [
      [null, null, mockLetters.a, mockLetters.c],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, mockLetters.d, mockLetters.b],
    ]
  },
];

test("getVerticalWords works", () => {
  mockVerticalWords.forEach(({board, expected}) => {
    const value = getVerticalWords(board);
    expect(value).toEqual(expected)
  })
})

const mockConnectedWords = [
  {
    expected: true,
    board: [
      [null, null, null, null],
      [null, null, mockLetters.a, mockLetters.c],
      [null, null, mockLetters.d, mockLetters.b],
      [null, null, null, null],
    ]
  },
  {
    expected: false,
    board: [
      [null, null, null, null],
      [null, null, mockLetters.d, mockLetters.b],
      [null, null, null, null],
      [null, null, mockLetters.a, mockLetters.c],
    ]
  },
  {
    expected: false,
    board: [
      [null, null, null, null],
      [null, null, mockLetters.d, mockLetters.b],
      [mockLetters.a, mockLetters.a, null, null],
      [null, null, mockLetters.a, mockLetters.c],
    ]
  },
  {
    expected: true,
    board: [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
  }
]

test("areWordsConnected works", () => {
  mockConnectedWords.forEach(({board, expected}) => {
    const value = areWordsConnected(board);
    expect(value).toEqual(expected)
  })
})