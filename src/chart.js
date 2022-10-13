import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["From", "To", "Weight"],
  ["A", "X", 5],
  ["X", "ZZ", 7],
  ["ZZ", "TT", 6],
  ["B", "X", 2],
  ["B", "ZZ", 9],
  ["B", "Z", 4],
];

//submited > linkedin

//linkedin
//fb

//phone interview
//on site
//rejected

const options = {};

function ChartPage() {
  return (
    <div>
      <p>time period select</p>
      <Chart
        chartType="Sankey"
        // width="80%"
        // height="200px"
        data={data}
        options={options}
      />
    </div>
  );
}

export default ChartPage;
