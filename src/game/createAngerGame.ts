import Phaser from 'phaser';
import { colors } from '@toss/tds-colors';

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
  let sprite: Phaser.GameObjects.Container | undefined;
  let faceText: Phaser.GameObjects.Text | undefined;
  let burstGroup: Phaser.GameObjects.Group | undefined;

  class ArenaScene extends Phaser.Scene {
    constructor() {
      super('arena');
    }

    preload() {
      this.load.image('angryman', '/angryman.png');
    }

    create() {
      const { width, height } = this.scale;

      this.add.rectangle(width / 2, height / 2, width, height, 0xff7a74);
      this.add.rectangle(width / 2, height * 0.18, width, height * 0.36, 0xc56bff);
      this.add.circle(width / 2, height / 2 + 94, width * 0.28, 0x9d432b, 0.16);

      sprite = this.add.container(width / 2, height / 2);

      const shadow = this.add.ellipse(0, 142, 170, 36, 0x5f1d13, 0.14);
      const halo = this.add.circle(0, -12, 124, 0xffffff, 0.22);
      const avatar = this.add.image(0, 12, 'angryman').setDisplaySize(224, 224);
      const ragePlate = this.add.circle(0, -12, 34, 0x8f1fff, 0.88);
      faceText = this.add.text(0, -12, '꽉', {
        color: colors.background,
        fontFamily: 'sans-serif',
        fontSize: '26px',
        fontStyle: '700',
      }).setOrigin(0.5);

      sprite.add([
        shadow,
        halo,
        avatar,
        ragePlate,
        faceText,
      ]);

      burstGroup = this.add.group();

      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (pointer.y > 20) {
          triggerHit(this);
        }
      });
    }
  }

  function updateFace() {
    if (!faceText) {
      return;
    }

    if (anger > 60) {
      faceText.setText('꽉');
    } else if (anger > 30) {
      faceText.setText('헉');
    } else {
      faceText.setText('멍');
    }
  }

  function triggerHit(scene: Phaser.Scene) {
    if (!sprite || !burstGroup || anger <= 0) {
      return;
    }

    hits += 1;
    anger = Math.max(0, anger - 3);
    updateFace();

    scene.tweens.killTweensOf(sprite);
    scene.tweens.add({
      targets: sprite,
      x: sprite.x + Phaser.Math.Between(-18, 18),
      y: sprite.y + Phaser.Math.Between(-10, 10),
      angle: Phaser.Math.Between(-6, 6),
      scaleX: 0.96,
      scaleY: 0.96,
      duration: 45,
      yoyo: true,
      ease: 'Quad.easeOut',
    });

    for (let i = 0; i < 7; i += 1) {
      const particle = scene.add.circle(
        sprite.x + Phaser.Math.Between(-36, 36),
        sprite.y + Phaser.Math.Between(-70, 70),
        Phaser.Math.Between(4, 9),
        Phaser.Math.RND.pick([0xffcc00, 0xff6a4e, 0x8f1fff, 0x5f84d8]),
      );

      burstGroup.add(particle);

      scene.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-60, 60),
        y: particle.y + Phaser.Math.Between(-60, 60),
        alpha: 0,
        scale: 0.3,
        duration: 260,
        onComplete: () => particle.destroy(),
      });
    }

    callbacks.onHit(anger, hits);
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: element,
    backgroundColor: '#ff7a74',
    width: element.clientWidth || 320,
    height: element.clientHeight || 360,
    scene: ArenaScene,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
    },
  });

  const resize = () => {
    game.scale.resize(element.clientWidth || 320, element.clientHeight || 360);
  };

  return {
    hit: () => {
      const scene = game.scene.getScene('arena');
      if (scene) {
        triggerHit(scene);
      }
    },
    destroy: () => game.destroy(true),
    resize,
  };
}
