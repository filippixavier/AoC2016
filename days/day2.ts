type Direction = "U" | "D" | "L" | "R";

const KEYBOARD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

const START = [1, 1];

const DIRECTIONS: {
  [x in Direction]: number[];
} = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

function isDirection(elem: string): elem is Direction {
  return elem === "U" || elem === "D" || elem === "L" || elem === "R";
}

async function getInput(src: string): Promise<Direction[][]> {
  const input = await Deno.readTextFile(src);

  return input.trim()
    .split("\n")
    .map((line) => line.split("").filter(isDirection));
}

function star1(instructions: Direction[][]) {
  let code = "";
  let current = START;
  for (const line of instructions) {
    for (const direction of line) {
      const newPos = [
        current[0] + DIRECTIONS[direction][0],
        current[1] + DIRECTIONS[direction][1],
      ];

      if (newPos[0] < 0 || newPos[0] > 2 || newPos[1] < 0 || newPos[1] > 2) {
        continue;
      }
      current = newPos;
    }
    code += KEYBOARD[current[0]][current[1]];
  }

  console.log(`The bathroom code is: ${code}`);
}

export async function exec() {
  console.log("Day 2: Bathroom Security");

  const input = await getInput("./inputs/day2.txt");

  star1(input);
}
