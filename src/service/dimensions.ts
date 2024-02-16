import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
const guidelineBaseWidth = 360;
const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const normalize = (size: number) => scale(size);

export const SIZES = (value: number) => {
  return normalize(value);
};

export const fontFamily = {
  regular: 'NotoSans-Regular',
  semibold: 'NotoSans-SemiBold',
};
