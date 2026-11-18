import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    createChart,
    createSeriesMarkers,
    CandlestickSeries
} from "lightweight-charts";


function resizeChart(
    chart,
    container
) {
    if (!chart || !container) {
        return;
    }

    const width =
        container.clientWidth;

    const height =
        container.clientHeight;

    if (
        width > 0 &&
        height > 0
    ) {
        chart.resize(
            width,
            height
        );
    }
}


function timestampToUnixTime(
    timestamp
) {
    if (!timestamp) {
        return null;
    }

    const milliseconds =
        new Date(timestamp).getTime();

    if (!Number.isFinite(milliseconds)) {
        return null;
    }

    return Math.floor(
        milliseconds / 1000
    );
}


function dateToUnixTime(
    date,
    endOfDay = false
) {
    if (!date) {
        return null;
    }

    const suffix = endOfDay
        ? "T23:59:59Z"
        : "T00:00:00Z";

    const milliseconds =
        new Date(
            `${date}${suffix}`
        ).getTime();

    if (!Number.isFinite(milliseconds)) {
        return null;
    }

    return Math.floor(
        milliseconds / 1000
    );
}


function isValidNumber(value) {
    return (
        value !== null &&
        value !== undefined &&
        Number.isFinite(
            Number(value)
        )
    );
}


function normalizeSignal(
    signal
) {
    if (
        typeof signal !== "string"
    ) {
        return null;
    }

    const normalized =
        signal.trim().toLowerCase();

    if (
        normalized === "buy" ||
        normalized === "sell"
    ) {
        return normalized;
    }

    return null;
}


