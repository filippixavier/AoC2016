import language from './assets/en.json' with { type: 'json' };
import type { Day } from './days/days.ts';

const XMASTREE = './assets/xmastree.txt';

async function displayHeader() {
  const treeFile = await Deno.readTextFile(XMASTREE);
  console.log(treeFile);
  console.log(language.welcome);
}

async function repl() {
  while(true) {
    const input = prompt('>');
    if (input === 'quit' || input === 'exit') {
      return;
    }
    const day = parseInt(input || '', 10);
    if (day > 0 && day <= 25) {
      try {
        const dayModule: Day = await import(`./days/day${day}.ts`);
        await dayModule.exec();
      } catch (e: unknown) {
        console.error((e as Error).message);
      }
    }
  }
}

// Learn more at https://docs.dcode eno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await displayHeader()
  repl();
}
