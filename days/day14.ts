import { md5 } from "js-md5"; // Got this one from a reddit's megathread solution, is *much* faster than the jsr one or the node's one.

async function getInput(src: string): Promise<string> {
  const input = await Deno.readTextFile(src);

  return input.trim();
}

function hashStretching(input: string, round: number): string {
  let result = input;
  for (let i = 0; i < round; i++) {
    // chatGPT pointed out that sync is faster, which is true... but not by a huge margin (~1ms)
    result = md5(result);
    //thanks chatGPT for pointing out the string generation is costly
  }
  return result;
}

// I tried to use string instead of regexp for perf, but there were no noticable gains on Deno.
type Candidate = {
  index: number;
  reg: RegExp;
  countdown: number;
  value?: string;
};

const CANDIDATEREG = /(\w)\1\1/;

function findKeys(input: string, round: number) {
  let candidates: Candidate[] = [];
  const validCandidates: number[] = [];

  for (let i = 0;; i++) {
    const hash = hashStretching(`${input}${i}`, round);
    candidates = candidates.filter((candidate) => {
      if (candidate.reg.test(hash)) {
        validCandidates.push(candidate.index);
        candidate.countdown = 0;
      }
      candidate.countdown--;
      return candidate.countdown > 0;
    });
    if (validCandidates.length >= 64) {
      return validCandidates.toSorted((a, b) => a - b)[63];
    }
    const isCandidate = hash.match(CANDIDATEREG);
    if (isCandidate) {
      candidates.push({
        reg: new RegExp(
          `${isCandidate[1]}{5}`,
        ),
        countdown: 999,
        index: i,
      });
    }
  }
}

function star1(input: string) {
  const result = findKeys(input, 1);
  console.log(
    `The 64th valid one-time pad key happens on index ${result}`,
  );
}

function callWorker(
  worker: Worker,
  input: string,
  rounds: number,
  start: number,
  end: number,
): Promise<string[]> {
  return new Promise((resolve) => {
    worker.onmessage = (e: MessageEvent<string[]>) => {
      resolve(e.data);
    };
    worker.postMessage([input, rounds, start, end]);
  });
}

function createWorker(): Worker {
  return new Worker(new URL("day14-worker.js", import.meta.url), {
    type: "module",
  });
}

async function star2(input: string) {
  const steps = 1_000;

  const workers = [
    createWorker(),
    createWorker(),
    createWorker(),
    createWorker(),
    createWorker(),
  ];

  const workerSteps = steps / workers.length;

  let allHashes: string[] = [];

  let candidates: Candidate[] = [];

  const validCandidates: number[] = [];

  outer: for (let i = 0;; i += steps) {
    const subResults = await Promise.all(
      workers.map((worker, j) =>
        callWorker(
          worker,
          input,
          2017,
          i + j * workerSteps,
          i + (j + 1) * workerSteps,
        )
      ),
    );
    allHashes = subResults.flat();
    for (let j = 0; j < steps; j++) {
      const hash = allHashes[j];
      candidates = candidates.filter((candidate) => {
        if (candidate.reg.test(hash)) {
          validCandidates.push(candidate.index);
          candidate.countdown = 0;
        }
        candidate.countdown--;
        return candidate.countdown > 0;
      });
      if (validCandidates.length >= 64) {
        break outer;
      }
      const isCandidate = hash.match(CANDIDATEREG);
      if (isCandidate) {
        candidates.push({
          reg: new RegExp(
            `${isCandidate[1]}{5}`,
          ),
          countdown: 999,
          index: i + j,
          value: hash,
        });
      }
    }
  }

  workers.forEach((worker) => worker.terminate());

  console.log(
    `After expanding the initial hash 2016 times, the 64th valid one-time pad key happens on index ${
      validCandidates.toSorted((a, b) => a - b)[63]
    }`,
  );
}

export async function exec() {
  console.log("Day 14: One-Time Pad");

  const input = await getInput("./inputs/day14.txt");
  star1(input);
  // 11ms to 13ms with workers
  // 41ms to 48ms (same as the js solution I got from reddit)
  await star2(input);
}

