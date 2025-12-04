async function getInput(src: string): Promise<string> {
  const input = await Deno.readTextFile(src);
  return input.trim();
}

function star1(input: string) {
  let fullText = "";
  let substr = input;
  const dataReg = /\((\d+)x(\d+)\)/;
  while (substr.length > 0) {
    const nextExpand = substr.indexOf("(");
    if (nextExpand === -1) {
      fullText += substr;
      break;
    }
    fullText += substr.substring(0, nextExpand);
    substr = substr.substring(nextExpand);

    const endExpand = substr.indexOf(")");
    const expansionData = substr.substring(0, endExpand + 1);

    substr = substr.substring(endExpand + 1);

    const [_, span, amount] = expansionData.match(dataReg)?.map((elem) =>
      parseInt(elem, 10)
    ) || [0, 0, 0];

    const repeatedData = substr.substring(0, span);
    substr = substr.substring(span);

    for (let i = 0; i < amount; i++) {
      fullText += repeatedData;
    }
  }

  console.log(`The decompressed text length is: ${fullText.length}`);
}

function getExpandedLength(
  input: string,
  span: number,
  amount: number,
): number {
  const dataReg = /\((\d+)x(\d+)\)/;

  const dataToExpand = input.substring(0, span);

  const [startExpand, endExpand] = [
    dataToExpand.indexOf("("),
    dataToExpand.indexOf(")"),
  ];

  if (startExpand !== -1) {
    const beforeExpand = input.substring(0, startExpand);
    const subExpandData = input.substring(startExpand, endExpand + 1);
    const postExpand = input.substring(endExpand + 1);

    const [_, subSpan, subAmount] = subExpandData.match(dataReg)?.map((elem) =>
      parseInt(elem, 10)
    ) || [0, 0, 0];

    const unexpanded = postExpand.substring(subSpan);

    return getExpandedLength(beforeExpand, beforeExpand.length, amount) +
      getExpandedLength(postExpand.substring(0, subSpan), subSpan, subAmount) *
        amount +
      getExpandedLength(unexpanded, unexpanded.length, amount);
  } else {
    return span * amount;
  }
}

function star2(input: string) {
  const dataReg = /\((\d+)x(\d+)\)/;

  let length = 0;
  let substr = input;

  while (substr.length > 0) {
    const nextExpand = substr.indexOf("(");
    if (nextExpand === -1) {
      length += substr.length;
      break;
    }
    length += substr.substring(0, nextExpand).length;
    const endExpand = substr.indexOf(")");

    const expansionData = substr.substring(nextExpand, endExpand + 1);
    substr = substr.substring(endExpand + 1);

    const [_, span, amount] = expansionData.match(dataReg)?.map((elem) =>
      parseInt(elem, 10)
    ) || [0, 0, 0];

    length += getExpandedLength(substr.substring(0, span), span, amount);
    substr = substr.substring(span);
  }

  console.log(`The *fully* decompressed text length is ${length}`);
}

export async function exec() {
  console.log("Day 9: Explosives in Cyberspace");
  const input = await getInput("./inputs/day9.txt");
  star1(input);
  star2(input);
}
