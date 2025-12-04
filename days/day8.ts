type Instruction = (screen: boolean[][]) => void;
type Screen = boolean[][];

const WIDTH = 50;
const HEIGHT = 6;

function rect(screen: Screen, width: number, height: number) {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      screen[i][j] = true;
    }
  }
}

function rotateRow(screen: Screen, row: number, offset: number) {
  screen[row] = [
    ...screen[row].slice(-offset),
    ...screen[row].slice(0, -offset),
  ];
}

function rotateColumn(screen: Screen, colNum: number, offset: number) {
  let col: boolean[] = [];
  for (const row of screen) {
    col.push(row[colNum]);
  }
  col = [...col.slice(-offset), ...col.slice(0, -offset)];
  for (let i = 0; i < HEIGHT; i++) {
    screen[i][colNum] = col[i];
  }
}

function displayScreen(screen: Screen) {
  for (const line of screen) {
    console.log(line.map((elem) => elem ? "#" : " ").join(""));
  }
  console.log("\n");
}

async function getInput(src: string): Promise<Instruction[]> {
  const input = await Deno.readTextFile(src);

  const rectReg = /rect (\d+)x(\d)/;
  const rotateReg = /rotate (row|column) [xy]=(\d+) by (\d+)/;

  return input.trim().split("\n").map((line) => {
    const rectMatch = line.match(rectReg);
    const rotate = line.match(rotateReg);

    if (rectMatch) {
      const width = parseInt(rectMatch[1], 10);
      const height = parseInt(rectMatch[2], 10);
      return (screen: Screen): void => {
        rect(screen, width, height);
      };
    } else {
      if (!rotate) {
        throw new Error("Line should be rect or rotate");
      }
      const val = parseInt(rotate[2], 10);
      const offset = parseInt(rotate[3], 10);

      return (screen: Screen): void => {
        rotate[1] === "row"
          ? rotateRow(screen, val, offset)
          : rotateColumn(screen, val, offset);
      };
    }
  });
}

function star1(instructions: Instruction[]): Screen {
  const screen: boolean[][] = [];

  for (let i = 0; i < HEIGHT; i++) {
    screen[i] = [];
    for (let j = 0; j < WIDTH; j++) {
      screen[i][j] = false;
    }
  }

  for (const ins of instructions) {
    ins(screen);
  }

  const lit = screen.flat(1).reduce((acc, elem) => acc + (+elem), 0);

  console.log(`There are ${lit} lit pixels on the screen`);

  return screen;
}

function star2(screen: Screen) {
  console.log("Screen attempt to display this:");
  displayScreen(screen);
}

export async function exec() {
  console.log("Day 8: Two-Factor Authentication");

  const input = await getInput("./inputs/day8.txt");

  star2(star1(input));
}
