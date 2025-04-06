
// Import the SDG icon images
import Goal01 from "./SDG_ICON/Goal01.png";
import Goal02 from "./SDG_ICON/Goal02.png";
import Goal03 from "./SDG_ICON/Goal03.png";
import Goal04 from "./SDG_ICON/Goal04.png";
import Goal05 from "./SDG_ICON/Goal05.png";
import Goal06 from "./SDG_ICON/Goal06.png";
import Goal07 from "./SDG_ICON/Goal07.png";
import Goal08 from "./SDG_ICON/Goal08.png";
import Goal09 from "./SDG_ICON/Goal09.png";
import Goal10 from "./SDG_ICON/Goal10.png";
import Goal11 from "./SDG_ICON/Goal11.png";
import Goal12 from "./SDG_ICON/Goal12.png";
import Goal13 from "./SDG_ICON/Goal13.png";
import Goal14 from "./SDG_ICON/Goal14.png";
import Goal15 from "./SDG_ICON/Goal15.png";
import Goal16 from "./SDG_ICON/Goal16.png";
import Goal17 from "./SDG_ICON/Goal17.png";

interface SDGIconProps {
  goalNumber: number;
  size?: number;
  color?: string;
  className?: string;
}

// Map icon imports to numbers for easy lookup
const SDGIcons: Record<number, string> = {
  1: Goal01,
  2: Goal02,
  3: Goal03,
  4: Goal04,
  5: Goal05,
  6: Goal06,
  7: Goal07,
  8: Goal08,
  9: Goal09,
  10: Goal10,
  11: Goal11,
  12: Goal12,
  13: Goal13,
  14: Goal14,
  15: Goal15,
  16: Goal16,
  17: Goal17
};

const SDGIcon = ({ goalNumber, size = 24, className = "" }: SDGIconProps) => {
  // Format the goal number with leading zero if needed
  const formattedGoalNumber =
    goalNumber < 10 ? `0${goalNumber}` : `${goalNumber}`;

  // Get the appropriate icon by goal number
  const iconSrc = SDGIcons[goalNumber];

  // Return an image element with the appropriate source and styling
  return (
    <img
      src={iconSrc}
      alt={`SDG Goal ${goalNumber}: ${getSDGName(goalNumber)}`}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
};

// Get the official SDG color for each goal
export const getSDGColor = (goalNumber: number): string => {
  const SDG_COLORS = [
    "#E5243B", // 1: No Poverty
    "#DDA63A", // 2: Zero Hunger
    "#4C9F38", // 3: Good Health and Well-being
    "#C5192D", // 4: Quality Education
    "#FF3A21", // 5: Gender Equality
    "#26BDE2", // 6: Clean Water and Sanitation
    "#FCC30B", // 7: Affordable and Clean Energy
    "#A21942", // 8: Decent Work and Economic Growth
    "#FD6925", // 9: Industry, Innovation and Infrastructure
    "#DD1367", // 10: Reduced Inequality
    "#FD9D24", // 11: Sustainable Cities and Communities
    "#BF8B2E", // 12: Responsible Consumption and Production
    "#3F7E44", // 13: Climate Action
    "#0A97D9", // 14: Life Below Water
    "#56C02B", // 15: Life on Land
    "#00689D", // 16: Peace, Justice and Strong Institutions
    "#19486A", // 17: Partnerships for the Goals
  ];

  return goalNumber >= 1 && goalNumber <= 17
    ? SDG_COLORS[goalNumber - 1]
    : "#888888";
};

// Get the official SDG name for each goal
export const getSDGName = (goalNumber: number): string => {
  const SDG_NAMES = [
    "No Poverty",
    "Zero Hunger",
    "Good Health and Well-being",
    "Quality Education",
    "Gender Equality",
    "Clean Water and Sanitation",
    "Affordable and Clean Energy",
    "Decent Work and Economic Growth",
    "Industry, Innovation and Infrastructure",
    "Reduced Inequality",
    "Sustainable Cities and Communities",
    "Responsible Consumption and Production",
    "Climate Action",
    "Life Below Water",
    "Life on Land",
    "Peace, Justice and Strong Institutions",
    "Partnerships for the Goals",
  ];

  return goalNumber >= 1 && goalNumber <= 17
    ? SDG_NAMES[goalNumber - 1]
    : "Unknown Goal";
};

export default SDGIcon;
