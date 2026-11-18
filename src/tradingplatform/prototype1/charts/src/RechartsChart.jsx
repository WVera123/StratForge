import { useEffect } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ErrorBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
} from "recharts";

function RechartsCandle(props) {

  const {
    open,
    close,
  } = props;

  const isUp =
    Number(close) >= Number(open);

  return (
    <rect
      {...props}
      fill={
        isUp
          ? "#26a69a"
          : "#ef5350"
      }
      stroke="none"
    />
  );
}

function RechartsTooltip({
  active,
  payload,
}) {

  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const candle =
    payload[0]?.payload;

  if (!candle) {
    return null;
  }

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "4px",
      }}
    >
      <div>
        <strong>
          {new Date(
            candle.time
          ).toLocaleString()}
        </strong>
      </div>

      <div>
        Open:{" "}
        {Number(candle.open).toFixed(2)}
      </div>

      <div>
        High:{" "}
        {Number(candle.high).toFixed(2)}
      </div>

      <div>
        Low:{" "}
        {Number(candle.low).toFixed(2)}
      </div>

      <div>
        Close:{" "}
        {Number(candle.close).toFixed(2)}
      </div>

    </div>
  );
}

function RechartsChart({
  data,
  onRenderComplete,
}) {

  useEffect(() => {

    if (data.length === 0) {
      return;
    }
    onRenderComplete();

  }, [data, onRenderComplete]);
  const barDataKey =
    (entry) => [
      Math.min(
        Number(entry.close),
        Number(entry.open)
      ),

      Math.max(
        Number(entry.close),
        Number(entry.open)
      ),
    ];

  const whiskerDataKey =
    (entry) => {

      const highEnd =
        Math.max(
          Number(entry.close),
          Number(entry.open)
        );

      return [
        highEnd -
          Number(entry.low),

        Number(entry.high) -
          highEnd,
      ];
    };

  const chartData =
    data.map(
      (item) => ({
        ...item,

        timeValue:
          new Date(
            item.time
          ).getTime(),
      })
    );

  const formatTime =
    (timestamp) => {

      const date =
        new Date(timestamp);


      if (
        data.length > 10000
      ) {
        return date.toLocaleDateString();
      }

      return date.toLocaleString();
    };

  const formatPrice =
    (value) => {

      if (
        value == null ||
        !Number.isFinite(
          Number(value)
        )
      ) {
        return "";
      }

      return Number(value)
        .toFixed(2);
    };

  return (
    <ResponsiveContainer
      width="100%"
      height={420}
    >
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis
          dataKey="timeValue"
          type="number"
          scale="time"
          domain={[
            "dataMin",
            "dataMax",
          ]}
          tickFormatter={formatTime}
          minTickGap={40}
        />

        <YAxis
          type="number"
          domain={[
            "dataMin - 1",
            "dataMax + 1",
          ]}
          tickFormatter={formatPrice}
          width={80}
        />

        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
        />

        <Bar
          dataKey={barDataKey}
          shape={
            <RechartsCandle />
          }
          isAnimationActive={false}
        >

          <ErrorBar
            dataKey={whiskerDataKey}
            width={0}
          />

        </Bar>

        <Brush
          dataKey="timeValue"
          height={30}
          travellerWidth={10}
          tickFormatter={formatTime}
        />

        <Tooltip
          content={
            <RechartsTooltip />
          }
        />

      </BarChart>

    </ResponsiveContainer>
  );
}


export default RechartsChart;