type Direction = {
    isLeft: boolean,
    steps: number
};

async function getInput(src: string): Promise<Direction[]> {
    const input = await Deno.readTextFile(src);

    return input.trim()
        .split(', ')
        .map((elem) => ({
                isLeft: elem[0] === 'L',
                steps: parseInt(elem.slice(1), 10) || 0
            })
        );
}

const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function star1(input: Direction[]) {
    console.log('Star 1:');
    let pos = [0, 0];
    let facing = 0; 
    for(const {isLeft, steps} of input) {
        if(isLeft) {
            facing -= 1;
            if(facing < 0) {
                facing = 3;
            }
        } else {
            facing = (facing + 1 ) % 4;
        }
        pos = [pos[0] + DIRECTIONS[facing][0] * steps, pos[1] + DIRECTIONS[facing][1] * steps];
    }

    console.log(`We are ${Math.abs(pos[0]) + Math.abs(pos[1])} steps away from the Eastern HQ`);
}

function star2(input: Direction[]) {
        console.log('Star 2:');
    let pos = [0, 0];
    let facing = 0;
    const visited = new Set(pos.toString());
    outer: for(const {isLeft, steps} of input) {
        if(isLeft) {
            facing -= 1;
            if(facing < 0) {
                facing = 3;
            }
        } else {
            facing = (facing + 1 ) % 4;
        }
        for (let i = 0; i < steps; i++) {
            pos = [pos[0] + DIRECTIONS[facing][0], pos[1] + DIRECTIONS[facing][1]];
            if (visited.has(pos.toString())) {
                break outer;
            }
            visited.add(pos.toString());
        }
    }

    console.log(`We are ${Math.abs(pos[0]) + Math.abs(pos[1])} steps away from the first location visited twice: the True Eastern HQ`);
}

export async function exec() {
    console.log('Day 1: No Time for a Taxicab');

    const input = await getInput("./inputs/day1.txt");

    star1(input);
    star2(input);
}