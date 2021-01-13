import { UxStyleUtils } from '../../../../utills';

export const TEXT_INPUT_WIDTH = 96;
export const TEXT_INPUT_HEIGHT = 80;
export const AM_PM_SWITCHER_WIDTH = 50;
export const HOUR_MINUTE_SEPARATOR_WIDTH = 24;
export const INPUT_SWITCHER_SEPARATOR_WIDTH = 10;
export const TIME_LABEL = {
  AM: "AM",
  PM: "PM"
};
export const DEFAULT_TIME_VALUE = '00';
export const HOUR_HELPER_TEXT = 'Hour';
export const MINUTE_HELPER_TEXT = 'Minute';
export const TIME_VALIDATION_MIN_CUT_OFF = 0;
export const TIME_VALIDATION_MAX_CUT_OFF = 24;

export const MODAL_WIDTH = UxStyleUtils.getDeviceWidth() * 0.9 > 342 ? 342 : UxStyleUtils.getDeviceWidth() * 0.9;
export const MODAL_MIN_HEIGHT = 400;
