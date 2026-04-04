import Phaser from "phaser";
import { playHitSound } from "../lib/sounds";

const avatarAssetUrl = `${import.meta.env.BASE_URL}avatar.png`;
const HIT_REACTION_LINES = {
  defiant: [
    "악!",
    "왜 때려!",
    "아파!",
    "너무하네!",
    "그만 좀!",
    "으악!",
  ],
  defensive: [
    "잠깐만요!",
    "제 말도 들어보세요!",
    "너무 세잖아요!",
    "한 번만 봐주세요!",
    "제가 설명할게요!",
    "진정해요!",
  ],
  apologetic: [
    "죄송합니다.",
    "제가 잘못했어요.",
    "다시는 안 그럴게요.",
    "진짜 반성 중이에요.",
    "제가 실수했어요.",
    "변명 안 할게요.",
    "한 번만 기회 주세요.",
  ],
  formal: [
    "진심으로 사과드립니다.",
    "제 잘못을 인정합니다.",
    "정말 죄송한 마음뿐입니다.",
    "깊이 반성하고 있습니다.",
    "다시는 같은 실수 하지 않겠습니다.",
    "제가 먼저 사과드리겠습니다.",
    "불편을 드려 죄송합니다.",
  ],
};
const COMBO_FEEDBACK: Record<
  number,
  { labels: string[]; color: string; fontSize: number; fontWeight: number }
> = {
  5: { labels: ["퍽!"], color: "#ffe06b", fontSize: 14, fontWeight: 800 },
  10: { labels: ["연타!"], color: "#ff9e6d", fontSize: 17, fontWeight: 900 },
  15: { labels: ["폭주!"], color: "#ff7b7b", fontSize: 21, fontWeight: 900 },
  20: { labels: ["난타!"], color: "#d09cff", fontSize: 24, fontWeight: 900 },
};

interface Callbacks {
  onHit: (remaining: number, hits: number, impactStrength: number) => void;
  isMuted: () => boolean;
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
  callbacks: Callbacks
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
  let comboPopup: Phaser.GameObjects.Image | null = null;
  let comboPopupTextureKey: string | null = null;
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
  let megaSquashEnergy = 0;
  let lastHitAt = 0;
  let comboStreak = 0;
  let comboMomentum = 0.5;
  let auraEnergy = 0;
  let pendingSpeechBubble: Phaser.Time.TimerEvent | null = null;

  function createTextTexture(
    scene: Phaser.Scene,
    key: string,
    label: string,
    color: string,
    fontSize: number,
    fontWeight: number
  ) {
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    const pixelRatio =
      typeof window !== "undefined" && window.devicePixelRatio > 1
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
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label, width / 2, height / 2);

    scene.textures.addCanvas(key, canvas);

    return {
      height,
      key,
      pixelWidth: canvas.width,
      pixelHeight: canvas.height,
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
      18
    );
    speechBubbleBg.fillTriangle(
      tailBaseX - 12,
      tailBaseY,
      tailBaseX + 4,
      tailBaseY,
      tailBaseX - 10,
      tailBaseY + 18
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

    if (
      speechBubbleTextureKey &&
      sceneRef.textures.exists(speechBubbleTextureKey)
    ) {
      sceneRef.textures.remove(speechBubbleTextureKey);
    }

    speechBubbleTextureKey = `speech-bubble-${crypto.randomUUID()}`;
    const texture = createTextTexture(
      sceneRef,
      speechBubbleTextureKey,
      label,
      "#202632",
      14,
      700
    );

    if (!texture) {
      return;
    }

    speechBubbleText = sceneRef.add.image(0, 0, texture.key).setOrigin(0.5);
    speechBubbleText.setDisplaySize(texture.width, texture.height);
    speechBubble.add(speechBubbleText);
    drawSpeechBubble(texture.width, texture.height);
  }

  function getReactionLine() {
    const releaseRatio =
      1 - Phaser.Math.Clamp(anger / Math.max(initialAnger, 1), 0, 1);

    if (releaseRatio <= 0.1) {
      return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.defiant);
    }

