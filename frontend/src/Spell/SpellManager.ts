import { game } from "../main";
import { Fireball } from "./Fireball";
import { Shield } from "./Shield";

export class SpellManager {
  private SpellMap = new Map();
  private SpellQueue = new Map();
  public spellCast: string = "";

  addToSpellMap = (id: string, spell: any) => {
    this.SpellMap.set(id, spell);
  };

  addToQueue = (id: string, side: "left" | "right", owner: any) => {
    const spellTemple: any = this.getSpell(id);
    if (!spellTemple) {
      return;
    }
    const sessionid = new Date().getMilliseconds() + id;
    const spell = new spellTemple({
      ctx: game.ctx,
      side: side,
      sessionid,
      owner,
    });
    this.SpellQueue.set(sessionid, spell);
  };

  getSpell = (id: string) => {
    return this.SpellMap.get(id);
  };

  removeFromQueue = (id: string) => {
    this.SpellQueue.delete(id);
  };

  getSpellMap() {
    return this.SpellMap;
  }

  getSpellQueue = () => {
    return Array.from(this.SpellQueue.values());
  };
}

export const spellManager = new SpellManager();

spellManager.addToSpellMap(Fireball.getSpellId(), Fireball);
spellManager.addToSpellMap(Shield.getSpellId(), Shield);
