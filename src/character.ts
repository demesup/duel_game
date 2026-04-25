import {Ability} from './ability';
import { randInt, getRandomAbility } from "./utils"

export class Character {
  name: string;
  health: number = 100;
  attack: number;
  defense: number;
  ability: Ability;

  constructor(name: string, ability?: Ability) {
    this.name = name;
    this.attack = randInt(15, 20);
    this.defense = randInt(10, 15);
    this.ability = ability || getRandomAbility();
  }

  assignRandomAbility() {
    this.ability = getRandomAbility();
  }

  changeHealth(delta: number): void {
    this.health = Math.min(Math.max(this.health + delta, 0), 100);
  }
}
