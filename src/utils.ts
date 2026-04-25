import { Ability, ABILITIES } from './ability';

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomAbility(): Ability {
  const AbilityClass = ABILITIES[Math.floor(Math.random() * ABILITIES.length)];
  
  if (!AbilityClass) {
    throw new Error('No ability found');
  }
  return new AbilityClass();
}

export function randomBool() {
  return Math.random() < 0.5;
}