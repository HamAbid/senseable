import { ColorPalette } from '../types';

export const defaultColorPalette: ColorPalette = {
  'not-familiar': '#FF6B6B',
  'somewhat-familiar': '#FFD93D',
  'familiar': '#6BCF7F'
};

export const colorblindPalette: ColorPalette = {
  'not-familiar': '#0173B2',
  'somewhat-familiar': '#DE8F05',
  'familiar': '#029E73'
};

export const highContrastPalette: ColorPalette = {
  'not-familiar': '#000000',
  'somewhat-familiar': '#555555',
  'familiar': '#AAAAAA'
};

export const dyslexiaPalette: ColorPalette = {
  'not-familiar': '#E63946',
  'somewhat-familiar': '#F4A261',
  'familiar': '#2A9D8F'
};

export const getColorPalette = (accessibilityNeed: string): ColorPalette => {
  switch (accessibilityNeed) {
    case 'colorblind':
      return colorblindPalette;
    case 'dyslexia':
      return dyslexiaPalette;
    case 'low-vision':
      return highContrastPalette;
    default:
      return defaultColorPalette;
  }
};

export const colorPaletteOptions = [
  { label: 'Default', value: 'default', palette: defaultColorPalette },
  { label: 'Colorblind-Friendly', value: 'colorblind', palette: colorblindPalette },
  { label: 'High Contrast', value: 'highContrast', palette: highContrastPalette },
  { label: 'Dyslexia-Friendly', value: 'dyslexia', palette: dyslexiaPalette }
];
