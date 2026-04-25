import { Character } from './character';
import { AbilityParams, AbilityResult } from './ability';
import { Phase } from './phase';

export const DEFAULT_ACT_CHANCE = 0.25;

export interface CombatContext {
  attacker: Character;
  defender: Character;
  actChance: number;
  lastAbilityMessage?: string;
}

export function createCombatContext(
  attacker: Character,
  defender: Character,
  actChance?: number
): CombatContext {
  return {
    attacker,
    defender,
    actChance: normalizeAbilityActivationChance(actChance),
  };
}

function tryActivate(
  actor: Character,
  phase: Phase,
  params: AbilityParams,
  actChance: number
): AbilityResult | undefined {
  if (actor.ability.actPhase !== phase || Math.random() >= actChance) {
    return undefined;
  }

  const result = actor.ability.activate(params);
  if (!result.activated) { // some abilities have internal checks, if failed => ability not activated
    return undefined;
  }

  return result;
}

function setAbilityMessage(context: CombatContext, result?: AbilityResult): void {
  if (result?.message) {
    context.lastAbilityMessage = result.message;
  }
}

function executeAbilityPhase(
  actor: Character,
  phase: Phase,
  damage: number,
  context: CombatContext
): AbilityResult | undefined {
  const params: AbilityParams = {
    attacker: context.attacker,
    defender: context.defender,
    damage,
  };
  const result = tryActivate(actor, phase, params, context.actChance);
  setAbilityMessage(context, result);
  return result;
}

export function clearAbilityMessage(context: CombatContext): string | undefined {
  const message = context.lastAbilityMessage;
  delete context.lastAbilityMessage;
  return message;
}

export function normalizeAbilityActivationChance(chance?: number): number {
  if (chance === undefined) {
    return DEFAULT_ACT_CHANCE;
  }

  if (!Number.isFinite(chance) || chance < 0 || chance > 1) {
    throw new Error(`Ability activation chance must be a number between 0 and 1. Received: ${chance}`);
  }

  return chance;
}

export const normalizeActChance = normalizeAbilityActivationChance;

export function applyAttack(baseAttack: number, context: CombatContext): number {
  const result = executeAbilityPhase(
    context.attacker,
    Phase.Attack,
    baseAttack,
    context
  );
  return result?.modifiedDmg ?? baseAttack;
}

export function applyDefense(baseDamage: number, context: CombatContext): number {
  const result = executeAbilityPhase(
    context.defender,
    Phase.Defense,
    baseDamage,
    context
  );
  return result?.modifiedDmg ?? baseDamage;
}

export function applyResolution(damage: number, context: CombatContext): void {
  const result = executeAbilityPhase(
    context.defender,
    Phase.Resolution,
    damage,
    context
  );
  if (result?.healed !== undefined) {
    context.defender.changeHealth(result.healed);
  }
  if (result?.reflectedDmg !== undefined) {
    context.attacker.changeHealth(-result.reflectedDmg);
  }
}
