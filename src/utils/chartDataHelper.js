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
  const date = new Date(Number(timestamp));
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}/${month}`;
};
