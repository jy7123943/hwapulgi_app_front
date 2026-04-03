import Phaser from 'phaser';

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

  function currentWidth() {
    return Math.max(element.clientWidth || 0, 320);
  }

  function currentHeight() {
    return Math.max(element.clientHeight || 0, 420);
  }

  function layout() {
    const width = currentWidth();
    const height = currentHeight();

    avatar?.setPosition(width / 2, height / 2 - 10);
    shadow?.setPosition(width / 2, height - 82);
    flash?.setPosition(width / 2, height / 2 - 10);
  }

  function triggerHit() {
    if (!sceneRef || !avatar || anger <= 0) {
      return;
    }

    hits += 1;
    anger = Math.max(0, anger - 3);

    callbacks.onHit(anger, hits);

    sceneRef.tweens.killTweensOf(avatar);
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

    const baseX = avatar.x;
    const baseY = avatar.y;

    sceneRef.tweens.add({
      targets: avatar,
      x: {
        values: [baseX - 22, baseX + 16, baseX - 8, baseX],
      },
      y: {
        values: [baseY - 2, baseY + 6, baseY],
      },
      angle: {
        values: [-8, 6, -3, 0],
      },
      scaleX: {
        values: [0.97, 1.02, 0.99, 1],
      },
      scaleY: {
        values: [0.98, 1.01, 0.995, 1],
      },
      duration: 220,
      ease: 'Sine.easeOut',
    });

    for (let i = 0; i < 8; i += 1) {
      const particle = sceneRef.add.circle(
        avatar.x + Phaser.Math.Between(-36, 36),
        avatar.y + Phaser.Math.Between(-54, 54),
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
      this.load.image('angryman', '/angryman.png');
    }

    create() {
      sceneRef = this;

      const width = currentWidth();
      const height = currentHeight();

      this.cameras.main.setBackgroundColor('#081427');

      this.add.circle(width * 0.28, height * 0.18, width * 0.26, 0x173257, 0.35);
      this.add.circle(width * 0.8, height * 0.78, width * 0.22, 0x0f1d35, 0.42);

      shadow = this.add.ellipse(width / 2, height - 82, 196, 34, 0x000000, 0.26);
      flash = this.add.ellipse(width / 2, height / 2 - 10, 210, 210, 0xff4d4f, 0);

      avatar = this.add.image(width / 2, height / 2 - 10, 'angryman');
      avatar.setDisplaySize(230, 230);

      this.input.on('pointerdown', () => {
        triggerHit();
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
    const width = currentWidth();
    const height = currentHeight();

    game.scale.resize(width, height);

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
    },
    resize,
  };
}
