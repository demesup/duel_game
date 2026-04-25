import { Character } from './character';
import { runCombatLoop } from './loop';
import { normalizeActChance } from './game';

export interface DuelOptions {
  perRndAbility?: boolean;
  actChance?: number;
  collectLog?: boolean;
}

export interface DuelResult {
  winner: string;
  log: string[];
}

export function runDuel(options: DuelOptions = {}): DuelResult {
  const { perRndAbility = false, actChance, collectLog = true } = options;
  const activationChance = normalizeActChance(actChance);

  const c1 = new Character('Sasha');
  const c2 = new Character('Masha');

  const log: string[] = [];

  if (collectLog) {
    log.push(`${c1.name}: attack = ${c1.attack}, defense = ${c1.defense}`);
    log.push(`${c2.name}: attack = ${c2.attack}, defense = ${c2.defense}`);
  }

  const winner = runCombatLoop(c1, c2, perRndAbility, collectLog ? log : undefined, activationChance);

  if (collectLog) {
    log.push(winner);
  }

  return { winner, log };
}
