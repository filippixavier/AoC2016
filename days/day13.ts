async function getInput(src: string): Promise<number> {
  const input = await Deno.readTextFile(src);
  return parseInt(input, 10) || 0;
}

type TargetsTuple = [number, number];
const TARGET: TargetsTuple = [31, 39] as const;

function getTileStatus(
  [x, y]: [number, number],
  designerNumber: number,
  memo: Record<string, boolean>,
): boolean {
  const key = `${x},${y}`;

  if (typeof memo[key] !== "undefined") {
    return memo[key];
  }

  const magicValue = x * x + 3 * x + 2 * x * y + y + y * y + designerNumber;
  const tileValue =
    magicValue.toString(2).split("").filter((bit) => bit === "1").length %
        2 === 0;
  memo[key] = tileValue;
  return tileValue;
}

const NEIGHBORS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function star1(designerNumber: number, [targetX, targetY]: TargetsTuple) {
  const officeMap: Record<string, boolean> = {};
  const visited: Set<string> = new Set("1,1");
  let toVisit: TargetsTuple[] = [[1, 1]];
  let steps = 0;

  while (toVisit) {
    const nextVisit: TargetsTuple[] = [];

    for (const [x, y] of toVisit) {
      if (x === targetX && y === targetY) {
        console.log(`You can reach the target with at lease ${steps} steps`);
        return;
      }

      for (
        const neighbor of NEIGHBORS.map(
          (n) => [n[0] + x, n[1] + y] as TargetsTuple,
        ).filter((elem) =>
          elem[0] >= 0 && elem[1] >= 0 &&
          getTileStatus(elem, designerNumber, officeMap) &&
          !visited.has(elem.toString())
        )
      ) {
        visited.add(neighbor.toString());
        nextVisit.push(neighbor);
      }
    }

    toVisit = nextVisit;
    steps++;
  }
}

function star2(designerNumber: number) {
  const officeMap: Record<string, boolean> = {};
  const visited: Set<string> = new Set("1,1");
  let toVisit: TargetsTuple[] = [[1, 1]];

  for (let i = 0; i < 50; i++) {
    const nextVisit: TargetsTuple[] = [];
    for (const [x, y] of toVisit) {
      for (
        const neighbor of NEIGHBORS.map(
          (n) => [n[0] + x, n[1] + y] as TargetsTuple,
        ).filter((elem) =>
          elem[0] >= 0 && elem[1] >= 0 &&
          getTileStatus(elem, designerNumber, officeMap) &&
          !visited.has(elem.toString())
        )
      ) {
        visited.add(neighbor.toString());
        nextVisit.push(neighbor);
      }
    }
    toVisit = nextVisit;
  }

  console.log(
    `You can reach ${
      Object.entries(officeMap).filter(([_, v]) => v).length
    } different locations with at most 50 steps`,
  );
}

export async function exec() {
  console.log("Day 13: Maze of Twisty Little Cubicles");

  const input = await getInput("./inputs/day13.txt");
  star1(input, TARGET);
  star2(input);
}
