import { describe, expect, it } from '@jest/globals';
import { DamageReduction, PowerStrike, SecondWind, Boomerang, AbilityParams } from '../src/ability';
import { Character } from '../src/character';

describe('Ability Classes', () => {
  it('DamageReduction halves damage', () => {
    const attacker = new Character('A');
    const defender = new Character('D', new DamageReduction());
    const params: AbilityParams = { attacker, defender, damage: 40 };
    const result = defender.ability.activate(params);
    expect(result.activated).toBe(true);
    expect(result.modifiedDmg).toBe(20);
  });

  it('PowerStrike increases attack by 50%', () => {
    const attacker = new Character('A', new PowerStrike());
    const defender = new Character('D');
    const params: AbilityParams = { attacker, defender, damage: 20 };
    const result = attacker.ability.activate(params);
    expect(result.activated).toBe(true);
    expect(result.modifiedDmg).toBe(30);
  });

  it('SecondWind triggers at <30 health', () => {
    const attacker = new Character('A');
    const defender = new Character('D', new SecondWind());
    defender.health = 29;
    const params: AbilityParams = { attacker, defender, damage: 2 };
    const result = defender.ability.activate(params);
    expect(result.activated).toBe(true);
    expect(result.healed).toBe(5);
  });

  it('Boomerang deals 70% of damage back', () => {
    const attacker = new Character('A');
    const defender = new Character('D', new Boomerang());
    const params: AbilityParams = { attacker, defender, damage: 10 };
    const result = defender.ability.activate(params);
    expect(result.activated).toBe(true);
    expect(result.reflectedDmg).toBe(7);
    expect(result.message).toContain('deals 7 back');
  });
});
