import { runDuel } from '../src/duel';

describe('Duel Integration', () => {
  it('should run a duel and declare a winner', () => {
    const result = runDuel({ perRndAbility: false });
    expect(result.winner === 'Draw!' || result.winner.endsWith(' won!')).toBe(true);
    expect(result.log.length).toBeGreaterThan(0);
  });

  it('should support per-round ability assignment', () => {
    const result = runDuel({ perRndAbility: true });
    expect(result.winner === 'Draw!' || result.winner.endsWith(' won!')).toBe(true);
  });

  it('should support simulation mode without collecting logs', () => {
    const result = runDuel({ collectLog: false });
    expect(result.winner === 'Draw!' || result.winner.endsWith(' won!')).toBe(true);
    expect(result.log).toEqual([]);
  });

  it('should reject invalid activation chance values', () => {
    expect(() => runDuel({ actChance: -0.1 })).toThrow();
    expect(() => runDuel({ actChance: 1.1 })).toThrow();
  });
});
