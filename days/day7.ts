async function getInput(src: string): Promise<string[]> {
  const input = await Deno.readTextFile(src);

  return input.trim().split("\n");
}

function star1(ips: string[]) {
  const invalidIps = /\[\w*(\w)(\w)\2\1\w*\]/;
  const abba = /(\w)(\w)\2\1/g;

  const counter = ips.filter((addr) => {
    const testInvalid = addr.match(invalidIps);
    if (!testInvalid || testInvalid[1] == testInvalid[2]) {
      const testValid = addr.matchAll(abba);
      return testValid.some((elem) => elem[1] !== elem[2]);
    }
    return false;
  }).length;

  console.log(`There are ${counter} ips that support TLS`);
}

function star2(ips: string[]) {
  const hypernetReg = /\[\w+\]/g;
  const counter = ips.filter((ip) => {
    const hypernets = ip.match(hypernetReg) || [];
    const nets = ip.split(hypernetReg);

    for (const net of nets) {
      // Cannot use regex because of overlapping
      for (let i = 0, len = net.length; i < len - 2; i++) {
        if (net[i] === net[i + 1] || net[i] !== net[i + 2]) {
          continue;
        }
        const bab = `${net[i + 1]}${net[i]}${net[i + 1]}`;

        for (const hypernet of hypernets) {
          if (hypernet.includes(bab)) {
            return true;
          }
        }
      }
    }

    return false;
  }).length;
  console.log(counter);
}

export async function exec() {
  console.log("Day 7: Internet Protocol Version 7");

  const input = await getInput("./inputs/day7.txt");

  star1(input);
  star2(input);
}
