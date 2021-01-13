import React from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { Colors } from '../../../config/';
import { Screen, FormatUtils } from '../../../utills';
import TimeInputUIComponent from './components/TimeInputUIComponent';
import { DEFAULT_TIME_VALUE, TIME_LABEL, MODAL_WIDTH, MODAL_MIN_HEIGHT } from './components/constants';
import {
  getAmPmConfig, compareStartTime, compareEndTime, disableOkButton, isEmptyMinutes,
  validateMinuteInput, validateHourInput, resetStartTimeData, resetEndTimeData, isValidAgentStartEndTime
} from './Functions/commonFunctions';

class TimePickerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start_hours: parseInt(this.props.start_time_separation_data.hours) > 0 ? this.props.start_time_separation_data.hours : DEFAULT_TIME_VALUE,
      end_hours: parseInt(this.props.end_time_separation_data.hours) > 0 ? this.props.end_time_separation_data.hours : DEFAULT_TIME_VALUE,
      start_minutes: parseInt(this.props.start_time_separation_data.minutes) > 0 ? this.props.start_time_separation_data.minutes : DEFAULT_TIME_VALUE,
      end_minutes: parseInt(this.props.end_time_separation_data.minutes) > 0 ? this.props.end_time_separation_data.minutes : DEFAULT_TIME_VALUE,
      is_selected_start_pm: this.props.start_time_separation_data.is_pm,
      is_selected_start_am: this.props.start_time_separation_data.is_am,
      is_selected_end_am: this.props.end_time_separation_data.is_am,
      is_selected_end_pm: this.props.end_time_separation_data.is_pm,
      start_error_msg: '',
      end_error_msg: ''
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = () => {
    return true;
  }

  /**
   * on change text function for start hour input 
   * @param {*} newHoursFromInput 
   */
  onChangeStartHourInput = (newHoursFromInput) => {
    const { agent_access_start_ts = null } = this.props.app_accessing_time_data;
    let twelveHourTime = validateHourInput(newHoursFromInput);
    console.log('onChangeStartHourInput :: start_time :: ', twelveHourTime);
    this.setState({
      start_hours: twelveHourTime
    });
    if (getAmPmConfig(this, true) !== 1) {
      let start_time = twelveHourTime + ':' + isEmptyMinutes(this.state.start_minutes) + ' ' + getAmPmConfig(this, true);
      console.log('onChangeStartHourInput :: start_time', start_time);
      if (parseInt(twelveHourTime) > 0 && isValidAgentStartEndTime(agent_access_start_ts)) {
        console.log('onChangeStartHourInput :: twelveHourTime', twelveHourTime);
        let Hour24Time = FormatUtils.getTime24h(start_time);
        compareStartTime(Hour24Time, this);
      } else {
        console.log('onChangeStartHourInput :: RESET');
        resetStartTimeData(this);
      }
    } else {
      resetStartTimeData(this);
    }
  }

  /**
   * on change text function for end hour input 
   * @param {*} newHoursFromInput 
   */
  onChangeEndHourInput = (newHoursFromInput) => {
    const { agent_access_end_ts = null } = this.props.app_accessing_time_data;
    let twelveHourTime = validateHourInput(newHoursFromInput);
    console.log('onChangeEndHourInput :: end_time');
    this.setState({
      end_hours: twelveHourTime
    });
    if (getAmPmConfig(this, false) !== 1) {
      let end_time = twelveHourTime + ':' + isEmptyMinutes(this.state.end_minutes) + ' ' + getAmPmConfig(this, false);
      console.log('onChangeEndHourInput :: end_time', end_time);
      if (parseInt(twelveHourTime) > 0 && isValidAgentStartEndTime(agent_access_end_ts)) {
        let Hour24Time = FormatUtils.getTime24h(end_time);
        compareEndTime(Hour24Time, this);
      } else {
        resetEndTimeData(this);
      }
    } else {
      resetEndTimeData(this);
    }
  }

  /**
   * on change text function for start minute input 
   * @param {*} newMinutesFromInput 
   */
  onChangeStartMinuteInput = (newMinutesFromInput) => {
    const { agent_access_start_ts = null } = this.props.app_accessing_time_data;
    console.log('onChangeMinuteInput 1', newMinutesFromInput);
    let newMinutes = validateMinuteInput(newMinutesFromInput);
    console.log('onChangeMinuteInput :: start_minutes::newMinutes', newMinutes);
    this.setState({
      start_minutes: newMinutes
    });
    if (getAmPmConfig(this, true) !== 1) {
      let start_time = this.state.start_hours + ':' + isEmptyMinutes(newMinutes) + ' ' + getAmPmConfig(this, true);
      console.log('onChangeMinuteInput :: start_time', start_time);
      let Hour24Time = FormatUtils.getTime24h(start_time);
      if (parseInt(this.state.start_hours) > 0 && isValidAgentStartEndTime(agent_access_start_ts)) {
        compareStartTime(Hour24Time, this);
      }
    }
  }

  /**
   * on change text function for end minute input 
   * @param {*} newMinutesFromInput 
   */
  onChangeEndMinuteInput = (newMinutesFromInput) => {
    const { agent_access_end_ts = null } = this.props.app_accessing_time_data;
    console.log('onChangeMinuteInput 1', newMinutesFromInput);
    let newMinutes = validateMinuteInput(newMinutesFromInput);
    console.log('onChangeMinuteInput 3', newMinutes);
    this.setState({
      end_minutes: newMinutes
    });
    if (getAmPmConfig(this, false) !== 1) {
      let end_time = this.state.end_hours + ':' + isEmptyMinutes(newMinutes) + ' ' + getAmPmConfig(this, false);
      console.log('onChangeMinuteInput :: end_time', end_time);
      let Hour24Time = FormatUtils.getTime24h(end_time);
      if (parseInt(this.state.end_hours) > 0 && isValidAgentStartEndTime(agent_access_end_ts)) {
        compareEndTime(Hour24Time, this);
      }
    }
  }

  /**
   * function when select AM button in both start & end time
   * @param {*} is_from_start 
   */
  onPressAmButton = (is_from_start) => {
    const { agent_access_end_ts = null, agent_access_start_ts = null } = this.props.app_accessing_time_data;
    if (is_from_start) {
      this.setState({
        is_selected_start_am: true,
        is_selected_start_pm: false,
        start_minutes: isEmptyMinutes(this.state.start_minutes)
      });

      let start_time = this.state.start_hours + ':' + isEmptyMinutes(this.state.start_minutes) + ' ' + TIME_LABEL.AM.toLowerCase();
      console.log('onPressAmButton :: start_time', start_time);
      let Hour24Time = FormatUtils.getTime24h(start_time);
      if (isValidAgentStartEndTime(agent_access_start_ts)) {
        compareStartTime(Hour24Time, this);
      }

    } else {
      this.setState({
        is_selected_end_am: true,
        is_selected_end_pm: false,
        end_minutes: isEmptyMinutes(this.state.end_minutes)
      });
      let end_time = this.state.end_hours + ':' + isEmptyMinutes(this.state.end_minutes) + ' ' + TIME_LABEL.AM.toLowerCase();
      console.log('onPressAmButton :: 1 :: end_time', end_time);
      let Hour24Time = FormatUtils.getTime24h(end_time);
      if (isValidAgentStartEndTime(agent_access_end_ts)) {
        compareEndTime(Hour24Time, this);
      }
    }
  }

  /**
   * function when select PM button in both start & end time
   * @param {*} is_from_start 
   */
  onPressPmButton = (is_from_start) => {
    const { agent_access_end_ts = null, agent_access_start_ts = null } = this.props.app_accessing_time_data;
    console.log('onPressPmButton :: start_minutes', isEmptyMinutes(this.state.start_minutes));
    if (is_from_start) {
      this.setState({
        is_selected_start_pm: true,
        is_selected_start_am: false,
        start_minutes: isEmptyMinutes(this.state.start_minutes)
      });
      let start_time = this.state.start_hours + ':' + isEmptyMinutes(this.state.start_minutes) + ' ' + TIME_LABEL.PM.toLowerCase();
      console.log('onPressPmButton :: start_time', start_time);
      let Hour24Time = FormatUtils.getTime24h(start_time);
      if (isValidAgentStartEndTime(agent_access_start_ts)) {
        compareStartTime(Hour24Time, this);
      }
    } else {
      this.setState({
        is_selected_end_pm: true,
        is_selected_end_am: false,
        end_minutes: isEmptyMinutes(this.state.end_minutes)
      });

      let end_time = this.state.end_hours + ':' + isEmptyMinutes(this.state.end_minutes) + ' ' + TIME_LABEL.PM.toLowerCase();
      console.log('onPressPmButton 1:: start_time', end_time);
      let Hour24Time = FormatUtils.getTime24h(end_time);
      if (isValidAgentStartEndTime(agent_access_end_ts)) {
        compareEndTime(Hour24Time, this);
      }
    }
  }

  onPressCancel = () => {
    Screen.dismissModal();
  }

  onPressOk = () => {
    Screen.dismissModal();
    let access_time_data = {
      start_time: this.state.start_hours + ':' + isEmptyMinutes(this.state.start_minutes) + ' ' + getAmPmConfig(this, true).toUpperCase(),
      end_time: this.state.end_hours + ':' + isEmptyMinutes(this.state.end_minutes) + ' ' + getAmPmConfig(this, false).toUpperCase()
    };
    this.props.onPressOkFn(access_time_data);
  }

  render() {
    const { time_modal_localization = {} } = this.props;
    const { app_access_time_title = '', start_time_title = '', end_time_title = '', cancelButtonTxt = '',
      okButtonText = '' } = time_modal_localization;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerStyle}>{app_access_time_title}</Text>
          </View>
          <TimeInputUIComponent
            hourRef={ref => this.firstStartInput = ref}
            minuteRef={ref => this.firstEndInput = ref}
            subTitle={start_time_title}
            hourValue={this.state.start_hours.toString()}
            minuteValue={this.state.start_minutes.toString()}
            hourOnChangeText={(text) => this.onChangeStartHourInput(text)}
            minuteOnChangeText={(text) => this.onChangeStartMinuteInput(text)}
            onPressAmButton={() => this.onPressAmButton(true)}
            onPressPmButton={() => this.onPressPmButton(true)}
            is_selected_am={this.state.is_selected_start_am}
            is_selected_pm={this.state.is_selected_start_pm}
            start_error_msg={this.state.start_error_msg}
            editMinuteInput={parseInt(this.state.start_hours) > 0}
          />
          <TimeInputUIComponent
            hourRef={(input) => this.secondStartInput = input}
            minuteRef={(input) => this.secondEndInput = input}
            subTitle={end_time_title}
            hourValue={this.state.end_hours.toString()}
            minuteValue={this.state.end_minutes.toString()}
            hourOnChangeText={(text) => this.onChangeEndHourInput(text)}
            minuteOnChangeText={(text) => this.onChangeEndMinuteInput(text)}
            onPressAmButton={() => this.onPressAmButton(false)}
            onPressPmButton={() => this.onPressPmButton(false)}
            is_selected_am={this.state.is_selected_end_am}
            is_selected_pm={this.state.is_selected_end_pm}
            end_error_msg={this.state.end_error_msg}
            editMinuteInput={parseInt(this.state.end_hours) > 0}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.onPressCancel()}
            >
              <Text style={styles.cancelButtonStyle}>{cancelButtonTxt}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPressOk()}
              disabled={disableOkButton(this)}
            >
              <Text style={disableOkButton(this) ? [styles.okButtonStyle, { color: Colors.btnDisableTxtColor }] :
                styles.okButtonStyle}>{okButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  console.log('****** REDUX STATE :: COMMON :: => TimePickerModal :: all\n', state);
  return {

  };
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.modalOverlayColorLow
  },
  modalContainer: {
    minHeight: MODAL_MIN_HEIGHT,
    width: MODAL_WIDTH,
    backgroundColor: Colors.colorWhite,
    shadowColor: Colors.black,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    padding: 25
  },
  headerStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.reportIssueTitle
  },
  headerContainer: {
    // paddingBottom: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 25
  },
  cancelButtonStyle: {
    color: Colors.billPayConnectedTextColor,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 35
  },
  okButtonStyle: {
    color: Colors.billPayConnectedTextColor,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10
  }
});

export default connect(mapStateToProps, actions)(TimePickerModal);
