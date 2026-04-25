# Duel

A small TypeScript turn-based duel simulator between two characters, each with random stats and a special ability.

## Project Description

Each duel creates two characters (`Sasha` and `Masha` by default), then runs rounds until one (or both) reaches 0 health.

Per turn:
1. Attacker may trigger an **Attack**-phase ability.
2. Defender may trigger a **Defense**-phase ability.
3. Damage is applied.
4. Defender may trigger a **Resolution**-phase ability.

Ability activation chance defaults to `25%` when the ability phase matches, and can be configured from CLI.

## Abilities

- `Power Strike` (Attack): increases outgoing damage by 50% (`ceil`).
- `Damage Reduction` (Defense): halves incoming damage (`ceil`).
- `Second Wind` (Resolution): heals 5 only when crossing into sub-30 HP from >=30 HP.
- `Boomerang` (Resolution): activates only when received damage is > 0 and reflects 70% damage back to attacker.

## Edge Cases Covered

Implementation + tests cover:

- Damage never goes negative (`max(attack - defense, 0)`).
- Character health never drops below 0.
- Healing is capped at 100 HP.
- `Second Wind` does not trigger if defender was already below 30 HP before hit.
- `Boomerang` does not activate when damage is 0.
- Ability effects/messages are phase-aware and only apply on activation.

## How To Run

Install dependencies:

```bash
npm install
```

Build TypeScript:

```bash
npm run build
```

Run one duel (default abilities assigned once at character creation):

```bash
node dist/cli.js
```
or 
```bash
npm run duel
```

Run one duel with per-round ability reroll:

```bash
node dist/cli.js --per-round
```
or 
```bash
npm run duel:round
```

Run one duel with custom ability activation chance (example: 40%):

```bash
node dist/cli.js --ability-chance 0.4
```

Alternative flag form:

```bash
node dist/cli.js --ability-chance=0.4
```

Run 1000-duel simulation summary:

```bash
node dist/cli.js --simulate
```
or
```bash
npm run duel:sim
```

Run simulation with per-round ability reroll:

```bash
node dist/cli.js --simulate --per-round
```
or (works only with 0.4 chance)
```bash
npm run duel:sim:round
```

Run simulation with custom ability activation chance:

```bash
node dist/cli.js --simulate --ability-chance 0.4
```
or (works only with 0.4 chance)
```bash
npm run duel:sim:40
```

Run simulation with both per-round reroll and custom ability activation chance:

```bash
node dist/cli.js --simulate --per-round --ability-chance 0.4
```
or
```bash
npm run duel:sim:r:40
```

## Tests

Run test suite:

```bash
npm test
```
or ```
jest
```

## Coverage

Generate coverage report:

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage --runInBand
```

Latest local run:
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |   98.65 |     89.7 |     100 |   98.65 |                   
 ability.ts   |     100 |      100 |     100 |     100 |                   
 character.ts |     100 |      100 |     100 |     100 |                   
 duel.ts      |     100 |    55.55 |     100 |     100 | 16,25-32          
 game.ts      |     100 |      100 |     100 |     100 |                   
 loop.ts      |   93.75 |    83.33 |     100 |   93.75 | 7                 
 phase.ts     |     100 |      100 |     100 |     100 |                   
 turn.ts      |     100 |      100 |     100 |     100 |                   
 utils.ts     |      90 |       50 |     100 |      90 | 11                  
--------------|---------|----------|---------|---------|-------------------
Primary lower-coverage area: utility helpers in `src/utils.ts` (console output/random helper paths).
