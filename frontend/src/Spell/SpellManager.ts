import { Fireball } from "./Fireball";
import { Spell } from "./Spell";

export class SpellManager {
  private SpellMap = new Map();
  private SpellQueue = new Map();

  addToSpellMap = (id: string, spell: any) => {
    this.SpellMap.set(id, spell);
  };

  addToQueue = (id: string, spell: any) => {
    this.SpellQueue.set(id, spell);
  };

  removeFromQueue = (id: string) => {
    this.SpellQueue.delete(id);
  };
}

export const spellManager = new SpellManager();

spellManager.addToSpellMap("111", Fireball);
