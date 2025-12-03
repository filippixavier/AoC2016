import { crypto } from '@std/crypto';

async function getInput(src: string): Promise<string> {
  return await Deno.readTextFile(src);
}

async function star1(input: string) {
  let index = 0;
  let password = '';

  while (password.length < 8) {
    const encoder = new TextEncoder().encode(input + index);
    const buffer = await crypto.subtle.digest('MD5', encoder);
    // got that from https://stackoverflow.com/a/40031979
    const hash = [...new Uint8Array(buffer)].map((x) =>
      x.toString(16).padStart(2, '0')
    )
      .join('');
    if (hash.startsWith('00000')) {
      password += hash[5];
    }
    index++;
  }

  console.log(
    `After bruteforcing all md5 hash, the password found is: ${password}`,
  );
}

export async function exec() {
  console.log('Day 5: How About a Nice Game of Chess?');

  const input = await getInput('./inputs/day5.txt');
  await star1(input);
}
