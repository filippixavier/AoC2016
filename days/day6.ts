async function getInput(src: string): Promise<string[]> {
  const input = await Deno.readTextFile(src);

  return input.trim().split("\n").map((elem) => elem.trim());
}

function letterCounter(input: string[]): Record<string, number>[] {
  const msgCounter: Record<string, number>[] = [];
  for (const line of input) {
    for (let i = 0, len = line.length; i < len; i++) {
      if (!msgCounter[i]) {
        msgCounter[i] = {};
      }
      if (!msgCounter[i][line[i]]) {
        msgCounter[i][line[i]] = 0;
      }

      msgCounter[i][line[i]]++;
    }
  }
  
  return msgCounter;
}

function star1(msgCounter: Record<string, number>[]) {
  const msg = msgCounter.map((ch) => {
    return Object.entries(ch).reduce((acc, current) =>
      acc[1] < current[1] ? current : acc
    )[0];
  }).join("");
  console.log(`The error corrected version of the message is: ${msg}`);
}

function star2(msgCounter: Record<string, number>[]) {
  const msg = msgCounter.map((ch) => {
    return Object.entries(ch).reduce((acc, current) =>
      acc[1] > current[1] ? current : acc
    )[0];
  }).join("");
  console.log(`The error corrected version of the message using modified repetition is: ${msg}`);
}

export async function exec() {
  console.log("Day 6: Signals and Noise");

  const input = await getInput("./inputs/day6.txt");
  const counter = letterCounter(input);
  star1(counter);
  star2(counter);
}
