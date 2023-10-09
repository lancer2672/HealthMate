import {DateTime} from 'luxon';

export default function valuesToPercentage(target, current) {
  return Math.floor(100 * (current / target));
}

export function today() {
  return DateTime.local().toSQLDate();
}

export function splitObj(chartData) {
  let amountData = [],
    goalData = [],
    allkeys = [];

  chartData.forEach(element => {
    for (let [key, value] of Object.entries(element)) {
      if (key == 'goal') {
        goalData.push(value);
      } else {
        allkeys.push(key);
        amountData.push(value);
      }
    }
  });
  // const keys = allkeys.slice(Math.max(allkeys.length - 7, 0));
  // const data = amountData.slice(Math.max(amountData.length - 7, 0));

  return {
    labels: allkeys,
    datasets: [
      {data: amountData},
      {data: goalData, color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`},
    ],
  };
}
