import { Character } from './character';
import { CombatContext, applyAttack, applyDefense, applyResolution, clearAbilityMessage, createCombatContext } from './game';

function flushAbilityMessage(context: CombatContext, log?: string[]): boolean {
  const message = clearAbilityMessage(context);
  if (!message) {
    return false;
  }

  log?.push(message);
  return true;
}

export function applyTurn(
  attacker: Character,
  defender: Character,
  perRndAbility: boolean,
  log: string[] | undefined,
  actChance?: number
): boolean {
  if (perRndAbility) {
    attacker.assignRandomAbility();
    defender.assignRandomAbility();
  }

  log?.push(`${attacker.name} attacks with ${attacker.attack}, ${defender.name} shields ${defender.defense}`);

  let abilityActivated = false;
  const context = createCombatContext(attacker, defender, actChance);
  const attack = applyAttack(attacker.attack, context);
  abilityActivated = flushAbilityMessage(context, log) || abilityActivated;

  let damage = Math.max(attack - defender.defense, 0);
  damage = applyDefense(damage, context);
  abilityActivated = flushAbilityMessage(context, log) || abilityActivated;

  defender.changeHealth(-damage);
  applyResolution(damage, context);
  abilityActivated = flushAbilityMessage(context, log) || abilityActivated;

  if (!abilityActivated) {
    log?.push('No ability activated');
  }
  log?.push(`${defender.name} has ${defender.health} health`);
  log?.push(`${attacker.name} has ${attacker.health} health`);
  return defender.health <= 0;
}
