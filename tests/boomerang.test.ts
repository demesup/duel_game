import { describe, expect, it } from '@jest/globals';
import { Character } from '../src/character';
import { AbilityParams, Boomerang } from '../src/ability';

describe('Boomerang Ability', () => {
  it('should activate and deal 70% of damage back to attacker', () => {
    const attacker = new Character('Attacker');
    const defender = new Character('Defender', new Boomerang());
    const params: AbilityParams = {
      attacker,
      defender,
      damage: 20
    };
    const result = defender.ability.activate(params);
    expect(result.activated).toBe(true);
    expect(result.reflectedDmg).toBe(14);
    expect(result.message).toContain('deals 14 back');
  });

  it('should not activate when damage is 0', () => {
    const attacker = new Character('Attacker');
    const defender = new Character('Defender', new Boomerang());
    const params: AbilityParams = {
      attacker,
      defender,
      damage: 0
    };
    const result = defender.ability.activate(params);
    expect(result.activated).toBe(false);
  });
});
