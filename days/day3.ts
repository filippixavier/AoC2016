async function getInput(src: string): Promise<number[][]> {
  const file = await Deno.readTextFile(src);

  return file.trim()
    .split("\n")
    .map((line) =>
      line.trim().split(/\s+/).map((num) => parseInt(num.trim(), 10))
    );
}

function star1(input: number[][]) {
  let trueTriangle = 0;

  for (const [a, b, c] of input) {
    if (a + b > c && a + c > b && b + c > a) {
      trueTriangle++;
    }
  }

  console.log(`There are ${trueTriangle} possible triangles in the room`);
}

function verticalFlatten(input: number[][]): number[] {
  const flat = [];

  for (let i = 0; i < 3; i++) {
    for (const line of input) {
      flat.push(line[i]);
    }
  }

  return flat;
}

function star2(input: number[][]) {
  let trueTriangle = 0;

  const flatten = verticalFlatten(input);

  for (let i = 0, len = flatten.length; i < len; i += 3) {
    const [a, b, c] = [flatten[i], flatten[i + 1], flatten[i + 2]];

    if (a + b > c && a + c > b && b + c > a) {
      trueTriangle++;
    }
  }

  console.log(
    `Counting vertically, there are ${trueTriangle} possible triangles in the room`,
  );
}

export async function exec() {
  console.log("Day 3: Squares With Three Sides");

  const input = await getInput("./inputs/day3.txt");

  star1(input);
  star2(input);
}
