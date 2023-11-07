import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import {requestActivityRecognitionPermission} from '../permissions';
import {getEndDayISO, getStartDayISO} from 'src/utils/dateTimeHelper';

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
      console.log('StartTracking');
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
      return res[2]?.rawSteps[0]?.steps;
    })
    .catch(err => {
      console.warn(err);
      return 0;
    });
};
export const observeSteps = async (
  handleAddStep: (steps: number) => void,
  handleUpdateTotalSteps: (totalSteps: number) => void,
  handleSaveUserActivityRecords: ({ calorie, distance, moveMins  } : any) => Promise<any>
) => {
  let saveRecordTimeout: any = null;
  GoogleFit.observeSteps((result: any) => {
    handleAddStep(result.steps);
    if (saveRecordTimeout) {
      console.log("Clear timeout")
      clearTimeout(saveRecordTimeout);
    }
    
    const startDate = getStartDayISO(new Date());
    const endDate = getEndDayISO(new Date());
    const promises = [
      getPeriodSteps(startDate, endDate),
      getPeriodCalories(startDate, endDate),
      getPeriodDistance(startDate, endDate),
      getPeriodMoveMins(startDate, endDate)
    ];
    
    saveRecordTimeout = setTimeout(async () => {
      const [todayTotalSteps, calorie, distance, moveMins] = await Promise.all(promises)
      await handleSaveUserActivityRecords({ calorie, distance, moveMins });
      handleUpdateTotalSteps(todayTotalSteps);
      
    }, SAVE_RECORD_TIME_INTERVAL);
  });
};

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
    return res[0]?.calorie;
  } catch (er) {
    console.log(er);
  }
};

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
