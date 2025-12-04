async function getInput(src: string): Promise<string> {
  const input = await Deno.readTextFile(src);

  return input.trim();
}

const REGOPERATION =
  /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/g;
const REGINITIALIZATION = /value (\d+) goes to bot (\d+)/g;

class Bot {
  initialized = false;
  done = false;
  values: number[] = [];

  constructor(valA: number) {
    this.values.push(valA);
  }

  add(valB: number) {
    this.values.push(valB);
    this.values.sort((a, b) => a - b);
    this.initialized = true;
  }

  gives(): [number, number] {
    this.done = true;
    return [this.values[0], this.values[1]];
  }
}

function star1(input: string, target: [number, number]): number[] {
  const bots: Bot[] = [];
  const output: number[] = [];

  for (const initBot of input.matchAll(REGINITIALIZATION)) {
    const id = parseInt(initBot[2], 10);
    const value = parseInt(initBot[1], 10);

    if (bots[id]) {
      bots[id].add(value);
    } else {
      bots[id] = new Bot(value);
    }
  }

  const ops = Array.from(input.matchAll(REGOPERATION));

  while (bots.some((elem) => !elem.done)) {
    let lockdown = false;
    for (const op of ops) {
      const id = parseInt(op[1], 10);
      const lowId = parseInt(op[3], 10);
      const highId = parseInt(op[5], 10);

      if (!bots[id] || !bots[id].initialized || bots[id].done) {
        continue;
      }

      lockdown = true;
      const [low, high] = bots[id].gives();

      if (high === target[0] && low === target[1]) {
        console.log(`Bot ${id} is responsible for comparing the targets chips`);
      }

      if (op[2] === "bot") {
        if (!bots[lowId]) {
          bots[lowId] = new Bot(low);
        } else {
          bots[lowId].add(low);
        }
      } else {
        output[lowId] = low;
      }

      if (op[4] === "bot") {
        if (!bots[highId]) {
          bots[highId] = new Bot(high);
        } else {
          bots[highId].add(high);
        }
      } else {
        output[highId] = high;
      }
    }

    if (!lockdown) {
      throw new Error("LOCKDOWN!");
    }
  }

  return output;
}

function star2(outputs: number[]) {
  console.log(
    `The values in the third three output mulitplied is: ${
      outputs[0] * outputs[1] * outputs[2]
    }`,
  );
}

export async function exec() {
  console.log("Day 10: Balance Bots");

  const input = await getInput("./inputs/day10.txt");
  star2(star1(input, [61, 17]));
}
