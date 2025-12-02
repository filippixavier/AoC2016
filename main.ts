import language from './assets/en.json' with { type: "json" };

const XMASTREE = './assets/xmastree.txt';

async function displayHeader() {
  const treeFile = await Deno.readTextFile(XMASTREE);
  console.log(treeFile);
  console.log(language.welcome);
}

function repl() {
  while(true) {
    const input = prompt(">");
    switch(input) {
      case "quit":
      case "exit":
        return;
    }
  }
}

// Learn more at https://docs.dcode eno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await displayHeader()
  repl();
}
