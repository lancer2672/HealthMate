import GoogleFit, { BucketUnit, Scopes } from 'react-native-google-fit';
import { trackingNotificationIns } from 'src/services/notifee/TrackingNotification';
import { getEndDayISO, getStartDayISO } from 'src/utils/dateTimeHelper';
import { requestActivityRecognitionPermission } from '../permissions';

const SAVE_RECORD_TIME_INTERVAL = 6000;

const options = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
    Scopes.FITNESS_LOCATION_READ,
    Scopes.FITNESS_BLOOD_PRESSURE_READ,
    Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
    Scopes.FITNESS_BLOOD_GLUCOSE_READ,
    Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
    Scopes.FITNESS_NUTRITION_WRITE,
    Scopes.FITNESS_SLEEP_READ
  ]
};

const enableTrackingUserActivities = async () => {
  await GoogleFit.authorize(options);
  var authorized = GoogleFit.isAuthorized;
  if (authorized) {
    if (await requestActivityRecognitionPermission()) {
      GoogleFit.startRecording(
        params => {
          console.log('params', params);
        },
        ['step']
      );
      return true;
    }
  } else {
    console.log('NOT AUTH');
  }
  return false;
};

export const getPeriodSteps = async (startDate: string, endDate: string) => {
  const opt = {
    startDate, // required ISO8601Timestamp
    endDate
  };
  return GoogleFit.getDailyStepCountSamples(opt)
    .then(res => {
      return res[2]?.rawSteps[0]?.steps || 0;
    })
    .catch(err => {
      console.warn(err);
      return 0;
    });
};
export const observerActivity = async (
  handleAddStep: (steps: number) => void,
  handleUpdateTotalSteps: (totalSteps: number) => void,
  handleSaveUserActivityRecords: ({ calorie, distance, moveMins }: any) => Promise<any>,
  calculateStepCalorie:(moveMins:number) =>void,
) => {
  let saveRecordTimeout: any = null;
  const startDate = getStartDayISO(new Date());
    const endDate = getEndDayISO(new Date());
    const promises = [
      getPeriodSteps(startDate, endDate),
      getPeriodCalories(startDate, endDate),
      getPeriodDistance(startDate, endDate),
      getPeriodMoveMins(startDate, endDate)
  ]; 

  //get total new unupdated steps in (PeriodSteps function) when first login
  saveRecordTimeout = setTimeout(()=>saveRecords(0,promises,handleUpdateTotalSteps,handleSaveUserActivityRecords), SAVE_RECORD_TIME_INTERVAL);
  const moveMins = await getPeriodMoveMins(startDate, endDate);
  calculateStepCalorie(moveMins);
  
  let newUnupdatedStep = 0;
  
  GoogleFit.observeSteps((result: any) => {

    handleAddStep(result.steps);
    if (saveRecordTimeout) { 
      newUnupdatedStep += result.steps
      clearTimeout(saveRecordTimeout);
    } 
    console.log("observeSteps",{newUnupdatedStep, result})
    saveRecordTimeout = setTimeout(async() => {
      saveRecords(newUnupdatedStep, promises, handleUpdateTotalSteps, handleSaveUserActivityRecords)
      newUnupdatedStep = 0
      const moveMins = await getPeriodMoveMins(startDate, endDate);
      calculateStepCalorie(moveMins);
    }, SAVE_RECORD_TIME_INTERVAL);
  });
};

const saveRecords = async (newUnupdatedStep, promises, handleUpdateTotalSteps,handleSaveUserActivityRecords) => {
  const [todayTotalSteps, calorie, distance, moveMins] = await Promise.all(promises)
  handleUpdateTotalSteps(todayTotalSteps + newUnupdatedStep);
  await handleSaveUserActivityRecords({ calorie, distance, moveMins });
  await trackingNotificationIns.updateNotification({distance: Math.trunc(distance),steps:todayTotalSteps + newUnupdatedStep})
  
}

export const getPeriodCalories = async (startDate: string, endDate: string) => {
  try {
    const opt = {
      startDate,
      endDate,
      basalCalculation: true, // optional, to calculate or not basalAVG over the week
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1 // optional - default 1.
    };

    const res = await GoogleFit.getDailyCalorieSamples(opt);
    return res[0]?.calorie ;
  } catch (er) {
    console.log(er);
  }
};


export const getPeriodSleep = () => {
  const opt = {
    startDate: '2020-01-01T12:33:18.873Z', // required, timestamp or ISO8601 string
    endDate: new Date().toISOString(), // required, timestamp or ISO8601 string
  };
  
  GoogleFit.getSleepSamples(opt).then((res) => {
    console.log("SEEP SAMPLES",res)
  });
}

export const getPeriodDistance = async (startDate: string, endDate: string) => {
  const opt = {
    startDate,
    endDate,
    bucketUnit: BucketUnit.DAY,
    bucketInterval: 1
  };

  const res = await GoogleFit.getDailyDistanceSamples(opt);
  return res[0]?.distance;
};

export const getPeriodMoveMins = async (startDate: string, endDate: string) => {
  const opt = {
    startDate,
    endDate
    //bucket unit...
  };

  const res = await GoogleFit.getMoveMinutes(opt);
  return res[0]?.duration;
};

export default enableTrackingUserActivities;
