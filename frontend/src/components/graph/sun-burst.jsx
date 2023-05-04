import { memo } from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import ResponsiveContainer from "./responsive-container";

const Sunburst = ({ data }) => {
  const keys = data?.children.map((d) => d.name);

  return (
    <ResponsiveContainer>
      <ResponsiveSunburst
        data={data}
        id="name"
        value="visitors"
        valueFormat=" ^ .0~f"
        borderWidth="4px"
        colors={(d) => {
          if (keys.includes(d.id)) {
            d.arc.innerRadius = 35;
          } else {
            d.arc.innerRadius -= 15;
          }
          return d.data.color;
        }}
        inheritColorFromParent={false}
        childColor={({ data }) => data.color}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsRadiusOffset={0.5}
        arcLabelsTextColor="#fff"
      />
    </ResponsiveContainer>
  );
};

export default memo(Sunburst);
