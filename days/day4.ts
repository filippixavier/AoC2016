type RoomDescriptor = {
  name: string[];
  id: number;
  checksum: string;
};

async function getInput(src: string): Promise<RoomDescriptor[]> {
  const input = await Deno.readTextFile(src);

  const roomReg = /([a-zA-Z-]*?)-(\d+)\[(\w+)/g;

  return Array.from(
    input.matchAll(roomReg).map(([_, name, id, checksum]) => {
      return {
        name: name.split("-"),
        id: parseInt(id, 10),
        checksum,
      };
    }),
  );
}

function validateChecksum(descriptor: RoomDescriptor): boolean {
  const fullName = descriptor.name.join("");
  const counter: {
    [key: string]: number;
  } = {};

  for (const letter of fullName) {
    if (counter[letter]) {
      counter[letter]++;
    } else {
      counter[letter] = 1;
    }
  }

  const roomChecksum = Object.entries(counter).toSorted((
    [letterA, countA],
    [letterB, countB],
  ) =>
    countA === countB
      ? letterA.charCodeAt(0) - letterB.charCodeAt(0)
      : countB - countA
  ).reduce((acc, elem) => acc + elem[0], "").slice(0, 5);

  return roomChecksum === descriptor.checksum;
}

function star1(input: RoomDescriptor[]) {
  let total = 0;

  for (const room of input) {
    if (validateChecksum(room)) {
      total += room.id;
    }
  }

  console.log(`The sum ids of the real rooms is: ${total}`);
}

export async function exec() {
  console.log("Day 4: Security Through Obscurity");

  const input = await getInput("./inputs/day4.txt");

  star1(input);
}
