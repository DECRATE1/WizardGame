import { DynamicSpell } from "./DynamicSpell";
import { StaticSpell } from "./StaticSpell";

export class SpellManager {
  private spellMap = new Map();
  spellQueue = new Map<number, DynamicSpell | StaticSpell>();
  addSpellToMap = ({
    id,
    value,
  }: {
    id: number;
    value: StaticSpell | DynamicSpell;
  }) => {
    this.spellMap.set(id, value);
  };

  removeSpellFromMap = ({ id }: { id: number }) => {
    this.spellMap.delete(id);
    return this.spellMap;
  };

  getSpell = ({ id }: { id: number }): StaticSpell | DynamicSpell => {
    return this.spellMap.get(id);
  };

  addToCasting = ({ id }: { id: number }) => {
    const spell: StaticSpell | DynamicSpell = this.getSpell({ id });
    this.spellQueue.set(id, spell);
  };

  removeFromQueue = ({ id }: { id: number }) => {
    if (!this.spellQueue.has(id)) return;
    this.spellQueue.delete(id);
  };

  getQueue = () => {
    return Array.from(this.spellQueue.values());
  };
}
