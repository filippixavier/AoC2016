async function getInput(src: string): Promise<string[][]> {
  const input = await Deno.readTextFile(src);

  const generatorReg = /(\w\w)\w+ generator/g;
  const microchipReg = /(\w\w)\w+-compatible microchip/g;

  return input.trim().split("\n").map((line) => {
    const floor = [];
    for (const microchip of line.matchAll(microchipReg)) {
      floor.push(`${microchip[1].toUpperCase()}M`);
    }
    for (const generator of line.matchAll(generatorReg)) {
      floor.push(`${generator[1].toUpperCase()}G`);
    }
    return floor;
  });
}

function isFried(floor: string[]): boolean {
  if (floor.length <= 1) {
    return false;
  }
  const [microchip, generator] = [
    floor.filter((elem) => elem.endsWith("M")),
    floor.filter((elem) => elem.endsWith("G")),
  ];

  if (!generator.length || !microchip.length) {
    return false;
  }

  return !microchip.every((elem) => {
    return generator.indexOf(`${elem.substring(0, 2)}G`) !== -1;
  });
}

function getTuple<T>(array: T[]): T[][] {
  const result = [];
  for (let i = 0, len = array.length; i < len; i++) {
    result.push([array[i]]);
    for (let j = i + 1; j < len; j++) {
      result.push([array[i], array[j]]);
    }
  }
  return result;
}

function star1(input: string[][]) {
  type State = {
    floors: string[][];
    current: number;
  };

  let states: State[] = [{
    floors: input,
    current: 0,
  }];

  const visited: Set<string> = new Set();

  let steps = 0;

  while (states.length) {
    const nextState: State[] = [];
    for (const state of states) {
      const stateSignature = state.current + ":" +
        state.floors.map((elem) => elem.toSorted().join(".")).toString();
      if (visited.has(stateSignature)) {
        continue;
      }

      visited.add(stateSignature);

      if (state.floors.slice(0, 3).every((elem) => !elem.length)) {
        console.log(`Moving every component to the 4th floor require ${steps} steps`);
        return;
      }
      for (const tuple of getTuple(state.floors[state.current])) {
        const remaining = state.floors[state.current].filter((elem) =>
          !tuple.includes(elem)
        );

        if (isFried(tuple) || isFried(remaining)) {
          continue;
        }

        for(const nextFloor of [state.current - 1, state.current + 1].filter(fl => fl >= 0 && fl <= 3)){
          const floorCheck = state.floors[nextFloor].concat(tuple);
          if (isFried(floorCheck)) {
            continue;
          }
          const newFloor = state.floors.slice();
          newFloor[state.current] = remaining;
          newFloor[nextFloor] = floorCheck;
          nextState.push({
            floors: newFloor,
            current: nextFloor,
          });
        }
      }
    }

    states = nextState;
    steps++;
  }
}

export async function exec() {
  console.log("Day 11: Radioisotope Thermoelectric Generators");
  const input = await getInput("./inputs/day11.txt");

  star1(input);
}
