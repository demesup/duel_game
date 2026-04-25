import { Character } from './character';
import { Phase } from './phase';

export interface Ability {
  name: string;
  description: string;
  actPhase: Phase;
  activate(params: AbilityParams): AbilityResult;
}

export interface AbilityParams {
  attacker: Character;
  defender: Character;
  damage: number;
}

export interface AbilityResult {
  activated: boolean;
  message?: string;
  modifiedDmg?: number;
  healed?: number;
  reflectedDmg?: number;
}

export class DamageReduction implements Ability {
  name = 'Damage Reduction';
  description = 'Takes only half damage';
  actPhase = Phase.Defense;

  activate(params: AbilityParams): AbilityResult {
    const finalDmg = Math.ceil(params.damage / 2);
    return {
      activated: true,
      message: `${params.defender.name} activates Damage Reduction and takes ${finalDmg}`,
      modifiedDmg: finalDmg,
    };
  }
}

export class PowerStrike implements Ability {
  name = 'Power Strike';
  description = 'Attacks with 50% more power';
  actPhase = Phase.Attack;

  activate(params: AbilityParams): AbilityResult {
    const finalDmg = Math.ceil(params.damage * 1.5);
    return {
      activated: true,
      message: `${params.attacker.name} activates Power Strike and deals ${finalDmg}`,
      modifiedDmg: finalDmg
    };
  }
}


export class SecondWind implements Ability {
  name = 'Second Wind';
  description = 'If brought below 30 health, heals 5';
  actPhase = Phase.Resolution;

  activate(params: AbilityParams): AbilityResult {
    if (
      params.defender.health >= 30 ||
      params.defender.health + params.damage < 30 // was already below 30hp?
    ) {
      return { activated: false };
    }

    return {
      activated: true,
      message: `${params.defender.name} activates Second Wind and heals 5 hp`,
      healed: 5
    };
  }
}

export class Boomerang implements Ability {
  name = 'Boomerang';
  description = 'Deals 70% of the damage dealt back to the attacker on activation';
  actPhase = Phase.Resolution;

  activate(params: AbilityParams): AbilityResult {
    if (params.damage <= 0) {
      return { activated: false };
    }
    const reflectedDmg = Math.ceil(params.damage * 0.7);

    return {
      activated: true,
      message: `${params.defender.name} activates Boomerang and deals ${reflectedDmg} back`,
      reflectedDmg
    };
  }
}


export const ABILITIES = [DamageReduction, PowerStrike, SecondWind, Boomerang];
