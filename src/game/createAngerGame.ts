import Phaser from 'phaser';

const avatarAssetUrl = `${import.meta.env.BASE_URL}avatar.png`;
const HIT_REACTION_LINES = [
  '죄송합니다.',
  '제가 잘못했어요.',
  '한 번만 봐주세요.',
  '다시는 안 그럴게요.',
  '진짜 반성 중이에요.',
  '제가 실수했어요.',
  '제발 한 번만 용서해 주세요.',
  '제가 너무 경솔했어요.',
  '정말 크게 반성하고 있어요.',
  '말씀하신 게 맞아요.',
  '이번엔 제가 선 넘었어요.',
  '변명 안 할게요.',
  '정말 죄송한 마음뿐이에요.',
  '제가 생각이 짧았어요.',
  '다 제 잘못입니다.',
  '진심으로 사과드려요.',
  '제가 먼저 잘못했어요.',
  '다시 생각해 보니 제 탓이에요.',
  '한 번만 기회 주세요.',
  '이건 제가 잘못 본 거예요.',
  '제가 너무 무례했어요.',
  '제가 괜히 그랬어요.',
];

interface Callbacks {
  onHit: (remaining: number, hits: number, impactStrength: number) => void;
}

export interface AngerGameController {
  hit: () => void;
  destroy: () => void;
  resize: () => void;
}

