import { Fireball } from "./Fireball";

export class SpellManager {
  private SpellMap = new Map();
  private SpellQueue = new Map();
  public spellCast: string = "";

  addToSpellMap = (id: string, spell: any) => {
    this.SpellMap.set(id, spell);
  };

  addToQueue = (id: string, spellTemple: Fireball) => {
    this.SpellQueue.set(id, spellTemple);
  };

  removeFromQueue = (id: string) => {
    this.SpellQueue.delete(id);
  };

  getSpellMap() {
    return this.SpellMap;
  }

  getSpellQueue = () => {
    return Array.from(Object.values(this.SpellQueue));
  };
}

export const spellManager = new SpellManager();

spellManager.addToSpellMap(Fireball.getSpellId(), Fireball);
