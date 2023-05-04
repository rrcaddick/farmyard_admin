import { ResponsiveBar } from "@nivo/bar";
import ResponsiveContainer from "@components/graph/responsive-container";

const BarGraph = ({ data, indexBy, keys }) => {
  return (
    <ResponsiveContainer>
      <ResponsiveBar
        data={data}
        keys={Object.keys(keys)}
        indexBy={indexBy}
        margin={{ top: 0, right: 175, bottom: 15, left: 63 }}
        padding={0.1}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        colors={(bar) => keys[bar.id]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 5,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
        }}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#fff"
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: 134,
            translateY: 4,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 2,
                },
              },
            ],
          },
        ]}
        tooltip={function () {}}
      />
    </ResponsiveContainer>
  );
};

export default BarGraph;
