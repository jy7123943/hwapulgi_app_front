import Phaser from 'phaser';

const angrymanAssetUrl = `${import.meta.env.BASE_URL}angryman.png`;

interface Callbacks {
  onHit: (remaining: number, hits: number) => void;
}

export interface AngerGameController {
  hit: () => void;
  destroy: () => void;
  resize: () => void;
}

export function createAngerGame(
  element: HTMLDivElement,
  initialAnger: number,
  callbacks: Callbacks,
): AngerGameController {
  let anger = initialAnger;
  let hits = 0;
  let sceneRef: Phaser.Scene | null = null;
  let avatar: Phaser.GameObjects.Image | null = null;
  let shadow: Phaser.GameObjects.Ellipse | null = null;
  let flash: Phaser.GameObjects.Ellipse | null = null;
  let stars: Phaser.GameObjects.Text[] = [];
  let starOrbitAngle = 0;
  let starEnergy = 0;
  let shakeEnergy = 0;
  let shakeElapsed = 0;

  function currentWidth() {
    return Math.max(element.clientWidth || 0, 320);
  }

  function currentHeight() {
    return Math.max(element.clientHeight || 0, 420);
  }

  function centerX() {
    return currentWidth() / 2;
  }

  function centerY() {
    return currentHeight() / 2 - 10;
  }

  function updateStarsPosition() {
    if (!avatar || stars.length === 0) {
      return;
    }

    const cx = avatar.x;
    const cy = avatar.y - 92;
    const radiusX = 34;
    const radiusY = 14;

    stars.forEach((star, index) => {
      const angle = starOrbitAngle + index * ((Math.PI * 2) / stars.length);
      star.setPosition(cx + Math.cos(angle) * radiusX, cy + Math.sin(angle) * radiusY);
    });
  }

  function layout() {
    avatar?.setPosition(centerX(), centerY());
    shadow?.setPosition(centerX(), currentHeight() - 82);
    flash?.setPosition(centerX(), centerY());
    updateStarsPosition();
  }

  function triggerHit() {
    if (!sceneRef || !avatar || anger <= 0) {
      return;
    }

    hits += 1;
    anger = Math.max(0, anger - 1);
    starEnergy = 1;
    shakeEnergy = 1;
    shakeElapsed = 0;

    callbacks.onHit(anger, hits);

    if (flash) {
      sceneRef.tweens.killTweensOf(flash);
      flash.setAlpha(0.18);
      flash.setScale(1);
      sceneRef.tweens.add({
        targets: flash,
        scaleX: 1.14,
        scaleY: 1.14,
        alpha: 0,
        duration: 160,
        ease: 'Quad.easeOut',
      });
    }

    for (let i = 0; i < 8; i += 1) {
      const particle = sceneRef.add.circle(
        avatar.x + Phaser.Math.Between(-42, 42),
        avatar.y + Phaser.Math.Between(-60, 56),
        Phaser.Math.Between(3, 7),
        Phaser.Math.RND.pick([0xff6459, 0xff8f78, 0xffc400]),
      );

      sceneRef.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-72, 72),
        y: particle.y + Phaser.Math.Between(-72, 72),
        alpha: 0,
        scale: 0.2,
        duration: 260,
        onComplete: () => particle.destroy(),
      });
    }
  }

  class ArenaScene extends Phaser.Scene {
    constructor() {
      super('arena');
    }

    preload() {
      this.load.image('angryman', angrymanAssetUrl);
    }

    create() {
      sceneRef = this;

      const width = currentWidth();
      const height = currentHeight();

      this.cameras.main.setBackgroundColor('#081427');

      this.add.circle(width * 0.28, height * 0.18, width * 0.26, 0x173257, 0.35);
      this.add.circle(width * 0.8, height * 0.78, width * 0.22, 0x0f1d35, 0.42);

      shadow = this.add.ellipse(centerX(), height - 82, 196, 34, 0x000000, 0.26);
      flash = this.add.ellipse(centerX(), centerY(), 210, 210, 0xff4d4f, 0);
      avatar = this.add.image(centerX(), centerY(), 'angryman');
      avatar.setOrigin(0.5, 0.5);
      avatar.setDisplaySize(230, 230);

      stars = [
        this.add.text(0, 0, '✦', {
          color: '#ffd84d',
          fontFamily: 'sans-serif',
          fontSize: '28px',
          fontStyle: '700',
        }).setOrigin(0.5),
        this.add.text(0, 0, '✦', {
          color: '#fff2a8',
          fontFamily: 'sans-serif',
          fontSize: '18px',
          fontStyle: '700',
        }).setOrigin(0.5),
        this.add.text(0, 0, '✦', {
          color: '#ffc83a',
          fontFamily: 'sans-serif',
          fontSize: '22px',
          fontStyle: '700',
        }).setOrigin(0.5),
      ];

      stars.forEach((star) => {
        star.setAlpha(0);
      });
      updateStarsPosition();

      this.input.on('pointerdown', () => {
        triggerHit();
      });

      this.events.on('update', (_time: number, delta: number) => {
        if (avatar) {
          shakeElapsed += delta / 1000;
          shakeEnergy = Math.max(0, shakeEnergy - delta / 260);

          const offsetX = Math.sin(shakeElapsed * 42) * 14 * shakeEnergy;
          const offsetY = Math.cos(shakeElapsed * 28) * 2.5 * shakeEnergy;
          const rotate = Math.sin(shakeElapsed * 34) * 7 * shakeEnergy;
          const squashX = 1 + Math.cos(shakeElapsed * 30) * 0.09 * shakeEnergy;
          const squashY = 1 - Math.cos(shakeElapsed * 30) * 0.09 * shakeEnergy;

          avatar.setPosition(centerX() + offsetX, centerY() + offsetY);
          avatar.setAngle(rotate);
          avatar.setScale(squashX, squashY);
        }

        if (shadow) {
          shadow.setPosition(centerX(), currentHeight() - 82);
          shadow.setScale(1 + shakeEnergy * 0.04, 1);
        }

        if (stars.length === 0) {
          return;
        }

        starOrbitAngle += (delta / 1000) * (2.8 + starEnergy * 4.6);
        starEnergy = Math.max(0, starEnergy - delta / 850);

        stars.forEach((star, index) => {
          const bob = Math.sin(starOrbitAngle * 2 + index) * 0.08;
          star.setAlpha(starEnergy > 0.02 ? 0.72 + starEnergy * 0.18 : 0);
          star.setScale(1 + bob + starEnergy * 0.12);
        });

        updateStarsPosition();
      });
    }
  }

  const game = new Phaser.Game({
    type: Phaser.CANVAS,
    parent: element,
    transparent: false,
    backgroundColor: '#081427',
    width: currentWidth(),
    height: currentHeight(),
    scene: ArenaScene,
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  });

  const resize = () => {
    game.scale.resize(currentWidth(), currentHeight());
    if (sceneRef) {
      layout();
    }
  };

  return {
    hit: () => {
      triggerHit();
    },
    destroy: () => {
      game.destroy(true);
      sceneRef = null;
      avatar = null;
      shadow = null;
      flash = null;
      stars = [];
    },
    resize,
  };
}
