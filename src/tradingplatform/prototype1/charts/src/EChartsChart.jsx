import {
  useEffect,
  useRef,
} from "react";

import * as echarts from "echarts";


function EChartsChart({
  data,
  onRenderComplete,
}) {

  const containerRef =
    useRef(null);


  useEffect(() => {

    if (
      !containerRef.current ||
      data.length === 0
    ) {
      return;
    }


    const chart =
      echarts.init(
        containerRef.current
      );


    const categories =
      data.map(
        (item) => item.time
      );


    const values =
      data.map(
        (item) => [
          item.open,
          item.close,
          item.low,
          item.high,
        ]
      );


    chart.setOption({
      animation: false,

      tooltip: {
        trigger: "axis",
      },

      xAxis: {
        type: "category",
        data: categories,
      },

      yAxis: {
        type: "value",
        scale: true,
      },

      dataZoom: [
        {
          type: "inside",
        },

        {
          type: "slider",
        },
      ],

      series: [
        {
          type: "candlestick",
          data: values,
        },
      ],
    });

    onRenderComplete();


    const resize = () => {

      chart.resize();

    };


    window.addEventListener(
      "resize",
      resize
    );


    return () => {

      window.removeEventListener(
        "resize",
        resize
      );

      chart.dispose();
    };

  }, [data]);


  return (
    <div
      ref={containerRef}
      className="chart-container"
    />
  );
}


export default EChartsChart;