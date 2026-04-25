import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { applyAttack, applyDefense, applyResolution, clearAbilityMessage, createCombatContext, normalizeAbilityActivationChance } from '../src/game';
import { Character } from '../src/character';
import { DamageReduction, PowerStrike, SecondWind, Boomerang } from '../src/ability';
import { applyTurn } from '../src/turn';

describe('Game Mechanics', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a shared combat context', () => {
    const attacker = new Character('A');
    const defender = new Character('D');
    const context = createCombatContext(attacker, defender, 0.5);

    expect(context.attacker).toBe(attacker);
    expect(context.defender).toBe(defender);
    expect(context.actChance).toBe(0.5);
    expect(context.lastAbilityMessage).toBeUndefined();
  });

  it('uses the default activation chance when omitted', () => {
    const attacker = new Character('A');
    const defender = new Character('D');
    const context = createCombatContext(attacker, defender);

    expect(context.actChance).toBe(0.25);
  });

  it('applyAttack applies ability logic', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const attacker = new Character('A', new PowerStrike());
    const defender = new Character('D');
    const context = createCombatContext(attacker, defender);
    const result = applyAttack(20, context);

    expect(result).toBe(30);
    expect(context.lastAbilityMessage).toContain('Power Strike');
  });

  it('clears the last ability message after reading it', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const attacker = new Character('A', new PowerStrike());
    const defender = new Character('D');
    const context = createCombatContext(attacker, defender);

    applyAttack(20, context);
    expect(clearAbilityMessage(context)).toContain('Power Strike');
    expect(clearAbilityMessage(context)).toBeUndefined();
  });

  it('applyDefense applies ability logic', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const attacker = new Character('A');
    const defender = new Character('D', new DamageReduction());
    const context = createCombatContext(attacker, defender);
    const result = applyDefense(40, context);

    expect(result).toBe(20);
    expect(context.lastAbilityMessage).toContain('Damage Reduction');
  });

  it('treats attack equal to defense as zero damage', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);

    const attacker = new Character('A');
    const defender = new Character('D');
    attacker.attack = 18;
    defender.defense = 18;
    const log: string[] = [];

    const finished = applyTurn(attacker, defender, false, log, 0.25);

    expect(finished).toBe(false);
    expect(defender.health).toBe(100);
    expect(attacker.health).toBe(100);
    expect(log).toContain('No ability activated');
  });

  it('applyResolution applies healing and boomerang', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const attacker = new Character('A');
    const defender = new Character('D', new SecondWind());
    defender.health = 29;
    const context = createCombatContext(attacker, defender);
    applyResolution(2, context);
    expect(defender.health).toBe(34);

    // Boomerang does not heal, but should activate
    defender.ability = new Boomerang();
    defender.health = 50;
    attacker.health = 5;
    const context2 = createCombatContext(attacker, defender);
    applyResolution(10, context2);
    expect(defender.health).toBe(50);
    expect(attacker.health).toBe(0);
    expect(context2.lastAbilityMessage).toContain('Boomerang');
  });

  it('can configure ability activation chance per call', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const attacker = new Character('A', new PowerStrike());
    const defender = new Character('D');
    const context = createCombatContext(attacker, defender, 0.75);
    const result = applyAttack(20, context);

    expect(result).toBe(30);

    const context2 = createCombatContext(attacker, defender, 0.25);
    const result2 = applyAttack(20, context2);
    expect(result2).toBe(20);
  });

  it('normalizes and validates activation chance', () => {
    expect(normalizeAbilityActivationChance()).toBe(0.25);
    expect(normalizeAbilityActivationChance(0)).toBe(0);
    expect(normalizeAbilityActivationChance(1)).toBe(1);
    expect(() => normalizeAbilityActivationChance(-0.1)).toThrow();
    expect(() => normalizeAbilityActivationChance(1.1)).toThrow();
    expect(() => normalizeAbilityActivationChance(Number.NaN)).toThrow();
  });
});