export default function RuleBasedChart({
    result,
    currencies,
    startDate,
    endDate
}) {

    const priceChartRef =
        useRef(null);

    const signalMarkersRef =
        useRef(null);

    const [
        showSignals,
        setShowSignals
    ] = useState(true);

    const crypto =
        currencies?.find(
            (currency) =>
                String(currency.id) ===
                String(result?.crypto1)
        );

    useEffect(() => {

        if (
            !result?.data?.length ||
            !priceChartRef.current
        ) {
            return;
        }

        const validData =
            result.data
                .map((item) => {

                    const time =
                        timestampToUnixTime(
                            item.timestamp
                        );

                    if (time === null) {
                        return null;
                    }

                    return {
                        ...item,
                        time
                    };
                })
                .filter(Boolean)
                .sort(
                    (a, b) =>
                        a.time - b.time
                );

        const uniqueData = [];

        let previousTime = null;

        validData.forEach(
            (item) => {

                if (
                    item.time ===
                    previousTime
                ) {
                    return;
                }

                uniqueData.push(item);

                previousTime =
                    item.time;
            }
        );

        if (
            uniqueData.length === 0
        ) {
            return;
        }


        const commonOptions = {

            grid: {
                vertLines: {
                    color: "#e5e7eb"
                },

                horzLines: {
                    color: "#e5e7eb"
                }
            },

            crosshair: {
                mode: 1
            },

            timeScale: {

                timeVisible: true,

                secondsVisible: false,

                rightOffset: 0,

                minBarSpacing: 0.01,

                fixLeftEdge: false,

                fixRightEdge: false,

                lockVisibleTimeRangeOnResize: true
            }
        };


        const priceChart =
            createChart(
                priceChartRef.current,
                {
                    ...commonOptions,

                    width:
                        priceChartRef.current
                            .clientWidth,

                    height:
                        priceChartRef.current
                            .clientHeight
                }
            );


        const candleSeries =
            priceChart.addSeries(
                CandlestickSeries,
                {
                    upColor: "#16a34a",

                    downColor: "#dc2626",

                    borderUpColor:
                        "#16a34a",

                    borderDownColor:
                        "#dc2626",

                    wickUpColor:
                        "#16a34a",

                    wickDownColor:
                        "#dc2626"
                }
            );


        const candleData =
            uniqueData
                .filter(
                    (item) =>
                        isValidNumber(
                            item.open
                        ) &&
                        isValidNumber(
                            item.high
                        ) &&
                        isValidNumber(
                            item.low
                        ) &&
                        isValidNumber(
                            item.close
                        )
                )
                .map(
                    (item) => ({
                        time: item.time,

                        open: Number(
                            item.open
                        ),

                        high: Number(
                            item.high
                        ),

                        low: Number(
                            item.low
                        ),

                        close: Number(
                            item.close
                        )
                    })
                );


        if (
            candleData.length > 0
        ) {
            candleSeries.setData(
                candleData
            );
        }


        signalMarkersRef.current =
            createSeriesMarkers(
                candleSeries,
                []
            );


        const selectedFrom =
            dateToUnixTime(
                startDate
            );

        const selectedTo =
            endDate
                ? dateToUnixTime(
                    endDate,
                    true
                )
                : null;


        if (
            selectedFrom !== null &&
            selectedTo !== null &&
            selectedFrom < selectedTo
        ) {

            priceChart
                .timeScale()
                .setVisibleRange({
                    from: selectedFrom,
                    to: selectedTo
                });

        } else {

            priceChart
                .timeScale()
                .fitContent();

        }


        const observer =
            new ResizeObserver(
                () => {

                    resizeChart(
                        priceChart,
                        priceChartRef.current
                    );

                }
            );


        observer.observe(
            priceChartRef.current
        );


        return () => {

            observer.disconnect();

            signalMarkersRef.current =
                null;

            priceChart.remove();

        };

    }, [
        result,
        startDate,
        endDate
    ]);

    useEffect(() => {

        if (
            !signalMarkersRef.current ||
            !result?.data
        ) {
            return;
        }


        if (!showSignals) {

            signalMarkersRef.current
                .setMarkers([]);

            return;
        }


        const markers = [];


        result.data.forEach(
            (item) => {

                const signal =
                    normalizeSignal(
                        item.signal
                    );

                if (!signal) {
                    return;
                }


                const time =
                    timestampToUnixTime(
                        item.timestamp
                    );

                if (time === null) {
                    return;
                }


                const orderPercentage =
                    isValidNumber(
                        item.order_percentage
                    )
                        ? Number(
                            item.order_percentage
                        )
                        : 0;


                if (
                    signal === "buy"
                ) {

                    markers.push({
                        time,

                        position:
                            "belowBar",

                        color:
                            "#16a34a",

                        shape:
                            "arrowUp",

                        text:
                            `BUY`
                    });

                    return;
                }


                if (
                    signal === "sell"
                ) {

                    markers.push({
                        time,

                        position:
                            "aboveBar",

                        color:
                            "#dc2626",

                        shape:
                            "arrowDown",

                        text:
                            `SELL`
                    });

                }

            }
        );


        markers.sort(
            (a, b) =>
                a.time - b.time
        );


        const uniqueMarkers = [];

        const markerKeys =
            new Set();


        markers.forEach(
            (marker) => {

                const key =
                    `${marker.time}-${marker.text}`;

                if (
                    markerKeys.has(key)
                ) {
                    return;
                }

                markerKeys.add(key);

                uniqueMarkers.push(
                    marker
                );

            }
        );


        signalMarkersRef.current
            .setMarkers(
                uniqueMarkers
            );

    }, [
        result,
        showSignals
    ]);


    return (

        <div className="strategy-chart">

            <h3>
                Rule-Based Strategy
                {crypto
                    ? ` — ${crypto.symbol}`
                    : ""}
            </h3>


            <div className="chart-container">

                <h4>
                    Price & Rule Execution
                </h4>


                <div
                    ref={priceChartRef}
                    className="price-chart"
                    style={{
                        height: "450px"
                    }}
                />

            </div>


            <div className="chart-control-row chart-control-right">

                <div className="toggle-container">

                    <label className="toggle-switch">

                        <input
                            type="checkbox"
                            checked={showSignals}
                            onChange={(event) =>
                                setShowSignals(
                                    event.target.checked
                                )
                            }
                        />

                        <span className="toggle-slider"></span>

                    </label>


                    <span className="toggle-label-text">

                        Trade Signals{" "}

                        {showSignals
                            ? "(On)"
                            : "(Off)"}

                    </span>

                </div>

            </div>

        </div>

    );
}