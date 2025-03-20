import React , { useEffect, useState } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  ema,
  YAxis,
  BarSeries,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  lastVisibleItemBasedZoomAnchor,
  ZoomButtons,
  LineSeries,
  CurrentCoordinate,
  EdgeIndicator,
  
} from "react-financial-charts";
import { discontinuousTimeScaleProvider } from "react-financial-charts"; // Updated import
import { last } from "react-financial-charts"; // Updated import
import OHLCTooltip from "./OHLCTooltip";

const StockChart = ({ data }) => {
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
    (d) => new Date(d.date)
  );
  const dateTimeFormat =  "%d %b '%y \xa0 %H:%M";
  const   priceDisplayFormat = format(".2f");
  const { data: chartData, xScale, xAccessor, displayXAccessor } =
    xScaleProvider(data);
  const timeDisplayFormat = timeFormat(dateTimeFormat);
    const height = 700;
    const width = 900;
    const margin = { left: 0, right: 48, top: 0, bottom: 24 };
    const [resetCount, setResetCount] = useState(0);

  const start = xAccessor(last(chartData));
  const end = xAccessor(chartData[Math.max(0, chartData.length - 100)]);
  const xExtents = [start, end];

  const gridHeight = height - margin.top - margin.bottom;

  const elderRayHeight = 100;
  const elderRayOrigin = (_, h) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const barChartOrigin = (_, h) => [0, h - barChartHeight - elderRayHeight];
  const chartHeight = gridHeight - elderRayHeight;

  const zoomButtonStyles = {
    fill: "#383E55",
    fillOpacity: 0.75,
    strokeWidth: 0,
    textFill: "#9EAAC7"
  };

  const crossHairStyles = {
    strokeStyle: "#9EAAC7"
  };
  const coordinateStyles = {
    fill: "#383E55",
    textFill: "#FFFFFF"
  };

  const axisStyles = {
    strokeStyle: "#383E55", // Color.GRAY
    strokeWidth: 2,
    tickLabelFill: "#9EAAC7", // Color.LIGHT_GRAY
    tickStrokeStyle: "#383E55",
    gridLinesStrokeStyle: "rgba(56, 62, 85, 0.5)" // Color.GRAY w Opacity
  };
  
// Default green/red colors for candlesticks
const openCloseColor = (d) => (d.close > d.open ? "#26a69a" : "#ef5350");

  const ema26 = ema()
  .id(2)
  .options({ windowSize: 26 })
  .merge((d, c) => {
    d.ema26 = c;
  })
  .accessor((d) => d.ema26);

  const ema12 = ema()
  .id(1)
  .options({ windowSize: 12 })
  .merge((d, c) => {
    d.ema12 = c;
  })
  .accessor((d) => d.ema12);

  const calculatedData = (ema26(ema12(chartData)));

  const pricesDisplayFormat = format(".2f");

  const candleChartExtents = (data) => {
    return [data.high, data.low];
  };

  return (
    <ChartCanvas
      height={height}
      ratio={3}
      width={width}
      margin={margin}
      data={chartData}
      displayXAccessor={displayXAccessor}
      seriesName="Data"
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
       zoomAnchor={lastVisibleItemBasedZoomAnchor}
  
    >
       <Chart
              id={1}
              height={barChartHeight}
              origin={barChartOrigin}
              yExtents={(d) => d.volume}
            >
              <BarSeries
                fillStyle={(d) =>
                  d.close > d.open
                    ? "rgba(38, 166, 154, 0.3)"
                    : "rgba(239, 83, 80, 0.3)"
                }
                yAccessor={(d) => d.volume}
              />
            </Chart>

      <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
        <XAxis showGridLines {...axisStyles}  showTickLabel={false} />
        <YAxis showGridLines {...axisStyles}  tickFormat={pricesDisplayFormat} />
          <MouseCoordinateX
                  displayFormat={timeDisplayFormat}
                  {...coordinateStyles}
                />
              
                <MouseCoordinateY
                  rectWidth={margin.right}
                  displayFormat={priceDisplayFormat}
                  {...coordinateStyles}
                />
                 {/* YAxis close price highlight */}
                        <EdgeIndicator
                          itemType="last"
                          rectWidth={margin.right}
                          fill={openCloseColor}
                          lineStroke={openCloseColor}
                          displayFormat={priceDisplayFormat}
                          yAccessor={(d) => d.close}
                        />
        <CandlestickSeries />
   
        <LineSeries yAccessor={ema26.accessor()}  strokeStyle={ema26.stroke()}/>
        <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
     
           <OHLCTooltip
                  origin={[8, 16]}
                  textFill={openCloseColor}
                  className="react-no-select"
                />
                <ZoomButtons
                  onReset={() => setResetCount(resetCount + 1)}
                  {...zoomButtonStyles}
                />
                  
      </Chart>
      <CrossHairCursor {...crossHairStyles} />
    </ChartCanvas>
  );
};

export default StockChart;