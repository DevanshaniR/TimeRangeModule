
import { FuncUtils } from '../../../../utills';
import {
  DEFAULT_TIME_VALUE, TIME_LABEL, TIME_VALIDATION_MAX_CUT_OFF,
  TIME_VALIDATION_MIN_CUT_OFF
} from '../components/constants';
/**
 * convert hours to 12 hour format
 * @param {*} hours 
 */
const convert12HourFormat = (hours) => {
  if (hours > 12) {
    return hours - 12;
  }
  return hours;
};

/**
 * get AM/PM configuration
 */
const getAmPmConfig = (screen_context, is_from_start) => {
  if (screen_context.state.is_selected_start_am && is_from_start) {
    return TIME_LABEL.AM.toLowerCase();
  } else if (screen_context.state.is_selected_start_pm && is_from_start) {
    return TIME_LABEL.PM.toLowerCase();
  } else if (screen_context.state.is_selected_end_am && !is_from_start) {
    return TIME_LABEL.AM.toLowerCase();
  } else if (screen_context.state.is_selected_end_pm && !is_from_start) {
    return TIME_LABEL.PM.toLowerCase();
  } else {
    return 1;
  }
};
/**
 * validate start time and main agent start time & show error msg
 * @param {*} userInput 
 * @param {*} agentTime 
 * @param {*} screen_context 
 * @param {*} error_msg 
 */
const compareStartTime = (userInput, screen_context) => {

  const { app_accessing_time_data = {} } = screen_context.props;
  const { agent_access_start_ts = null, agent_access_end_ts = null, validation_errors = {} } = app_accessing_time_data;
  const { invalid_start_ts = '', invalid_end_ts = '' } = validation_errors;

  console.log('compareStartTime :: 1', userInput);
  let userInput1 = userInput.split(':');
  let start_time = agent_access_start_ts.split(':');
  let end_time = agent_access_end_ts.split(':');
  if (start_time[0] < end_time[0]) {
    if (userInput1[0] < start_time[0]) {
      console.log('compareStartTime :: 2 :: input less than start time :: hours');
      screen_context.setState({ start_error_msg: invalid_start_ts });
    } else if (userInput1[0] == start_time[0] && userInput1[1] < start_time[1]) {
      console.log('compareStartTime :: 3 :: equal hours & input minutes less than start minutes');
      screen_context.setState({ start_error_msg: invalid_start_ts });
    } else if (userInput1[0] > end_time[0]) {
      console.log('compareStartTime :: 4 :: input greater than end time:: hours');
      screen_context.setState({ start_error_msg: invalid_end_ts });
    } else if (userInput1[0] == end_time[0] && userInput1[1] > end_time[1]) {
      console.log('compareStartTime :: 5 :: input equal hours :: input minutes greater end minutes');
      screen_context.setState({ start_error_msg: invalid_end_ts });
    } else {
      console.log('compareStartTime :: 6 :: DEFAULT');
      screen_context.setState({ start_error_msg: "" });
    }
  } else {
    let is_valid_time = validateTime(userInput1[0], start_time[0], end_time[0]);
    if (!is_valid_time) {
      console.log('compareStartTime :: 7 :: is_valid_time', is_valid_time);
      screen_context.setState({ start_error_msg: invalid_start_ts });
    } else {
      console.log('compareStartTime :: 8 :: is_valid_time', is_valid_time);
      screen_context.setState({ start_error_msg: "" });
    }
  }
};

/**
 * validate end time with main agent time & show error msg
 * @param {*} userInput 
 * @param {*} agentTime 
 * @param {*} screen_context 
 * @param {*} error_msg 
 */
const compareEndTime = (userInput, screen_context) => {

  const { app_accessing_time_data = {} } = screen_context.props;
  const { agent_access_end_ts = null, agent_access_start_ts = null, validation_errors = {} } = app_accessing_time_data;
  const { invalid_end_ts = '' } = validation_errors;

  let userInput1 = userInput.split(':');
  let start_time = agent_access_start_ts.split(':');
  let end_time = agent_access_end_ts.split(':');
  if (start_time[0] < end_time[0]) {
    if (userInput1[0] > end_time[0]) {
      console.log('compareEndTime :: 2');
      screen_context.setState({ end_error_msg: invalid_end_ts });
    } else if (userInput1[0] == end_time[0] && userInput1[1] > end_time[1]) {
      console.log('compareEndTime :: 3');
      screen_context.setState({ end_error_msg: invalid_end_ts });
    } else {
      console.log('compareEndTime :: 4');
      screen_context.setState({ end_error_msg: "" });
    }
  } else {
    let is_valid_time = validateTime(userInput1[0], start_time[0], end_time[0]);
    if (!is_valid_time) {
      console.log('compareEndTime :: 5', is_valid_time);
      screen_context.setState({ end_error_msg: invalid_end_ts });
    } else {
      console.log('compareEndTime :: 6', is_valid_time);
      screen_context.setState({ end_error_msg: "" });
    }
  }
};

/**
 * validate user input time if agent start time > agent end time
 * @param {*} user_input 
 * @param {*} min_value 
 * @param {*} max_value 
 * @param {*} error_msg 
 * @param {*} screen_context 
 */
const validateTime = (user_input, min_value, max_value) => {
  let is_valid_time = false;
  console.log('validateTime :: 1 :: ', user_input <= TIME_VALIDATION_MAX_CUT_OFF);
  console.log('validateTime :: 2 :: ', user_input > min_value);
  console.log('validateTime :: 3 :: ', user_input >= TIME_VALIDATION_MIN_CUT_OFF);
  console.log('validateTime :: 4 :: ', user_input, max_value, user_input < max_value);
  if ((user_input <= TIME_VALIDATION_MAX_CUT_OFF && user_input >= min_value) ||
    (user_input >= TIME_VALIDATION_MIN_CUT_OFF && user_input <= max_value)) {
    is_valid_time = true;
  }
  return is_valid_time;
};


