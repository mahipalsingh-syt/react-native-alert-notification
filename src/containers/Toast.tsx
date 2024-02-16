import * as React from 'react';
import { Animated, Image, Pressable, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
// import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ACTION, ALERT_TYPE, ENV, colors } from '../config/ENV';
import { Color, getImage, testProps, SIZES } from '../service';
import Icon from 'react-native-vector-icons/AntDesign';

export type IConfigToast = {
  autoClose?: number | boolean;

  type?: ALERT_TYPE;
  title?: string;
  textBody?: string;
  titleStyle?: StyleProp<TextStyle>;
  textBodyStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
  onShow?: () => void;
  onHide?: () => void;
  isAssessment?: boolean;
  startNewAssessment?: string;
  assessmentToastText?: string;
};

type IProps = {
  isDark: boolean;
  config?: Pick<IConfigToast, 'autoClose' | 'titleStyle' | 'textBodyStyle'>;
};

type IState = {
  styles: ReturnType<typeof __styles>;
  cardHeight: number;
  overlayClose?: boolean;
  visible: boolean;
  config?: IConfigToast;
  data: null | (IConfigToast & { timeout: number });
};

export class Toast extends React.Component<IProps, IState> {
  /**
   * @type {React.RefObject<Toast>}
   */
  public static instance: React.RefObject<Toast> = React.createRef();

  /**
   * @param {IConfigToast} args
   */
  public static show = (args: IConfigToast): void => {
    Toast.instance.current?._open(args);
  };

  /**
   *
   */
  public static hide = (): void => {
    Toast.instance.current?._close();
  };

  /**
   * @type {React.ContextType<typeof SafeAreaInsetsContext>}
   */
  // public context!: React.ContextType<typeof SafeAreaInsetsContext>;

  /**
   * @type {Animated.Value}
   * @private
   */
  private _positionToast: Animated.Value;

  /**
   * @type {number}
   * @private
   */
  private _cardHeight: number;

  /**
   * @type {NodeJS.Timeout}
   * @private
   */
  private _timeout?: any;

  /**
   * @param {IProps} props
   * @param {React.ContextType<typeof SafeAreaInsetsContext>} context
   */
  constructor(props: IProps) {
    super(props);
    this._cardHeight = 0;
    this._positionToast = new Animated.Value(-500);
    this.state = {
      styles: __styles(props.isDark),
      visible: false,
      cardHeight: 0,
      data: null,
    };
  }

  /**
   * @param {Readonly<IProps>} prevProps
   */
  public componentDidUpdate = (prevProps: Readonly<IProps>): void => {
    if (prevProps.isDark !== this.props.isDark) {
      this.setState((prevState) => ({
        ...prevState,
        styles: __styles(this.props.isDark),
      }));
    }
  };

  /**
   * @param {IConfigToast} args
   * @return {Promise<void>}
   */
  private _open = async (data: IConfigToast): Promise<void> => {
    if (this.state.visible) {
      clearTimeout(this._timeout);
      this._startAnimation(ACTION.CLOSE);
    }

    this._positionToast = new Animated.Value(-500);

    this.setState({ visible: true, config: data });

    this._startAnimation(ACTION.OPEN);

    const autoClose = data.autoClose ?? this.props.config?.autoClose;
    if (autoClose || autoClose === undefined) {
      const duration = typeof autoClose === 'number' ? autoClose : ENV.AUTO_CLOSE;
      this._timeout = setTimeout(() => this._close(), duration);
    }

    this.state.data?.onShow?.();
  };

  /**
   * @return {Promise<void>}
   */
  private _close = () => {
    this._startAnimation(ACTION.CLOSE);
    const onHide = this.state.config?.onShow;
    this.setState((prevState) => ({ ...prevState, visible: false, config: undefined }));
    onHide?.();
  };

  /**
   * @param {ACTION} action
   * @return {Promise<void>}
   */
  private _startAnimation = (action: ACTION) => {
    Animated.timing(this._positionToast, {
      toValue: action === ACTION.OPEN ? this.context?.top ?? 0 : -this._cardHeight,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  /**
   * @return {JSX.Element}
   */
  private CardRender = (): any => {
    const { styles } = this.state;
    if (this.state.config) {
      const { type, title, textBody, onPress, onLongPress, isAssessment, assessmentToastText, startNewAssessment } = this.state.config;
      return (
        <Animated.View
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => (this._cardHeight = height)}
          style={StyleSheet.flatten([styles.cardRow, { transform: [{ translateY: this._positionToast }] }])}
        >
          {isAssessment ? (
            <Pressable style={styles.assessmentCard}>
              <Image source={require('../assets/circleIcon.png')} style={styles.tickIcon} />
              <Text style={styles.textMessage}>
                {assessmentToastText}
                <Text style={styles.startAssessmentText}> {startNewAssessment}</Text>
              </Text>
              <Pressable onPress={this._close}>
                <Icon name={'close'} size={SIZES(12)} style={{ color: colors.grey20 }} />
              </Pressable>
            </Pressable>
          ) : (
            <Pressable style={styles.cardContainer} onPress={onPress} onLongPress={onLongPress}>
              {type && (
                <>
                  <View style={styles.backendImage} />
                  <Image source={getImage(type)} resizeMode="contain" style={StyleSheet.flatten([styles.image, styles[`${type}Image`]])} />
                </>
              )}
              <View accessible style={styles.toasttileContainer}>
                {title !== undefined && (
                  <Text {...testProps('Toast_Title')} style={styles.titleLabel}>
                    {title}
                  </Text>
                )}
                {textBody !== undefined && (
                  <Text {...testProps('Toast_Body')} style={styles.descLabel}>
                    {textBody}
                  </Text>
                )}
              </View>
            </Pressable>
          )}
        </Animated.View>
      );
    }
    return <></>;
  };

  /**
   * @return {JSX.Element}
   */
  public render = (): any => {
    const { visible } = this.state;
    const { CardRender } = this;
    if (!visible) {
      return <></>;
    }
    return <CardRender />;
  };
}

const __styles = (isDark: boolean) =>
  StyleSheet.create({
    backgroundContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#00000070',
    },

    container: {
      position: 'absolute',
      backgroundColor: '#00000030',
      top: 0,
      left: 0,
      right: 0,
    },

    cardRow: {
      zIndex: 9999,
      position: 'absolute',
      left: 0,
      right: 0,
    },

    cardContainer: {
      flexDirection: 'row',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 12,
      marginHorizontal: 12,
      marginBottom: 12,
      backgroundColor: Color.get('card', isDark),
    },
    toasttileContainer: { overflow: 'hidden', flex: 1 },

    titleLabel: {
      fontWeight: 'bold',
      fontSize: 18,
      color: Color.get('label', isDark),
    },
    descLabel: {
      color: Color.get('label', isDark),
    },
    backendImage: {
      position: 'absolute',
      alignSelf: 'center',
      height: 12,
      width: 12,
      backgroundColor: '#FBFBFB',
      borderRadius: 100,
      left: 12 + 7,
    },
    image: {
      alignSelf: 'center',
      width: 25,
      aspectRatio: 1,
      marginRight: 12,
    },

    assessmentCard: {
      width: '92%',
      flexDirection: 'row',
      borderRadius: SIZES(5),
      paddingVertical: 12,
      backgroundColor: colors.green30,
      borderWidth: SIZES(0.5),
      borderColor: colors.green20,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    tickIcon: {
      width: SIZES(18),
      height: SIZES(18),
    },
    textMessage: {
      width: '80%',
      marginHorizontal: SIZES(8),
      // fontFamily: fontFamily.regular,
      fontSize: SIZES(12),
      alignSelf: 'center',
    },
    startAssessmentText: {
      fontWeight: 'bold',
    },

    [`${ALERT_TYPE.SUCCESS}Image`]: {
      tintColor: Color.get('success', isDark),
    },
    [`${ALERT_TYPE.DANGER}Image`]: {
      tintColor: Color.get('danger', isDark),
    },
    [`${ALERT_TYPE.WARNING}Image`]: {
      tintColor: Color.get('warning', isDark),
    },
  });

export default Toast;
