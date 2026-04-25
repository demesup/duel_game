import { describe, expect, it, jest } from '@jest/globals';
import { getRandomAbility, randInt, randomBool } from '../src/utils';
import { ABILITIES } from '../src/ability';

describe('Utils', () => {
  it('throws when no abilities are available', () => {
    const originalAbilities = [...ABILITIES];
    ABILITIES.length = 0;

    try {
      expect(() => getRandomAbility()).toThrow('No ability found');
    } finally {
      ABILITIES.push(...originalAbilities);
    }
  });
});
