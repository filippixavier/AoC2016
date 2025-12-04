async function getInput(src: string): Promise<string> {
    const input = await Deno.readTextFile(src);
    return input.trim();
}

function star1(input: string) {
    let fullText = '';
    let substr = input;
    const dataReg = /\((\d+)x(\d+)\)/;
    while(substr.length > 0) {
        const nextExpand = substr.indexOf('(');
        if (nextExpand === -1) {
            fullText += substr;
            break;
        }
        fullText += substr.substring(0, nextExpand);
        substr = substr.substring(nextExpand);
        
        const endExpand = substr.indexOf(')');
        const expansionData = substr.substring(0, endExpand + 1);
        
        substr = substr.substring(endExpand + 1);
        
        const [_, span, amount] = expansionData.match(dataReg)?.map(elem => parseInt(elem, 10)) || [0, 0, 0];

        const repeatedData = substr.substring(0, span);
        substr = substr.substring(span);

        for(let i = 0; i < amount; i++) {
            fullText += repeatedData;
        }
    }

    console.log(`The full decompressed text length is: ${fullText.length}`);
}

export async function exec() {
    console.log('Day 9: Explosives in Cyberspace');
    const input = await getInput("./inputs/day9.txt");
    star1(input);
}