    if (releaseRatio <= 0.45) {
      return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.defensive);
    }

    if (releaseRatio <= 0.82) {
      return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.apologetic);
    }

    return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.formal);
  }

  function showComboPopup(
    labels: string[],
    color: string,
    fontSize: number,
    fontWeight: number
  ) {
    if (!sceneRef) {
      return;
    }
    const scene = sceneRef;
    const label = Phaser.Utils.Array.GetRandom(labels);
    const startX = centerX() + Phaser.Math.Between(-26, 26);
    const startY = centerY() - Phaser.Math.Between(104, 126);
    const endX = startX + Phaser.Math.Between(-10, 10);
    const endY = startY - Phaser.Math.Between(10, 18);
    const fadeX = endX + Phaser.Math.Between(-6, 6);
    const fadeY = endY - Phaser.Math.Between(10, 16);
    const startAngle = Phaser.Math.FloatBetween(-12, 12);
    const endAngle = Phaser.Math.FloatBetween(-5, 5);
    const startScale = Phaser.Math.FloatBetween(0.72, 0.82);
    const popScale = Phaser.Math.FloatBetween(0.94, 1.02);
    const fadeScale = Phaser.Math.FloatBetween(1.02, 1.1);

    if (comboPopup) {
      scene.tweens.killTweensOf(comboPopup);
      comboPopup.destroy();
      comboPopup = null;
    }

    if (comboPopupTextureKey && scene.textures.exists(comboPopupTextureKey)) {
      scene.textures.remove(comboPopupTextureKey);
    }

    comboPopupTextureKey = `combo-popup-${crypto.randomUUID()}`;
    const texture = createTextTexture(
      scene,
      comboPopupTextureKey,
      label,
      color,
      fontSize,
      fontWeight
    );

    if (!texture) {
      return;
    }

    comboPopup = scene.add
      .image(startX, startY, texture.key)
      .setOrigin(0.5)
      .setDisplaySize(texture.width, texture.height)
      .setAlpha(0)
      .setScale(startScale)
      .setAngle(startAngle);

    starEnergy = Phaser.Math.FloatBetween(0.92, 1.18);

    scene.tweens.add({
      targets: comboPopup,
      alpha: 1,
      scaleX: popScale,
      scaleY: popScale,
      x: endX,
      y: endY,
      angle: endAngle,
      duration: 120,
      ease: "Back.easeOut",
    });

    scene.tweens.add({
      targets: comboPopup,
      alpha: 0,
      scaleX: fadeScale,
      scaleY: fadeScale,
      x: fadeX,
      y: fadeY,
      angle: endAngle + Phaser.Math.FloatBetween(-4, 4),
      delay: 240,
      duration: 180,
      ease: "Quad.easeIn",
      onComplete: () => {
        comboPopup?.destroy();
        comboPopup = null;
        if (comboPopupTextureKey && scene.textures.exists(comboPopupTextureKey)) {
          scene.textures.remove(comboPopupTextureKey);
        }
        comboPopupTextureKey = null;
      },
    });
  }

  function showSpeechBubble(label: string) {
    if (!sceneRef || !avatar || !speechBubble || !speechBubbleBg) {
      return;
    }

    updateSpeechBubbleLabel(label);
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
      ease: "Back.easeOut",
    });
    sceneRef.tweens.add({
      targets: speechBubble,
      alpha: 0,
      scaleX: 0.97,
      scaleY: 0.97,
      y: avatar.y - 144,
      delay: 680,
      duration: 180,
      ease: "Quad.easeIn",
    });
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
      star.setPosition(
        cx + Math.cos(angle) * radiusX,
        cy + Math.sin(angle) * radiusY
      );
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
      1
    );
    comboStreak = elapsedSinceLastHit <= 160 ? comboStreak + 1 : 1;

    comboMomentum =
      elapsedSinceLastHit > 680
        ? 0.46
        : Phaser.Math.Clamp(
            comboMomentum * 0.62 + cadenceStrength * 0.9 + 0.24,
            0.46,
            1.45
          );

    const impactStrength = comboMomentum;

    const angerDrop = Phaser.Math.Clamp(
      Phaser.Math.Linear(0.14, 0.62, (impactStrength - 0.46) / (1.45 - 0.46)),
      0.14,
      0.62,
    );

    hits += 1;
    anger = Math.max(0, anger - angerDrop);
    shakeEnergy = impactStrength;
    auraEnergy = Phaser.Math.Clamp(
      auraEnergy + impactStrength * 0.42,
      0.42,
      1.8
    );
    shakeElapsed = 0;
    shakeOffsetXAmplitude = Phaser.Math.FloatBetween(8, 13) * impactStrength;
    shakeOffsetYAmplitude = Phaser.Math.FloatBetween(1.2, 3.2) * impactStrength;
    shakeRotateAmplitude = Phaser.Math.FloatBetween(3, 6.5) * impactStrength;
    shakeSquashAmplitude =
      Phaser.Math.FloatBetween(0.04, 0.09) * impactStrength;
    shakeSpeedX = Phaser.Math.FloatBetween(30, 42) + cadenceStrength * 10;
    shakeSpeedY = Phaser.Math.FloatBetween(20, 30) + cadenceStrength * 6;
    shakeRotateSpeed = Phaser.Math.FloatBetween(26, 36) + cadenceStrength * 8;
    shakeSquashSpeed = Phaser.Math.FloatBetween(22, 32) + cadenceStrength * 6;

    if (impactStrength > 1.08 && Math.random() < 0.18) {
      megaSquashEnergy = Phaser.Math.FloatBetween(0.7, 1);
    }

    if (cadenceStrength > 0.9 && impactStrength > 1.02 && COMBO_FEEDBACK[comboStreak]) {
      const comboFeedback = COMBO_FEEDBACK[comboStreak];
      showComboPopup(
        comboFeedback.labels,
        comboFeedback.color,
        comboFeedback.fontSize,
        comboFeedback.fontWeight
      );
    }

    callbacks.onHit(anger, hits, impactStrength);

    if (!callbacks.isMuted()) {
      if (impactStrength >= 1.15) {
        playHitSound("hard");
      } else if (impactStrength >= 0.82) {
        playHitSound("medium");
      } else {
        playHitSound("soft");
      }
    }

    if (sceneRef && speechBubble && speechBubbleBg) {
      pendingSpeechBubble?.remove(false);
      pendingSpeechBubble = sceneRef.time.delayedCall(240, () => {
        showSpeechBubble(getReactionLine());
        pendingSpeechBubble = null;
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
        ease: "Quad.easeOut",
      });
    }

    for (let i = 0; i < 8; i += 1) {
      const particle = sceneRef.add.circle(
        avatar.x + Phaser.Math.Between(-42, 42),
        avatar.y + Phaser.Math.Between(-60, 56),
        Phaser.Math.Between(3, 7),
        Phaser.Math.RND.pick([0xff6459, 0xff8f78, 0xffc400])
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
      super("arena");
    }

    preload() {
      this.load.image("avatar", avatarAssetUrl);
    }

    create() {
      sceneRef = this;

      const width = currentWidth();
      const height = currentHeight();

      this.cameras.main.setBackgroundColor("#392b61");

      this.add.rectangle(width / 2, height / 2, width, height, 0x392b61, 1);
      shadow = this.add.ellipse(
        centerX(),
        height - 82,
        196,
        34,
        0x000000,
        0.26
      );
      heatAura = this.add.ellipse(
        centerX(),
        centerY() - 16,
        220,
        250,
        0xff4d4f,
        0
      );
      emberAura = this.add.ellipse(
        centerX(),
        centerY() - 40,
        150,
        170,
        0xffa24a,
        0
      );
      flash = this.add.ellipse(centerX(), centerY(), 210, 210, 0xff4d4f, 0);
      avatar = this.add.image(centerX(), centerY(), "avatar");
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
        "#ffffff",
        15,
        700
      );
      if (!nameplateTexture) {
        return;
      }
      nameplateText = this.add.image(0, 0, nameplateTexture.key).setOrigin(0.5);
      nameplateText.setDisplaySize(
        nameplateTexture.width,
        nameplateTexture.height
      );
      const nameplateWidth = Math.max(92, nameplateTexture.width + 28);
      const nameplateHeight = 34;
      nameplateBg.fillStyle(0x10182a, 0.92);
      nameplateBg.fillRoundedRect(
        -nameplateWidth / 2,
        -nameplateHeight / 2,
        nameplateWidth,
        nameplateHeight,
        17
      );
      nameplateBg.lineStyle(1.5, 0xffffff, 0.14);
      nameplateBg.strokeRoundedRect(
        -nameplateWidth / 2,
        -nameplateHeight / 2,
        nameplateWidth,
        nameplateHeight,
        17
      );
      nameplate = this.add.container(centerX(), centerY() - 146, [
        nameplateBg,
        nameplateText,
      ]);
      speechBubbleBg = this.add.graphics();
      speechBubble = this.add.container(centerX() + 44, centerY() - 126, [
        speechBubbleBg,
      ]);
      updateSpeechBubbleLabel(HIT_REACTION_LINES.defiant[0]);
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

      this.input.on("pointerdown", () => {
        triggerHit();
      });

      this.events.on("update", (_time: number, delta: number) => {
        if (avatar) {
          shakeElapsed += delta / 1000;
          shakeEnergy = Math.max(0, shakeEnergy - delta / 260);
          auraEnergy = Math.max(0, auraEnergy - delta / 900);
          megaSquashEnergy = Math.max(0, megaSquashEnergy - delta / 180);

          const offsetX =
            Math.sin(shakeElapsed * shakeSpeedX) *
            shakeOffsetXAmplitude *
            shakeEnergy;
          const offsetY =
            Math.cos(shakeElapsed * shakeSpeedY) *
            shakeOffsetYAmplitude *
            shakeEnergy;
          const rotate =
            Math.sin(shakeElapsed * shakeRotateSpeed) *
            shakeRotateAmplitude *
            shakeEnergy;
          const squashX =
            1 +
            Math.cos(shakeElapsed * shakeSquashSpeed) *
              shakeSquashAmplitude *
              shakeEnergy;
          const squashY =
            1 -
            Math.cos(shakeElapsed * shakeSquashSpeed) *
              shakeSquashAmplitude *
              shakeEnergy;
          const megaSquashX = 1 - megaSquashEnergy * 0.18;
          const megaSquashY = 1 + megaSquashEnergy * 0.08;

          avatar.setPosition(centerX() + offsetX, centerY() + offsetY);
          avatar.setAngle(rotate);
          avatar.setScale(
            avatarBaseScaleX * squashX * megaSquashX,
            avatarBaseScaleY * squashY * megaSquashY
          );

          if (nameplate) {
            nameplate.setPosition(avatar.x, avatar.y - 126 + offsetY * 0.16);
            nameplate.setRotation(Phaser.Math.DegToRad(rotate * 0.22));
            nameplate.setScale(1 + shakeEnergy * 0.015, 1 + shakeEnergy * 0.01);
          }

          if (speechBubble) {
            speechBubble.setPosition(
              avatar.x + 44 + offsetX * 0.14,
              avatar.y - 126 + offsetY * 0.08
            );
          }
        }

        if (heatAura && emberAura) {
          const pulse = 1 + Math.sin(shakeElapsed * 6.5) * 0.04;
          const heatScale = 0.92 + auraEnergy * 0.18;
          const emberScale = 0.88 + auraEnergy * 0.14;

          heatAura.setPosition(centerX(), centerY() - 16 - auraEnergy * 8);
          heatAura.setAlpha(Math.min(0.34, auraEnergy * 0.2));
          heatAura.setScale(
            heatScale * pulse,
            (heatScale + auraEnergy * 0.06) * pulse
          );

          emberAura.setPosition(centerX(), centerY() - 42 - auraEnergy * 12);
          emberAura.setAlpha(Math.min(0.28, auraEnergy * 0.17));
          emberAura.setScale(
            emberScale * (1 + Math.cos(shakeElapsed * 8.4) * 0.05),
            emberScale * (1.08 + auraEnergy * 0.08)
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
    backgroundColor: "#392b61",
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
      pendingSpeechBubble?.remove(false);
      pendingSpeechBubble = null;
      shadow = null;
      flash = null;
      comboPopup?.destroy();
      comboPopup = null;
      if (comboPopupTextureKey && game.textures.exists(comboPopupTextureKey)) {
        game.textures.remove(comboPopupTextureKey);
      }
      comboPopupTextureKey = null;
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
      if (
        speechBubbleTextureKey &&
        game.textures.exists(speechBubbleTextureKey)
      ) {
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
