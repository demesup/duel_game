import { runDuel } from './duel';

const args = process.argv.slice(2);
const perRound = args.includes('--per-round');
const simulate = args.includes('--simulate');

function parseAbilityChance(argv: string[]): number | undefined {
  
  const parseValue = (raw: string): number => {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
      throw new Error(`Invalid --ability-chance value: ${raw}. Expected a number between 0 and 1.`);
    }
    return parsed;
  };

  const withEquals = argv.find((arg) => arg.startsWith('--ability-chance='));
  if (withEquals) {
    return parseValue(withEquals.slice('--ability-chance='.length));
  }

  const chanceFlagIdx = argv.indexOf('--ability-chance');
  if (chanceFlagIdx >= 0) {
    const rawValue = argv[chanceFlagIdx + 1];
    if (rawValue === undefined) {
      throw new Error('Missing value for --ability-chance. Example: --ability-chance 0.4');
    }
    return parseValue(rawValue);
  }

  return undefined;
}

let actChance: number | undefined;
try {
  actChance = parseAbilityChance(args);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const duelOptions = {
  perRndAbility: perRound,
  collectLog: !simulate,
  ...(actChance !== undefined ? { actChance } : {}),
};

if (simulate) {
  const winsByCharacter = new Map<string, number>();
  let draws = 0;

  for (let i = 0; i < 1000; i++) {
    const res = runDuel(duelOptions);
    if (res.winner === 'Draw!') {
      draws++;
      continue;
    }

    if (res.winner.endsWith(' won!')) {
      const winnerName = res.winner.slice(0, -' won!'.length);
      const currentWins = winsByCharacter.get(winnerName) ?? 0;
      winsByCharacter.set(winnerName, currentWins + 1);
    }
  }
  
  console.log(`\nAfter 1000 duels:`);
  for (const [name, wins] of winsByCharacter) {
    console.log(`${name} wins: ${wins}`);
  }
  console.log(`Draws: ${draws}`);
} else {
  const res = runDuel(duelOptions);
  
  for (const line of res.log) {
    console.log(line);
  }
}
