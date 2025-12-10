import { md5 } from 'js-md5'; // found that one on reddit.

function hashStretching(input, round) {
  let result = input;
  for (let i = 0; i < round; i++) {
    // chatGPT pointed out that sync is faster, which is true... but not by a huge margin (~1ms)
    result = md5(result);
    //thanks chatGPT for pointing out the string generation is costly
  }
  return result;
}

function findKeys(input, round, start, end) {
  const hashes = [];

  for (let i = start; i < end; i++) {
    hashes.push(hashStretching(`${input}${i}`, round));
  }

  return hashes;
}

onmessage = (e) => {
    const results = findKeys(...e.data);
    postMessage(results);
}