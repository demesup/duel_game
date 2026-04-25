import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Character } from '../src/character';
import { Boomerang } from '../src/ability';

jest.mock('../src/turn', () => ({
  applyTurn: jest.fn(),
}));

import { applyTurn } from '../src/turn';
import { runCombatLoop } from '../src/loop';

describe('Combat Loop', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('returns Draw when both fighters drop to zero in one turn', () => {
    const c1 = new Character('A');
    const c2 = new Character('B', new Boomerang());
    c1.health = 5;
    c2.health = 5;

    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    (applyTurn as jest.Mock).mockImplementation((attacker: Character, defender: Character) => {
      attacker.health = 0;
      defender.health = 0;
      return true;
    });

    const log: string[] = [];
    const winner = runCombatLoop(c1, c2, false, log, 0.25);

    expect(winner).toBe('Draw!');
    expect(log).toContain('\nRound 1:');
  });
});
