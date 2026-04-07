import Phaser from "phaser";
import { playHitSound } from "../lib/sounds";
import type { AvatarGender } from "../types";

const avatarBodyAssetUrl = `${import.meta.env.BASE_URL}avatar/body/body.png`;
const gloveAssetUrl = `${import.meta.env.BASE_URL}glove.png`;
const avatarHairAssetUrls = {
  boy: `${import.meta.env.BASE_URL}avatar/hair/boy_hair.png`,
  girl: `${import.meta.env.BASE_URL}avatar/hair/girl_hair.png`,
} as const;
const avatarFaceAssetUrls = {
  angry: `${import.meta.env.BASE_URL}avatar/face/face_angry.png`,
  crying: `${import.meta.env.BASE_URL}avatar/face/face_crying.png`,
  furious: `${import.meta.env.BASE_URL}avatar/face/face_furious.png`,
  sad: `${import.meta.env.BASE_URL}avatar/face/face_sad.png`,
  smile: `${import.meta.env.BASE_URL}avatar/face/face_smile.png`,
  smug: `${import.meta.env.BASE_URL}avatar/face/face_smug.png`,
  surprised: `${import.meta.env.BASE_URL}avatar/face/face_surprised.png`,
  tearyShocked: `${import.meta.env.BASE_URL}avatar/face/face_teary_shocked.png`,
  worried: `${import.meta.env.BASE_URL}avatar/face/face_worried.png`,
  tearful: `${import.meta.env.BASE_URL}avatar/face/face_tearful.png`,
  sobbing: `${import.meta.env.BASE_URL}avatar/face/face_sobbing.png`,
  verySad: `${import.meta.env.BASE_URL}avatar/face/face_very_sad.png`,
} as const;
const AVATAR_BODY_WIDTH = 154;
const AVATAR_BODY_HEIGHT = 230;
const AVATAR_FACE_WIDTH = 172;
const AVATAR_FACE_HEIGHT = 124;
const AVATAR_HAIR_GIRL_WIDTH = 352;
const AVATAR_HAIR_GIRL_HEIGHT = 226;
const AVATAR_HAIR_BOY_WIDTH = 308;
const AVATAR_HAIR_BOY_HEIGHT = 207;
const AVATAR_BODY_OFFSET_X = 3;
const AVATAR_BODY_OFFSET_Y = 44;
const AVATAR_FACE_OFFSET_Y = -116;
const AVATAR_HAIR_OFFSET_X = 0;
const AVATAR_HAIR_OFFSET_Y = -129;
const GLOVE_WIDTH = 110;
const FINAL_REACTION_LINE = "제가 졌어요...";
const HIT_REACTION_LINES = {
  defiant: [
    "악!",
    "왜 때려!",
    "아파!",
    "너무하네!",
    "그만 좀!",
    "으악!",
    "아, 왜 이래요 진짜!",
    "말로 하시죠, 거참!",
    "너무하신 거 아니에요?",
    "아직 전 쌩쌩하거든요?",
    "겨우 이 정도예요?",
    "제가 뭘 그렇게 잘못했다고!",
    "억울해 죽겠네, 진짜!",
    "이거 폭력이에요, 폭력!",
    "에이, 하나도 안 아픈데?",
    "적당히 좀 하시죠!",
    "지금 저랑 해보자는 거예요?",
    "속이 좁으시네!",
    "이거 신고할 거예요, 진짜!",
    "어쭈? 좀 치시나 본데?",
    "누가 보면 제가 잘못한 줄 알겠네!",
    "아이 참, 거슬리게 진짜!",
    "적당히 하고 대화로 합시다!",
    "어머, 힘이 이것뿐이에요?",
    "농담도 못 하나요, 참나!",
  ],
  defensive: [
    "잠깐만요!",
    "제 말도 들어보세요!",
    "한 번만 봐주세요!",
    "제가 설명할게요!",
    "진정해요!",
    "잠깐만! 타임, 타임!",
    "오해가... 오해가 있다고요!",
    "아니, 제 말 좀 들어보라니까요?",
    "그게 그러니까... 사정이 있었어요!",
    "악! 아까보다 세진 거 같은데?",
    "진정하시고 차나 한잔...",
    "아니, 제가 다 그런 건 아니고!",
    "잠시만요! 뼈 맞았어요, 방금!",
    "아아! 방금 건 좀 아픈데?!",
    "잠깐, 제 머리 조심해 주세요!",
    "아까 그건 농담이었어요, 농담!",
    "살살해요, 저 터지면 어떡해요!",
    "저기... 제가 커피라도 한 잔 살까요?",
    "악! 제 소중한 옆구리가...!",
    "말씀 중에 죄송한데, 진짜 아파요!",
    "오해가 깊어도 너무 깊으시네!",
    "잠깐만요! 저 숨 좀 돌릴게요!",
  ],
  apologetic: [
    "죄송합니다.",
    "제가 잘못했어요.",
    "다시는 안 그럴게요.",
    "진짜 반성 중이에요.",
    "제가 실수했어요.",
    "변명 안 할게요.",
    "한 번만 기회 주세요.",
    "잘못했어요... 진짜로요!",
    "다신 안 그럴게요, 제발!",
    "제가 경솔했습니다, 죽을죄를 졌어요!",
    "변명 안 할게요, 제가 다 나빠요!",
    "한 번만 기회를 주세요, 예?",
    "이제야 제 잘못을 깨달았어요...",
    "진심으로 반성하고 있습니다!",
    "제가 선을 세게 넘었네요, 죄송해요!",
    "제가 죽을죄를 졌습니다",
    "진심으로 반성 중입니다! 멈춰주세요!",
    "제가 생각이 짧았습니다! 제발요!",
    "한 번만, 딱 한 번만 용서해 주세요!",
    "이제야 제가 얼마나 나빴는지 알겠어요!",
    "제가 선을 넘어도 한참 넘었네요!",
    "제발 그만! 정신이 혼미해요...!",
    "앞으로는 착하게 살게요, 약속!",
    "다 제 탓입니다! 제가 다 망쳤어요!",
    "손이 발이 되도록 빌게요, 제발요!",
    "제가 감히 누굴 건드렸는지 깨달았습니다!",
  ],
  formal: [
    "진심으로 사과드립니다.",
    "제 잘못을 인정합니다.",
    "정말 죄송한 마음뿐입니다.",
    "깊이 반성하고 있습니다.",
    "다시는 같은 실수 하지 않겠습니다.",
    "제가 먼저 사과드리겠습니다.",
    "불편을 드려 죄송합니다.",
    "완전히 인정합니다... 제가 졌어요.",
    "깊이 반성하며 살겠습니다...",
    "이제 그만... 제발 놓아주세요.",
    "불편을 드려 정말 죄송합니다...",
    "저는 이제 가망이 없어요... 항복!",
    "잘못했습니다... 두 번 다시 안 그럴게요.",
    "너덜너덜해졌네요... 제가 다 잘못했습니다.",
    "반성문 100장 쓸게요! 진짜로!",
    "모든 잘못은 저에게 있습니다... 꽥.",
    "진심으로 사과드립니다. 용서해 주세요...",
    "이제 더 이상 버틸 힘도 없네요...",
    "잘못했습니다... 부디 노여움을 푸세요.",
    "반성하고 또 반성하겠습니다... 흑.",
    "오늘의 이 아픔, 평생 기억할게요.",
    "제가 경솔했습니다... 완전히 항복!",
    "이제 그만... 저 세상 갈 것 같아요...",
    "불편을 드려 대단히 죄송했습니다...",
    "모든 잘못을 시인합니다... 사죄드려요.",
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
  gender: AvatarGender,
  callbacks: Callbacks,
): AngerGameController {
  let anger = initialAnger;
  let hits = 0;
  let sceneRef: Phaser.Scene | null = null;
  let avatar: Phaser.GameObjects.Container | null = null;
  let avatarHitZone: Phaser.GameObjects.Zone | null = null;
  let avatarFace: Phaser.GameObjects.Image | null = null;
  let glove: Phaser.GameObjects.Image | null = null;
  let gloveBaseScaleX = 1;
  let gloveBaseScaleY = 1;
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
  let frontHeatAuraLeft: Phaser.GameObjects.Ellipse | null = null;
  let frontHeatAuraRight: Phaser.GameObjects.Ellipse | null = null;
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
  let pendingFaceReset: Phaser.Time.TimerEvent | null = null;
  let finishTriggered = false;
  let currentFaceKey: string | null = null;

  function getEmotionPhase() {
    const remainingRatio = Phaser.Math.Clamp(
      anger / Math.max(initialAnger, 1),
      0,
      1,
    );

    if (finishTriggered || remainingRatio <= 0.05) {
      return "finish" as const;
    }

    if (remainingRatio <= 0.35) {
      return "late" as const;
    }

    if (remainingRatio <= 0.7) {
      return "mid" as const;
    }

    return "early" as const;
  }

  function getIdleFaceKey() {
    const phase = getEmotionPhase();

    if (phase === "finish") {
      return "face-verySad";
    }

    if (phase === "late") {
      return Phaser.Math.RND.pick(["face-crying", "face-sobbing"]);
    }

    if (phase === "mid") {
      return Phaser.Math.RND.pick(["face-sad", "face-tearful"]);
    }

    return hits === 0
      ? Phaser.Math.RND.pick(["face-smug", "face-smile"])
      : "face-angry";
  }

  function getHitFaceKey() {
    const phase = getEmotionPhase();

    if (phase === "early") {
      return Phaser.Math.RND.pick(["face-surprised", "face-angry"]);
    }

    if (phase === "mid") {
      return "face-worried";
    }

    return "face-tearyShocked";
  }

  function setAvatarFace(nextFaceKey: string) {
    if (!avatarFace) {
      return;
    }

    if (currentFaceKey === nextFaceKey) {
      return;
    }

    currentFaceKey = nextFaceKey;
    avatarFace.setTexture(nextFaceKey);
  }

  function updateAvatarFace() {
    setAvatarFace(getIdleFaceKey());
  }

  function triggerHitFace() {
    if (!sceneRef || finishTriggered) {
      return;
    }

    pendingFaceReset?.remove(false);
    pendingFaceReset = null;
    setAvatarFace(getHitFaceKey());
    pendingFaceReset = sceneRef.time.delayedCall(190, () => {
      if (finishTriggered) {
        return;
      }

      updateAvatarFace();
      pendingFaceReset = null;
    });
  }

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
      700,
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
    const phase = getEmotionPhase();

    if (phase === "early") {
      return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.defiant);
    }

    if (phase === "mid") {
      return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.defensive);
    }

    if (phase === "late") {
      return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.apologetic);
    }

    return Phaser.Utils.Array.GetRandom(HIT_REACTION_LINES.formal);
  }

  function triggerFinalAnimation() {
    if (!sceneRef || !avatar || finishTriggered) {
      return;
    }

    finishTriggered = true;
    pendingFaceReset?.remove(false);
    pendingFaceReset = null;
    setAvatarFace("face-verySad");
    pendingSpeechBubble?.remove(false);
    pendingSpeechBubble = null;
    showSpeechBubble(FINAL_REACTION_LINE);
    starEnergy = 1.45;
    shakeEnergy = 0;
    megaSquashEnergy = 0;
    sceneRef.cameras.main.shake(240, 0.0065);

    if (nameplate) {
      sceneRef.tweens.add({
        targets: nameplate,
        alpha: 0.3,
        y: avatar.y + 10,
        duration: 260,
        ease: "Quad.easeOut",
      });
    }

    sceneRef.tweens.add({
      targets: avatar,
      angle: 18,
      x: centerX() + 18,
      y: centerY() + 8,
      duration: 260,
      ease: "Quad.easeOut",
      onComplete: () => {
        sceneRef?.tweens.add({
          targets: avatar,
          angle: 72,
          x: centerX() + 44,
          y: centerY() + 52,
          scaleX: avatarBaseScaleX * 0.88,
          scaleY: avatarBaseScaleY * 0.88,
          duration: 520,
          ease: "Cubic.easeInOut",
          onComplete: () => {
            sceneRef?.tweens.add({
              targets: avatar,
              x: centerX() + 48,
              y: centerY() + 56,
              duration: 240,
              ease: "Bounce.easeOut",
            });
          },
        });
      },
    });

    if (shadow) {
      sceneRef.tweens.add({
        targets: shadow,
        scaleX: 1.18,
        alpha: 0.34,
        duration: 380,
        ease: "Quad.easeOut",
      });
    }
  }

  function showComboPopup(
    labels: string[],
    color: string,
    fontSize: number,
    fontWeight: number,
  ) {
    if (!sceneRef) {
      return;
    }
    const scene = sceneRef;
    const label = Phaser.Utils.Array.GetRandom(labels);
    const startX = centerX() + Phaser.Math.Between(-26, 26);
    const startY = centerY() - Phaser.Math.Between(226, 252);
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
      fontWeight,
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
    comboPopup.setDepth(11);

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
        if (
          comboPopupTextureKey &&
          scene.textures.exists(comboPopupTextureKey)
        ) {
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
    speechBubble.setPosition(avatar.x + 44, avatar.y - 194);
    sceneRef.tweens.add({
      targets: speechBubble,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      y: avatar.y - 202,
      duration: 140,
      ease: "Back.easeOut",
    });
    sceneRef.tweens.add({
      targets: speechBubble,
      alpha: 0,
      scaleX: 0.97,
      scaleY: 0.97,
      y: avatar.y - 212,
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

  function groundY() {
    return centerY() + AVATAR_BODY_OFFSET_Y + AVATAR_BODY_HEIGHT / 2 - 5;
  }

  function updateStarsPosition() {
    if (!avatar || stars.length === 0) {
      return;
    }

    const cx = avatar.x;
    const cy = avatar.y - 188;
    const radiusX = 34;
    const radiusY = 14;

    stars.forEach((star, index) => {
      const angle = starOrbitAngle + index * ((Math.PI * 2) / stars.length);
      star.setPosition(
        cx + Math.cos(angle) * radiusX,
        cy + Math.sin(angle) * radiusY,
      );
    });
  }

  function layout() {
    avatar?.setPosition(centerX(), centerY());
    avatarHitZone?.setPosition(centerX(), centerY() - 6);
    glove?.setPosition(currentWidth() / 2, currentHeight() - 56);
    shadow?.setPosition(centerX(), groundY());
    flash?.setPosition(centerX(), centerY());
    nameplate?.setPosition(centerX(), centerY() - 126);
    speechBubble?.setPosition(centerX() + 44, centerY() - 194);
    heatAura?.setPosition(centerX(), centerY() - 16);
    emberAura?.setPosition(centerX(), centerY() - 40);
    updateStarsPosition();
  }

  function triggerGloveHit(targetX: number, targetY: number) {
    if (!sceneRef || !glove) {
      return;
    }

    const restX = currentWidth() / 2;
    const restY = currentHeight() - 56;
    const clampedTargetX = Phaser.Math.Clamp(targetX, 42, currentWidth() - 42);
    const clampedTargetY = Phaser.Math.Clamp(
      targetY,
      42,
      currentHeight() - 120,
    );

    sceneRef.tweens.killTweensOf(glove);
    glove.setPosition(restX, restY);
    glove.setScale(gloveBaseScaleX, gloveBaseScaleY);
    glove.setAngle(0);

    sceneRef.tweens.add({
      targets: glove,
      x: clampedTargetX,
      y: clampedTargetY,
      scaleX: gloveBaseScaleX * 1.04,
      scaleY: gloveBaseScaleY * 1.04,
      angle: Phaser.Math.Between(-18, 18),
      duration: 85,
      ease: "Cubic.easeOut",
      yoyo: false,
      onComplete: () => {
        sceneRef?.tweens.add({
          targets: glove,
          x: restX,
          y: restY,
          scaleX: gloveBaseScaleX,
          scaleY: gloveBaseScaleY,
          angle: 0,
          duration: 130,
          ease: "Quad.easeInOut",
        });
      },
    });
  }

  function triggerHit(targetX?: number, targetY?: number) {
    if (!sceneRef || !avatar || anger <= 0) {
      return;
    }

    if (typeof targetX === "number" && typeof targetY === "number") {
      triggerGloveHit(targetX, targetY);
    }

    const now = performance.now();
    const elapsedSinceLastHit = lastHitAt === 0 ? 420 : now - lastHitAt;
    lastHitAt = now;

    const cadenceStrength = Phaser.Math.Clamp(
      (420 - elapsedSinceLastHit) / 260,
      0,
      1,
    );
    comboStreak = elapsedSinceLastHit <= 190 ? comboStreak + 1 : 1;

    comboMomentum =
      elapsedSinceLastHit > 680
        ? 0.46
        : Phaser.Math.Clamp(
            comboMomentum * 0.62 + cadenceStrength * 0.9 + 0.24,
            0.46,
            1.45,
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
      1.8,
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

    if (anger <= 0) {
      triggerFinalAnimation();
      callbacks.onHit(anger, hits, impactStrength);

      if (!callbacks.isMuted()) {
        if (impactStrength >= 1.15) {
          playHitSound(Math.random() < 0.58 ? "medium" : "hard");
        } else if (impactStrength >= 0.82) {
          playHitSound("medium");
        } else {
          playHitSound("soft");
        }
      }

      return;
    }

    triggerHitFace();

    if (
      cadenceStrength > 0.78 &&
      impactStrength > 0.92 &&
      COMBO_FEEDBACK[comboStreak]
    ) {
      const comboFeedback = COMBO_FEEDBACK[comboStreak];
      showComboPopup(
        comboFeedback.labels,
        comboFeedback.color,
        comboFeedback.fontSize,
        comboFeedback.fontWeight,
      );
    }

    callbacks.onHit(anger, hits, impactStrength);

    if (!callbacks.isMuted()) {
      if (impactStrength >= 1.15) {
        playHitSound(Math.random() < 0.58 ? "medium" : "hard");
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
      super("arena");
    }

    preload() {
      this.load.image("avatar-body", avatarBodyAssetUrl);
      this.load.image("glove", gloveAssetUrl);
      this.load.image("avatar-hair-boy", avatarHairAssetUrls.boy);
      this.load.image("avatar-hair-girl", avatarHairAssetUrls.girl);
      this.load.image("face-angry", avatarFaceAssetUrls.angry);
      this.load.image("face-crying", avatarFaceAssetUrls.crying);
      this.load.image("face-furious", avatarFaceAssetUrls.furious);
      this.load.image("face-sad", avatarFaceAssetUrls.sad);
      this.load.image("face-smile", avatarFaceAssetUrls.smile);
      this.load.image("face-smug", avatarFaceAssetUrls.smug);
      this.load.image("face-surprised", avatarFaceAssetUrls.surprised);
      this.load.image("face-tearyShocked", avatarFaceAssetUrls.tearyShocked);
      this.load.image("face-worried", avatarFaceAssetUrls.worried);
      this.load.image("face-tearful", avatarFaceAssetUrls.tearful);
      this.load.image("face-sobbing", avatarFaceAssetUrls.sobbing);
      this.load.image("face-verySad", avatarFaceAssetUrls.verySad);
    }

    create() {
      sceneRef = this;

      const width = currentWidth();
      const height = currentHeight();

      this.cameras.main.setBackgroundColor("#392b61");

      this.add.rectangle(width / 2, height / 2, width, height, 0x392b61, 1);
      shadow = this.add.ellipse(centerX(), groundY(), 196, 34, 0x000000, 0.26);
      shadow.setDepth(0);
      heatAura = this.add.ellipse(
        centerX(),
        centerY() + 26,
        560,
        760,
        0xff4d4f,
        0,
      );
      heatAura.setDepth(5.4);
      heatAura.setBlendMode(Phaser.BlendModes.ADD);
      emberAura = this.add.ellipse(
        centerX(),
        centerY() + 6,
        400,
        560,
        0xffa24a,
        0,
      );
      emberAura.setDepth(5.5);
      emberAura.setBlendMode(Phaser.BlendModes.ADD);
      frontHeatAuraLeft = this.add.ellipse(
        centerX() - 96,
        centerY() + 28,
        86,
        240,
        0xff7b5e,
        0,
      );
      frontHeatAuraLeft.setDepth(6.2);
      frontHeatAuraLeft.setBlendMode(Phaser.BlendModes.ADD);
      frontHeatAuraRight = this.add.ellipse(
        centerX() + 96,
        centerY() + 28,
        86,
        240,
        0xff7b5e,
        0,
      );
      frontHeatAuraRight.setDepth(6.2);
      frontHeatAuraRight.setBlendMode(Phaser.BlendModes.ADD);
      flash = this.add.ellipse(centerX(), centerY(), 210, 210, 0xff4d4f, 0);
      flash.setDepth(2);
      glove = this.add.image(currentWidth() / 2, currentHeight() - 56, "glove");
      glove.setOrigin(0.5, 0.5);
      const gloveScale = GLOVE_WIDTH / glove.width;
      glove.setScale(gloveScale, gloveScale);
      gloveBaseScaleX = gloveScale;
      gloveBaseScaleY = gloveScale;
      glove.setDepth(8);
      const avatarBody = this.add.image(
        AVATAR_BODY_OFFSET_X,
        AVATAR_BODY_OFFSET_Y,
        "avatar-body",
      );
      avatarBody.setOrigin(0.5, 0.5);
      avatarBody.setDisplaySize(AVATAR_BODY_WIDTH, AVATAR_BODY_HEIGHT);
      const initialFaceKey = Phaser.Math.RND.pick(["face-smug", "face-smile"]);
      avatarFace = this.add.image(0, AVATAR_FACE_OFFSET_Y, initialFaceKey);
      avatarFace.setOrigin(0.5, 0.5);
      avatarFace.setDisplaySize(AVATAR_FACE_WIDTH, AVATAR_FACE_HEIGHT);
      const avatarHair = this.add.image(
        AVATAR_HAIR_OFFSET_X,
        AVATAR_HAIR_OFFSET_Y,
        gender === "boy" ? "avatar-hair-boy" : "avatar-hair-girl",
      );
      avatarHair.setOrigin(0.5, 0.5);
      avatarHair.setDisplaySize(
        gender === "boy" ? AVATAR_HAIR_BOY_WIDTH : AVATAR_HAIR_GIRL_WIDTH,
        gender === "boy" ? AVATAR_HAIR_BOY_HEIGHT : AVATAR_HAIR_GIRL_HEIGHT,
      );
      currentFaceKey = initialFaceKey;
      avatar = this.add.container(centerX(), centerY(), [
        avatarBody,
        avatarFace,
        avatarHair,
      ]);
      avatar.setSize(AVATAR_BODY_WIDTH, AVATAR_BODY_HEIGHT);
      avatar.setDepth(5);
      avatarHitZone = this.add
        .zone(centerX(), centerY() - 6, 256, 320)
        .setInteractive({ useHandCursor: true });
      avatarHitZone.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        triggerHit(pointer.worldX, pointer.worldY);
      });
      avatarBaseScaleX = 1;
      avatarBaseScaleY = 1;
      nameplateBg = this.add.graphics();
      nameplateTextureKey = `nameplate-${crypto.randomUUID()}`;
      const nameplateTexture = createTextTexture(
        this,
        nameplateTextureKey,
        nickname,
        "#ffffff",
        15,
        700,
      );
      if (!nameplateTexture) {
        return;
      }
      nameplateText = this.add.image(0, 0, nameplateTexture.key).setOrigin(0.5);
      nameplateText.setDisplaySize(
        nameplateTexture.width,
        nameplateTexture.height,
      );
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
      nameplate.setPosition(centerX(), centerY() - 30);
      nameplate.setDepth(7);
      speechBubbleBg = this.add.graphics();
      speechBubble = this.add.container(centerX() + 44, centerY() - 126, [
        speechBubbleBg,
      ]);
      updateSpeechBubbleLabel(HIT_REACTION_LINES.defiant[0]);
      speechBubble.setAlpha(0);
      speechBubble.setDepth(9);

      stars = [
        this.add.star(0, 0, 5, 7, 14, 0xffd84d, 1).setOrigin(0.5),
        this.add.star(0, 0, 5, 5, 10, 0xfff2a8, 1).setOrigin(0.5),
        this.add.star(0, 0, 5, 6, 12, 0xffc83a, 1).setOrigin(0.5),
      ];

      stars.forEach((star) => {
        star.setAlpha(0);
        star.setDepth(10);
      });
      updateStarsPosition();

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

          if (finishTriggered) {
            updateStarsPosition();
            return;
          }

          avatar.setPosition(centerX() + offsetX, centerY() + offsetY);
          avatarHitZone?.setPosition(avatar.x, avatar.y - 6);
          avatar.setAngle(rotate);
          avatar.setScale(
            avatarBaseScaleX * squashX * megaSquashX,
            avatarBaseScaleY * squashY * megaSquashY,
          );

          if (nameplate) {
            nameplate.setPosition(avatar.x, avatar.y - 10 + offsetY * 0.12);
            nameplate.setRotation(Phaser.Math.DegToRad(rotate * 0.22));
            nameplate.setScale(1 + shakeEnergy * 0.015, 1 + shakeEnergy * 0.01);
          }

          if (speechBubble) {
            speechBubble.setPosition(
              avatar.x + 44 + offsetX * 0.14,
              avatar.y - 194 + offsetY * 0.08,
            );
          }
        }

        if (heatAura && emberAura && frontHeatAuraLeft && frontHeatAuraRight) {
          const pulse = 1 + Math.sin(shakeElapsed * 6.5) * 0.09;
          const heatScale = 1.02 + auraEnergy * 0.38;
          const emberScale = 1.04 + auraEnergy * 0.3;

          heatAura.setPosition(centerX(), centerY() + 34 - auraEnergy * 18);
          heatAura.setAlpha(Math.min(0.36, 0.08 + auraEnergy * 0.18));
          heatAura.setScale(
            (heatScale + 0.18) * pulse,
            (heatScale + auraEnergy * 0.42 + 0.34) * pulse,
          );

          emberAura.setPosition(centerX(), centerY() + 14 - auraEnergy * 20);
          emberAura.setAlpha(Math.min(0.3, 0.06 + auraEnergy * 0.16));
          emberAura.setScale(
            (emberScale + 0.18) * (1 + Math.cos(shakeElapsed * 8.4) * 0.08),
            (emberScale + 0.18) * (1.26 + auraEnergy * 0.22),
          );

          const frontPulse = 1 + Math.sin(shakeElapsed * 7.2) * 0.1;
          const frontY = centerY() + 30 - auraEnergy * 12;
          const frontScaleX = 0.92 + auraEnergy * 0.16;
          const frontScaleY = 1 + auraEnergy * 0.28;
          const frontAlpha = Math.min(0.24, 0.03 + auraEnergy * 0.13);

          frontHeatAuraLeft.setPosition(
            centerX() - (96 + auraEnergy * 8),
            frontY,
          );
          frontHeatAuraLeft.setAlpha(frontAlpha);
          frontHeatAuraLeft.setScale(
            frontScaleX * frontPulse,
            frontScaleY * frontPulse,
          );

          frontHeatAuraRight.setPosition(
            centerX() + (96 + auraEnergy * 8),
            frontY,
          );
          frontHeatAuraRight.setAlpha(frontAlpha);
          frontHeatAuraRight.setScale(
            frontScaleX * frontPulse,
            frontScaleY * frontPulse,
          );
        }

        if (shadow) {
          shadow.setPosition(centerX(), groundY());
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
      avatarHitZone = null;
      avatarFace = null;
      glove = null;
      pendingSpeechBubble?.remove(false);
      pendingSpeechBubble = null;
      pendingFaceReset?.remove(false);
      pendingFaceReset = null;
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
      frontHeatAuraLeft = null;
      frontHeatAuraRight = null;
      stars = [];
      finishTriggered = false;
      currentFaceKey = null;
    },
    resize,
  };
}
