/**
 * CatKub UI Design Tokens
 * Visual Direction: Cozy Cat Café
 * Target Viewport: 9:16 Portrait (Mobile first) & Centered Desktop Box
 */

export const UI_COLORS = Object.freeze({
  // Wood & Table
  woodLight: 0xf5debf,
  woodMid: 0xd99a54,
  woodDark: 0x8a5e43,
  woodDeep: 0x4c3030,
  woodDeepHex: '#4c3030',

  // Background & Cream Panels
  cream: 0xfff4dc,
  creamHex: '#fff4dc',
  creamSoft: 0xfff9ed,
  creamSoftHex: '#fff9ed',
  beigePill: 0xf8dfc1,
  beigePillHex: '#f8dfc1',
  panelBg: 0x3c2b21,
  panelBorder: 0xb57c56,

  // Feedback & State Accents
  accentGold: 0xffcb5c,
  accentGoldHex: '#ffcb5c',
  accentAmber: 0xf7c948,
  accentAmberHex: '#f7c948',
  greenSuccess: 0x67b887,
  greenSuccessHex: '#67b887',
  dangerCoral: 0xe66b5d,
  dangerCoralHex: '#e66b5d',
  pinkHeart: 0xf45b69,
  pinkHeartHex: '#f45b69',
  pinkSoft: 0xffb8c6,
  blueSubtle: 0x79a8d7,
  blueSubtleHex: '#79a8d7',

  // Text Colors
  textPrimary: '#4c3030',
  textSecondary: '#7b5b50',
  textLight: '#fff4dc',
  textMuted: '#c9ad98',
  textGold: '#ffcb5c',
});

export const UI_FONTS = Object.freeze({
  family: 'Mali, "Trebuchet MS", "Noto Sans Thai", cursive, sans-serif',
  familyFallback: '"Trebuchet MS", "Noto Sans Thai", sans-serif',
  
  sizes: Object.freeze({
    display: 72,
    h1: 48,
    h2: 34,
    h3: 26,
    bodyLarge: 24,
    body: 20,
    caption: 16,
    hudValue: 28,
    hudLabel: 18,
    badge: 14,
  }),

  styles: Object.freeze({
    regular: 'normal',
    bold: 'bold',
  }),
});

export const UI_SPACING = Object.freeze({
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
});

export const UI_SAFE_AREA = Object.freeze({
  // In a 1024x1024 canvas coordinate space:
  topMargin: 40,
  bottomMargin: 48,
  sideMargin: 36,
  
  // HUD Bar Coordinates (Top area)
  hudY: 42,
  hudHeight: 110,

  // Bottom prompt / instruction bar
  bottomPromptY: 940,

  // Table center
  tableCenter: { x: 512, y: 512 },
});

export const UI_DEPTH = Object.freeze({
  BACKGROUND: 0,
  TABLE_BACK: 10,
  CAT_STATE: 20,
  TABLE_FRONT: 30,
  BUTTONS: 40,
  BUTTON_FX: 50,
  CAT_FX: 60,
  HUD: 100,
  FLOATING_TEXT: 150,
  MODAL_OVERLAY: 200,
  MODAL_CONTENT: 210,
});

export const TOUCH_TARGET = Object.freeze({
  minHitRadius: 72,       // minimum circle hit area for mobile
  buttonVisualRadius: 66,  // visual radius
  hitAreaExpansion: 1.25,  // 25% larger hit area for fingers
});
