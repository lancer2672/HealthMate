export function createChartData(chartData) {
  let data = [],
    allkeys = [];

  chartData.forEach(element => {
    for (let [key, value] of Object.entries(element)) {
      allkeys.push(key);
      data.push(value);
    }
  });
  return {
    labels: allkeys,
    datasets: [{data: amountData}]
  };
}

export const getDateMonthLabel = timestamp => {
  //convert from timestamp to millis unit
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  console.log('date', timestamp, date, day, month);
  return `${day}/${month}`;
};
