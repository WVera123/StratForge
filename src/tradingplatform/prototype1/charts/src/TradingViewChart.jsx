import {
  useEffect,
  useRef,
} from "react";

import {
  createChart,
  CandlestickSeries,
} from "lightweight-charts";


function TradingViewChart({
  data,
  onRenderComplete,
}) {

  const containerRef =
    useRef(null);

  const tooltipRef =
    useRef(null);


  useEffect(() => {

    if (
      !containerRef.current ||
      data.length === 0
    ) {
      return;
    }


    const container =
      containerRef.current;


    const chart =
      createChart(
        container,
        {
          width:
            container.clientWidth,

          height: 420,

          layout: {
            textColor: "#222",

            background: {
              color: "#fff",
            },
          },

          timeScale: {
            timeVisible: true,
            secondsVisible: false,
            rightOffset: 0,
            minBarSpacing: 0.1,
            fixLeftEdge: false,
            fixRightEdge: false,
            lockVisibleTimeRangeOnResize: true,
          },

          rightPriceScale: {
            borderVisible: false,
          },

          crosshair: {
            mode: 0,
          },

          handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
            horzTouchDrag: true,
            vertTouchDrag: true,
          },

          handleScale: {
            mouseWheel: true,
            pinch: true,
            axisPressedMouseMove: true,
            axisDoubleClickReset: true,
          },
        }
      );


    const series =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        }
      );


    const chartData =
      data
        .map((item) => ({
          time: Math.floor(
            new Date(
              item.time
            ).getTime() / 1000
          ),

          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        }))
        .filter(
          (item) =>
            Number.isFinite(item.time) &&
            Number.isFinite(item.open) &&
            Number.isFinite(item.high) &&
            Number.isFinite(item.low) &&
            Number.isFinite(item.close)
        );


    series.setData(
      chartData
    );

    chart
      .timeScale()
      .fitContent();

    const tooltip =
      tooltipRef.current;


    const crosshairHandler =
      (param) => {

        if (
          !param.point ||
          !param.time ||
          !tooltip
        ) {

          if (tooltip) {
            tooltip.style.display =
              "none";
          }

          return;
        }


        const candle =
          param.seriesData.get(
            series
          );


        if (!candle) {

          tooltip.style.display =
            "none";

          return;
        }


        const date =
          new Date(
            Number(param.time) * 1000
          );


        tooltip.innerHTML = `
          <strong>
            ${date.toLocaleString()}
          </strong>

          <div>
            Open:
            ${Number(candle.open).toFixed(2)}
          </div>

          <div>
            High:
            ${Number(candle.high).toFixed(2)}
          </div>

          <div>
            Low:
            ${Number(candle.low).toFixed(2)}
          </div>

          <div>
            Close:
            ${Number(candle.close).toFixed(2)}
          </div>

          <div>
            Volume:
            ${formatVolume(
              data.find(
                (item) =>
                  Math.floor(
                    new Date(
                      item.time
                    ).getTime() / 1000
                  ) ===
                  Number(param.time)
              )?.volume
            )}
          </div>
        `;


        tooltip.style.display =
          "block";


        const left =
          Math.min(
            param.point.x + 15,
            container.clientWidth - 190
          );


        const top =
          Math.max(
            param.point.y + 15,
            10
          );


        tooltip.style.left =
          `${left}px`;

        tooltip.style.top =
          `${top}px`;
      };


    chart.subscribeCrosshairMove(
      crosshairHandler
    );


    onRenderComplete();


    const resize = () => {

      if (!containerRef.current) {
        return;
      }

      chart.applyOptions({
        width:
          containerRef.current.clientWidth,
      });
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

      chart.unsubscribeCrosshairMove(
        crosshairHandler
      );

      chart.remove();
    };

  }, [
    data,
    onRenderComplete,
  ]);


  return (
    <div
      className="chart-wrapper"
    >

      <div
        ref={containerRef}
        className="chart-container"
      />

      <div
        ref={tooltipRef}
        className="ohlcv-tooltip"
      />

    </div>
  );
}


function formatVolume(value) {

  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(
      Number(value)
    )
  ) {
    return "-";
  }

  return Number(value)
    .toLocaleString(
      undefined,
      {
        maximumFractionDigits: 2,
      }
    );
}


export default TradingViewChart;