export class Resources {
  toLoad: { [key: string]: string } = {
    wizard: "/WizardSprite.png",
    wizardReverse: "/WizardSpriteReversed.png",
  };
  images: { [key: string]: any } = {};

  constructor() {
    Object.keys(this.toLoad).forEach((key) => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoad: false,
      };

      img.onload = () => {
        this.images[key].isLoad = true;
      };
    });
  }
}

export const resources = new Resources();
