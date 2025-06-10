import { game } from "../main";
import { Spell } from "./Spell";

export class SpellManager {
  private spellMap = new Map();
  spellCast: string = "";
  spellQueue = new Map();

  getMap = () => {
    return this.spellMap;
  };

  addSpellToMap = ({ id, value }: { id: number; value: Spell }) => {
    this.spellMap.set(id, value);
  };

  removeSpellFromMap = ({ id }: { id: number }) => {
    this.spellMap.delete(id);
    return this.spellMap;
  };

  getSpell = ({ id }: { id: number }): Spell => {
    return this.spellMap.get(id);
  };

  addToCasting = ({ id }: { id: number }) => {
    const spell: Spell = this.getSpell({ id });
    if (spell) this.spellQueue.set(id, spell);
  };

  removeFromQueue = ({ id }: { id: number }) => {
    if (!this.spellQueue.has(id)) return;
    this.spellQueue.delete(id);
  };

  getQueue = () => {
    return Array.from(this.spellQueue.values());
  };
}

export const spellManager = new SpellManager();