/**
 * disable ok button logic in app access time modal
 * @param {*} screen_context 
 */
const disableOkButton = (screen_context) => {
  let disable_ok_button = true;
  if (parseInt(screen_context.state.start_hours) > 0 && parseInt(screen_context.state.end_hours) > 0
    && checkAmPmSelected(screen_context) && screen_context.state.start_error_msg == '' && screen_context.state.end_error_msg == '') {
    disable_ok_button = false;
  }
  return disable_ok_button;
};

/**
 * check AM or PM selected to validate start and end time
 * @param {*} screen_context 
 */
const checkAmPmSelected = (screen_context) => {
  let is_selected_am_pm = false;
  if ((screen_context.state.is_selected_start_am || screen_context.state.is_selected_start_pm) &&
    (screen_context.state.is_selected_end_am || screen_context.state.is_selected_end_pm)) {
    is_selected_am_pm = true;
  }
  return is_selected_am_pm;
};

/**
 * check  empty minutes
 * @param {*} minutes 
 */
const isEmptyMinutes = (minutes) => {
  console.log('isEmptyMinutes 1', minutes);
  let format_minutes = DEFAULT_TIME_VALUE;
  if (!FuncUtils.isEmpty(minutes) && parseInt(minutes) > 0) {
    console.log('isEmptyMinutes 2');
    format_minutes = parseInt(minutes) < 10 ? '0' + parseInt(minutes) : parseInt(minutes);
  }
  console.log('isEmptyMinutes 3', format_minutes);
  return format_minutes;
};

/**
 * validate minute text input
 * @param {*} newMinutesFromInput 
 */
const validateMinuteInput = (newMinutesFromInput) => {
  if (newMinutesFromInput > 59) {
    console.log('validateMinuteInput 2');
    return DEFAULT_TIME_VALUE;
  } else {
    return newMinutesFromInput;
  }
};

/**
 * validate hour text input
 * @param {*} newHoursFromInput 
 */
const validateHourInput = (newHoursFromInput) => {
  if (parseInt(newHoursFromInput) > 24) {
    console.log('validateHourInput');
    return 12;
  } else {
    return convert12HourFormat(newHoursFromInput);
  }
};

/**
 * reset start time hour,minute,AM/PM data
 * @param {*} screen_context 
 */
const resetStartTimeData = (screen_context) => {
  screen_context.setState({
    start_error_msg: "",
    is_selected_start_am: false,
    is_selected_start_pm: false,
    start_minutes: DEFAULT_TIME_VALUE
  });
};

/**
 * reset end time hour,minute,AM/PM data
 * @param {*} screen_context 
 */
const resetEndTimeData = (screen_context) => {
  screen_context.setState({
    end_error_msg: "",
    is_selected_end_am: false,
    is_selected_end_pm: false,
    end_minutes: DEFAULT_TIME_VALUE
  });
};

/**
 * check agent start time & end time is valid or not
 * @param {*} time 
 */
const isValidAgentStartEndTime = (time) => {
  let is_valid_time = false;
  if (!FuncUtils.isNullOrUndefined(time) && !FuncUtils.isEmpty(time)) {
    is_valid_time = true;
  }
  return is_valid_time;
};

/**
 * separate hours,minutes,AM/PM in 12h format
 * @param {*} time 
 */
const separateTimeIn12h = (time) => {
  console.log('### separateTimeIn12h :: getTime12h -', time);
  let time_separation_data = {
    hours: 0,
    minutes: 0,
    is_am: false,
    is_pm: false
  };
  if (isValidAgentStartEndTime(time)) {
    let time1 = time.split(':');
    let hours = time1[0];
    let minutes = time1[1];
    let am_pm = parseInt(hours) >= 12 ? TIME_LABEL.PM : TIME_LABEL.AM;
    hours = parseInt(hours) % 12;
    hours = hours ? hours : 12;
    minutes = parseInt(minutes) < 10 ? '0' + parseInt(minutes) : parseInt(minutes);
    hours = hours < 10 ? '0' + hours : hours;
    time_separation_data = {
      hours: hours,
      minutes: minutes,
      is_am: (am_pm === TIME_LABEL.AM) ? true : false,
      is_pm: (am_pm === TIME_LABEL.PM) ? true : false,
      am_pm: am_pm
    };
  }
  console.log('### separateTimeIn12h :: time_separation_data => ', time_separation_data);
  return time_separation_data;
};

/**
 * format display time to update redux
 * @param {*} time 
 */
const formatUiDisplayTime = (time) => {
  let time_obj = separateTimeIn12h(time);
  return time_obj.hours + ':' + time_obj.minutes + ' ' + time_obj.am_pm;
};

/**
 * format display start and end time to show in Add and Edit view
 * @param {*} time 
 */
const formatUiDisplayStartEndTime = (start_time, end_time) => {
  return start_time + ' to ' + end_time;
};


export {
  getAmPmConfig,
  compareStartTime,
  compareEndTime,
  disableOkButton,
  isEmptyMinutes,
  validateMinuteInput,
  validateHourInput,
  resetStartTimeData,
  resetEndTimeData,
  isValidAgentStartEndTime,
  separateTimeIn12h,
  formatUiDisplayTime,
  formatUiDisplayStartEndTime
};
