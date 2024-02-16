import { Platform } from 'react-native';
export const testProps = (testId: any) => {
  return Platform.OS === 'android' ? { accessible: true, accessibilityLabel: testId, testID: testId } : { testID: testId }; // accessible: true  Platform.OS === "android" ? { accessibilityLabel: testId,testID: testId  } //: { testID: testId }
};
