type Registers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

type RegName = keyof Registers;

type Operation = (
  registers: Registers,
  line: number,
) => number;

async function getInput(src: string): Promise<string[]> {
  const input = await Deno.readTextFile(src);

  return input.trim().split("\n");
}

function isRegName(name: string): name is RegName {
  return name === "a" || name === "b" || name === "c" || name === "d";
}

function toOperations(input: string[]): Operation[] {
  return input.map((line) => {
    const words = line.split(/\s/);
    switch (words[0]) {
      case "cpy":
        return (reg: Registers, lineNo: number) => {
          const valA = words[1];
          const regB = words[2];
          if (isRegName(regB)) {
            if (!isRegName(valA)) {
              reg[regB] = parseInt(valA, 10);
            } else {
              reg[regB] = reg[valA];
            }
          } else {
            throw new Error("unreachable");
          }
          return lineNo + 1;
        };
      case "inc":
        return (reg: Registers, lineNo: number): number => {
          const regA = words[1];
          if (isRegName(regA)) {
            reg[regA]++;
          } else {
            throw new Error("unreachable");
          }
          return lineNo + 1;
        };
      case "dec":
        return (reg: Registers, lineNo: number): number => {
          const regA = words[1];
          if (isRegName(regA)) {
            reg[regA]--;
          } else {
            throw new Error("unreachable");
          }
          return lineNo + 1;
        };
      case "jnz":
        return (reg: Registers, lineNo: number): number => {
          const regA = words[1];
          const valA = parseInt(regA, 10);
          const value = parseInt(words[2], 10);
          if (Number.isNaN(value) || !isRegName(regA) && Number.isNaN(valA)) {
            throw new Error("unreachable");
          }
          if (isRegName(regA) && reg[regA] || !Number.isNaN(valA) && valA) {
            return lineNo + value;
          }
          return lineNo + 1;
        };
      default:
        throw new Error("unreachable");
    }
  });
}

function star1(input: string[]) {
  const registers: Registers = { a: 0, b: 0, c: 0, d: 0 };
  let line = 0;

  const operations = toOperations(input);

  while (line < input.length) {
    line = operations[line](registers, line);
  }

  console.log(registers['a']);
}

export async function exec() {
  console.log("Day 12: Leonardo's Monorail");
  const input = await getInput("./inputs/day12.txt");

  star1(input);
}
