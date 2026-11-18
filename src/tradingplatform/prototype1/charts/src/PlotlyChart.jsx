import {
  useEffect,
  useRef,
} from "react";

import Plotly from "plotly.js-dist"


function PlotlyChart({
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


    const x =
      data.map(
        (item) => item.time
      );


    const open =
      data.map(
        (item) => item.open
      );


    const high =
      data.map(
        (item) => item.high
      );


    const low =
      data.map(
        (item) => item.low
      );


    const close =
      data.map(
        (item) => item.close
      );


    const trace = {

      x,

      open,

      high,

      low,

      close,

      type: "candlestick",

    };


    const layout = {

      height: 420,

      margin: {
        l: 50,
        r: 20,
        t: 20,
        b: 50,
      },

      xaxis: {
        rangeslider: {
          visible: true,
        },
      },

      yaxis: {
        fixedrange: false,
      },

    };


    const config = {

      responsive: true,

      displaylogo: false,

    };


    Plotly
      .newPlot(
        containerRef.current,
        [trace],
        layout,
        config
      )
      .then(() => {
        
        onRenderComplete();

      });


    const resizeObserver =
      new ResizeObserver(() => {

        if (
          containerRef.current
        ) {

          Plotly.Plots.resize(
            containerRef.current
          );

        }

      });


    resizeObserver.observe(
      containerRef.current
    );


    return () => {

      resizeObserver.disconnect();


      if (
        containerRef.current
      ) {

        Plotly.purge(
          containerRef.current
        );

      }

    };

  }, [data]);


  return (
    <div
      ref={containerRef}
      className="chart-container"
    />
  );
}


export default PlotlyChart;