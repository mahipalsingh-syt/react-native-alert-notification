import { Dimensions } from 'react-native';

const WINDOWS = Dimensions.get('window');
const WIDTH = WINDOWS.width;
const HEIGHT = WINDOWS.height;

export const colors = {
  green10: '#19A04B',
  yellow10: '#E99921',
  red10: '#EB4B4B',
  grey10: '#A3A9B9',
  grey20: '#707374',
  green20: '#90D6AA',
  green30: '#DFFBE8',
};

enum ACTION {
  OPEN,
  CLOSE,
}

enum ALERT_TYPE {
  SUCCESS = 'SUCCESS',
  DANGER = 'DANGER',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

enum TOAST_POSITION {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

const ENV = {
  AUTO_CLOSE: 5000,
  WINDOWS: {
    WIDTH,
    HEIGHT,
  },
  COLORS: {
    label: {
      ios: 'label',
      android: ['@android:color/primary_text_light', '@android:color/primary_text_dark'],
      default: ['rgb(229,229,231)', 'rgb(32,32,35)'],
    },
    card: {
      ios: 'systemGray6',
      android: ['@android:color/background_light', '@android:color/background_dark'],
      default: ['rgb(216,216,220)', 'rgb(54,54,56)'],
    },
    overlay: {
      ios: 'black',
      android: ['@android:color/background_dark', '@android:color/background_dark'],
      default: ['#000000', '#000000'],
    },
    success: {
      ios: 'systemGreen',
      android: ['@android:color/holo_green_light', '@android:color/holo_green_dark'],
      default: ['#19A04B', '#19A04B'],
    },
    danger: {
      ios: 'systemRed',
      android: ['@android:color/holo_red_light', '@android:color/holo_red_dark'],
      default: ['#EB4B4B', '#EB4B4B'],
    },
    warning: {
      ios: 'systemOrange',
      android: ['@android:color/holo_orange_light', '@android:color/holo_orange_dark'],
      default: ['#E99921', '#E99921'],
    },
    info: {
      ios: 'systemBlue',
      android: ['@android:color/holo_blue_light', '@android:color/holo_blue_dark'],
      default: ['rgb(80,122,189)', 'rgb(80,122,190)'],
    },
  },
};

export { ENV, ALERT_TYPE, TOAST_POSITION, ACTION };
