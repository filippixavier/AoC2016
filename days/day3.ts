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

export async function exec() {
  console.log("Day 3: Squares With Three Sides");

  const input = await getInput("./inputs/day3.txt");

  star1(input);
}
