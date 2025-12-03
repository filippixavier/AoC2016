import { crypto } from "@std/crypto";

async function getInput(src: string): Promise<string> {
  return await Deno.readTextFile(src);
}

async function computeHashes(input: string): Promise<string[]> {
  let index = 0;
  const memorizedHashed = [];
  const visited = new Set();

  while (memorizedHashed.length < 8 || visited.size < 8) {
    const encoder = new TextEncoder().encode(input + index);
    const buffer = await crypto.subtle.digest("MD5", encoder);
    // got that from https://stackoverflow.com/a/40031979
    const hash = [...new Uint8Array(buffer)].map((x) =>
      x.toString(16).padStart(2, "0")
    )
      .join("");
    if (hash.startsWith("00000")) {
      memorizedHashed.push(hash);
      const index = parseInt(hash[5], 10);
      if (index >= 0 && index < 8) {
        visited.add(index);
      }
    }
    index++;
  }
  return memorizedHashed;
}

function star1(hashes: string[]) {
  const password = hashes.slice(0, 8).map((elem) => elem[5]).join("");
  console.log(
    `After bruteforcing all md5 hash, the password found is: ${password}`,
  );
}

function star2(hashes: string[]) {
  const password: string[] = [];
  for (const hash of hashes) {
    const index = parseInt(hash[5], 10);
    if (index >= 0 && index < 8 && !password[index]) {
      password[index] = '' + hash[6];
    }
  }
  console.log(
    `Using the "better solution", the password is: ${password.join("")}`,
  );
}

export async function exec() {
  console.log("Day 5: How About a Nice Game of Chess?");

  const input = await getInput("./inputs/day5.txt");
  const hashes = await computeHashes(input);
  star1(hashes);
  star2(hashes);
}