export function createAngerGame(
  element: HTMLDivElement,
  initialAnger: number,
  nickname: string,
  callbacks: Callbacks,
): AngerGameController {
  let anger = initialAnger;
  let hits = 0;
  let sceneRef: Phaser.Scene | null = null;
  let avatar: Phaser.GameObjects.Image | null = null;
  let shadow: Phaser.GameObjects.Ellipse | null = null;
  let flash: Phaser.GameObjects.Ellipse | null = null;
  let nameplate: Phaser.GameObjects.Container | null = null;
  let nameplateBg: Phaser.GameObjects.Graphics | null = null;
  let nameplateText: Phaser.GameObjects.Image | null = null;
  let nameplateTextureKey: string | null = null;
  let speechBubble: Phaser.GameObjects.Container | null = null;
  let speechBubbleBg: Phaser.GameObjects.Graphics | null = null;
  let speechBubbleText: Phaser.GameObjects.Image | null = null;
  let speechBubbleTextureKey: string | null = null;
  let heatAura: Phaser.GameObjects.Ellipse | null = null;
  let emberAura: Phaser.GameObjects.Ellipse | null = null;
  let avatarBaseScaleX = 1;
  let avatarBaseScaleY = 1;
  let stars: Phaser.GameObjects.Star[] = [];
  let starOrbitAngle = 0;
  let starEnergy = 0;
  let shakeEnergy = 0;
  let shakeElapsed = 0;
  let shakeOffsetXAmplitude = 14;
  let shakeOffsetYAmplitude = 2.5;
  let shakeRotateAmplitude = 7;
  let shakeSquashAmplitude = 0.09;
  let shakeSpeedX = 42;
  let shakeSpeedY = 28;
  let shakeRotateSpeed = 34;
  let shakeSquashSpeed = 30;
  let lastHitAt = 0;
  let comboMomentum = 0.5;
  let auraEnergy = 0;

  function createTextTexture(
    scene: Phaser.Scene,
    key: string,
    label: string,
    color: string,
    fontSize: number,
    fontWeight: number,
  ) {
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    const pixelRatio =
      typeof window !== 'undefined' && window.devicePixelRatio > 1
        ? window.devicePixelRatio
        : 1;

    context.font = `${fontWeight} ${fontSize}px sans-serif`;
    const metrics = context.measureText(label);
    const width = Math.max(Math.ceil(metrics.width + 8), 16);
    const height = Math.max(Math.ceil(fontSize * 1.5), 18);

    canvas.width = Math.ceil(width * pixelRatio);
    canvas.height = Math.ceil(height * pixelRatio);

    context.scale(pixelRatio, pixelRatio);
    context.clearRect(0, 0, width, height);
    context.font = `${fontWeight} ${fontSize}px sans-serif`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, width / 2, height / 2);

    scene.textures.addCanvas(key, canvas);

    return {
      height,
      key,
      width,
    };
  }

  function drawSpeechBubble(labelWidth: number, labelHeight: number) {
    if (!speechBubbleBg) {
      return;
    }

    const bubbleWidth = Math.max(126, labelWidth + 28);
    const bubbleHeight = Math.max(44, labelHeight + 18);
    const tailBaseX = bubbleWidth / 2 - 28;
    const tailBaseY = bubbleHeight / 2;

    speechBubbleBg.clear();
    speechBubbleBg.fillStyle(0xffffff, 0.97);
    speechBubbleBg.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      18,
    );
    speechBubbleBg.fillTriangle(
      tailBaseX - 12,
      tailBaseY,
      tailBaseX + 4,
      tailBaseY,
      tailBaseX - 10,
      tailBaseY + 18,
    );
  }

  function updateSpeechBubbleLabel(label: string) {
    if (!sceneRef || !speechBubble) {
      return;
    }

    if (speechBubbleText) {
      speechBubble.remove(speechBubbleText, true);
      speechBubbleText = null;
    }

    if (speechBubbleTextureKey && sceneRef.textures.exists(speechBubbleTextureKey)) {
      sceneRef.textures.remove(speechBubbleTextureKey);
    }

    speechBubbleTextureKey = `speech-bubble-${crypto.randomUUID()}`;
    const texture = createTextTexture(
      sceneRef,
      speechBubbleTextureKey,
      label,
      '#202632',
      14,
      700,
    );

    if (!texture) {
      return;
    }

    speechBubbleText = sceneRef.add.image(0, 0, texture.key).setOrigin(0.5);
    speechBubble.add(speechBubbleText);
    drawSpeechBubble(texture.width, texture.height);
  }

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
    nameplate?.setPosition(centerX(), centerY() - 126);
    speechBubble?.setPosition(centerX() + 44, centerY() - 126);
    heatAura?.setPosition(centerX(), centerY() - 16);
    emberAura?.setPosition(centerX(), centerY() - 40);
    updateStarsPosition();
  }

  function triggerHit() {
    if (!sceneRef || !avatar || anger <= 0) {
      return;
    }

    const now = performance.now();
    const elapsedSinceLastHit = lastHitAt === 0 ? 420 : now - lastHitAt;
    lastHitAt = now;

    const cadenceStrength = Phaser.Math.Clamp(
      (420 - elapsedSinceLastHit) / 260,
      0,
      1,
    );

    comboMomentum =
      elapsedSinceLastHit > 680
        ? 0.46
        : Phaser.Math.Clamp(
            comboMomentum * 0.62 + cadenceStrength * 0.9 + 0.24,
            0.46,
            1.45,
          );

    const impactStrength = comboMomentum;

    hits += 1;
    anger = Math.max(0, anger - 1);
    starEnergy = Phaser.Math.Clamp(0.72 + impactStrength * 0.34, 0.72, 1.18);
    shakeEnergy = impactStrength;
    auraEnergy = Phaser.Math.Clamp(auraEnergy + impactStrength * 0.42, 0.42, 1.8);
    shakeElapsed = 0;
    shakeOffsetXAmplitude = Phaser.Math.FloatBetween(8, 13) * impactStrength;
    shakeOffsetYAmplitude = Phaser.Math.FloatBetween(1.2, 3.2) * impactStrength;
    shakeRotateAmplitude = Phaser.Math.FloatBetween(3, 6.5) * impactStrength;
    shakeSquashAmplitude = Phaser.Math.FloatBetween(0.04, 0.09) * impactStrength;
    shakeSpeedX = Phaser.Math.FloatBetween(30, 42) + cadenceStrength * 10;
    shakeSpeedY = Phaser.Math.FloatBetween(20, 30) + cadenceStrength * 6;
    shakeRotateSpeed = Phaser.Math.FloatBetween(26, 36) + cadenceStrength * 8;
    shakeSquashSpeed = Phaser.Math.FloatBetween(22, 32) + cadenceStrength * 6;

    callbacks.onHit(anger, hits, impactStrength);

    if (speechBubble && speechBubbleBg) {
      updateSpeechBubbleLabel(Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES));
      sceneRef.tweens.killTweensOf(speechBubble);
      speechBubble.setAlpha(0);
      speechBubble.setScale(0.92);
      speechBubble.setPosition(avatar.x + 44, avatar.y - 126);
      sceneRef.tweens.add({
        targets: speechBubble,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: avatar.y - 134,
        duration: 140,
        ease: 'Back.easeOut',
      });
      sceneRef.tweens.add({
        targets: speechBubble,
        alpha: 0,
        scaleX: 0.97,
        scaleY: 0.97,
        y: avatar.y - 144,
        delay: 680,
        duration: 180,
        ease: 'Quad.easeIn',
      });
    }

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
      this.load.image('avatar', avatarAssetUrl);
    }

    create() {
      sceneRef = this;

      const width = currentWidth();
      const height = currentHeight();

      this.cameras.main.setBackgroundColor('#102448');

      this.add.rectangle(width / 2, height / 2, width, height, 0x102448, 1);
      shadow = this.add.ellipse(centerX(), height - 82, 196, 34, 0x000000, 0.26);
      heatAura = this.add.ellipse(centerX(), centerY() - 16, 220, 250, 0xff4d4f, 0);
      emberAura = this.add.ellipse(centerX(), centerY() - 40, 150, 170, 0xffa24a, 0);
      flash = this.add.ellipse(centerX(), centerY(), 210, 210, 0xff4d4f, 0);
      avatar = this.add.image(centerX(), centerY(), 'avatar');
      avatar.setOrigin(0.5, 0.5);
      avatar.setDisplaySize(230, 230);
      avatarBaseScaleX = avatar.scaleX;
      avatarBaseScaleY = avatar.scaleY;
      nameplateBg = this.add.graphics();
      nameplateTextureKey = `nameplate-${crypto.randomUUID()}`;
      const nameplateTexture = createTextTexture(
        this,
        nameplateTextureKey,
        nickname,
        '#ffffff',
        15,
        700,
      );
      if (!nameplateTexture) {
        return;
      }
      nameplateText = this.add.image(0, 0, nameplateTexture.key).setOrigin(0.5);
      const nameplateWidth = Math.max(92, nameplateTexture.width + 28);
      const nameplateHeight = 34;
      nameplateBg.fillStyle(0x10182a, 0.92);
      nameplateBg.fillRoundedRect(
        -nameplateWidth / 2,
        -nameplateHeight / 2,
        nameplateWidth,
        nameplateHeight,
        17,
      );
      nameplateBg.lineStyle(1.5, 0xffffff, 0.14);
      nameplateBg.strokeRoundedRect(
        -nameplateWidth / 2,
        -nameplateHeight / 2,
        nameplateWidth,
        nameplateHeight,
        17,
      );
      nameplate = this.add.container(centerX(), centerY() - 146, [
        nameplateBg,
        nameplateText,
      ]);
      speechBubbleBg = this.add.graphics();
      speechBubble = this.add.container(centerX() + 44, centerY() - 126, [
        speechBubbleBg,
      ]);
      updateSpeechBubbleLabel(HIT_REACTION_LINES[0]);
      speechBubble.setAlpha(0);

      stars = [
        this.add.star(0, 0, 5, 7, 14, 0xffd84d, 1).setOrigin(0.5),
        this.add.star(0, 0, 5, 5, 10, 0xfff2a8, 1).setOrigin(0.5),
        this.add.star(0, 0, 5, 6, 12, 0xffc83a, 1).setOrigin(0.5),
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
          auraEnergy = Math.max(0, auraEnergy - delta / 900);

          const offsetX =
            Math.sin(shakeElapsed * shakeSpeedX) * shakeOffsetXAmplitude * shakeEnergy;
          const offsetY =
            Math.cos(shakeElapsed * shakeSpeedY) * shakeOffsetYAmplitude * shakeEnergy;
          const rotate =
            Math.sin(shakeElapsed * shakeRotateSpeed) * shakeRotateAmplitude * shakeEnergy;
          const squashX =
            1 + Math.cos(shakeElapsed * shakeSquashSpeed) * shakeSquashAmplitude * shakeEnergy;
          const squashY =
            1 - Math.cos(shakeElapsed * shakeSquashSpeed) * shakeSquashAmplitude * shakeEnergy;

          avatar.setPosition(centerX() + offsetX, centerY() + offsetY);
          avatar.setAngle(rotate);
          avatar.setScale(
            avatarBaseScaleX * squashX,
            avatarBaseScaleY * squashY,
          );

          if (nameplate) {
            nameplate.setPosition(avatar.x, avatar.y - 126 + offsetY * 0.16);
            nameplate.setRotation(Phaser.Math.DegToRad(rotate * 0.22));
            nameplate.setScale(1 + shakeEnergy * 0.015, 1 + shakeEnergy * 0.01);
          }

          if (speechBubble) {
            speechBubble.setPosition(
              avatar.x + 44 + offsetX * 0.14,
              avatar.y - 126 + offsetY * 0.08,
            );
          }
        }

        if (heatAura && emberAura) {
          const pulse = 1 + Math.sin(shakeElapsed * 6.5) * 0.04;
          const heatScale = 0.92 + auraEnergy * 0.18;
          const emberScale = 0.88 + auraEnergy * 0.14;

          heatAura.setPosition(centerX(), centerY() - 16 - auraEnergy * 8);
          heatAura.setAlpha(Math.min(0.34, auraEnergy * 0.2));
          heatAura.setScale(heatScale * pulse, (heatScale + auraEnergy * 0.06) * pulse);

          emberAura.setPosition(centerX(), centerY() - 42 - auraEnergy * 12);
          emberAura.setAlpha(Math.min(0.28, auraEnergy * 0.17));
          emberAura.setScale(
            emberScale * (1 + Math.cos(shakeElapsed * 8.4) * 0.05),
            emberScale * (1.08 + auraEnergy * 0.08),
          );
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
      nameplate = null;
      nameplateBg = null;
      nameplateText = null;
      if (nameplateTextureKey && game.textures.exists(nameplateTextureKey)) {
        game.textures.remove(nameplateTextureKey);
      }
      nameplateTextureKey = null;
      speechBubble = null;
      speechBubbleBg = null;
      speechBubbleText = null;
      if (speechBubbleTextureKey && game.textures.exists(speechBubbleTextureKey)) {
        game.textures.remove(speechBubbleTextureKey);
      }
      speechBubbleTextureKey = null;
      heatAura = null;
      emberAura = null;
      stars = [];
    },
    resize,
  };
}
