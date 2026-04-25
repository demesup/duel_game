import { Character } from './character';
import { randomBool } from './utils';
import { applyTurn } from './turn';

function getWinner(c1: Character, c2: Character): string {
  if (c1.health <= 0 && c2.health <= 0) {
    return 'Draw!';
  }
  return c1.health <= 0 ? `${c2.name} won!` : `${c1.name} won!`;
}

export function runCombatLoop(
  c1: Character,
  c2: Character,
  perRndAbility: boolean,
  log: string[] | undefined,
  actChance: number
): string {
  let round = 1;
  let [attacker, defender] = randomBool() ? [c1, c2] : [c2, c1];

  while (c1.health > 0 && c2.health > 0) {
    log?.push(`\nRound ${round}:`);

    const finished = applyTurn(attacker, defender, perRndAbility, log, actChance);
    if (finished) {
      break;
    }

    [attacker, defender] = [defender, attacker];
    round++;
  }

  return getWinner(c1, c2);
}
