export const COLORS = {
    primary: '#8878fd',
    primaryDark: '#6351ea',
    secondary: '#f5f3ff',
    white: '#ffffff',
    black: '#000000',
    text: '#4f4c62',
    textLight: '#7e7b90',
    muted: '#e5e3f1',
    error: '#f32222',
    success: '#2a793d',
    warning: '#e49526',
    background: '#ffffff',
  };

  export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    largeTitle: 40,
    h1: 30,
    h2: 22,
    h3: 18,
    h4: 16,
    h5: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,
  };

  export const FONTS = {
    largeTitle: { fontFamily: 'Inter-Bold', fontSize: SIZES.largeTitle },
    h1: { fontFamily: 'Inter-Bold', fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: 'Inter-Bold', fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.h4, lineHeight: 22 },
    h5: { fontFamily: 'Inter-SemiBold', fontSize: SIZES.h5, lineHeight: 22 },
    body1: { fontFamily: 'Inter-Regular', fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: 'Inter-Regular', fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: 'Inter-Regular', fontSize: SIZES.body4, lineHeight: 22 },
    body5: { fontFamily: 'Inter-Regular', fontSize: SIZES.body5, lineHeight: 22 },
  };

  const appTheme = { COLORS, SIZES, FONTS };

  export default appTheme;
