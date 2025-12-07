import { crypto } from "@std/crypto";

async function getInput(src: string): Promise<string> {
  const input = await Deno.readTextFile(src);

  return input.trim();
}

async function star1(input: string) {
  type Candidate = {
    index: number,
    reg: RegExp;
    countdown: number;
  };

  const candidateReg = /(\w)\1\1/;

  let candidates: Candidate[] = [];
  let validCandidate = 0;
  let lastCandidateIndex = 0;

  for (let i = 0;; i++) {
    const encoder = new TextEncoder().encode(`${input}${i}`);
    const buffer = await crypto.subtle.digest("MD5", encoder);
    // see day5.ts
    const hash = [...new Uint8Array(buffer)].map((x) =>
      x.toString(16).padStart(2, "0")
    )
      .join("");
    candidates = candidates.filter((candidate) => {
      if (candidate.reg.test(hash)) {
        validCandidate++;
        lastCandidateIndex = candidate.index;
        candidate.countdown = 0;
      }
      candidate.countdown--;
      return candidate.countdown > 0;
    });
    if (validCandidate === 64) {
      console.log(`The 64th valid one-time pad key happens on index ${lastCandidateIndex}`);
      break;
    }
    const isCandidate = hash.match(candidateReg);
    if (isCandidate) {
      candidates.push({
        reg: new RegExp(
          `${isCandidate[1]}${isCandidate[1]}${isCandidate[1]}${
            isCandidate[1]
          }${isCandidate[1]}`
        ),
        countdown: 999,
        index: i
      });
    }
  }
}
// 19672 too low

export async function exec() {
  console.log("Day 14: One-Time Pad");

  const input = await getInput("./inputs/day14.txt");
  await star1(input);
}
