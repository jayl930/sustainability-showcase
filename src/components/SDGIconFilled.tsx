// src/components/SDGIconFilled.tsx

// Import the filled SDG icon images
import Goal01 from "./SDG_ICON_filled/Goal01.png";
import Goal02 from "./SDG_ICON_filled/Goal02.png";
import Goal03 from "./SDG_ICON_filled/Goal03.png";
import Goal04 from "./SDG_ICON_filled/Goal04.png";
import Goal05 from "./SDG_ICON_filled/Goal05.png";
import Goal06 from "./SDG_ICON_filled/Goal06.png";
import Goal07 from "./SDG_ICON_filled/Goal07.png";
import Goal08 from "./SDG_ICON_filled/Goal08.png";
import Goal09 from "./SDG_ICON_filled/Goal09.png";
import Goal10 from "./SDG_ICON_filled/Goal10.png";
import Goal11 from "./SDG_ICON_filled/Goal11.png";
import Goal12 from "./SDG_ICON_filled/Goal12.png";
import Goal13 from "./SDG_ICON_filled/Goal13.png";
import Goal14 from "./SDG_ICON_filled/Goal14.png";
import Goal15 from "./SDG_ICON_filled/Goal15.png";
import Goal16 from "./SDG_ICON_filled/Goal16.png";
import Goal17 from "./SDG_ICON_filled/Goal17.png";
import { getSDGName } from "./SDGIcon";

interface SDGIconFilledProps {
  goalNumber: number;
  size?: number;
  className?: string;
}

// Map icon imports to numbers for easy lookup
const SDGFilledIcons: Record<number, string> = {
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
  17: Goal17,
};

const SDGIconFilled = ({
  goalNumber,
  size = 40,
  className = "",
}: SDGIconFilledProps) => {
  // Get the appropriate icon by goal number
  const iconSrc = SDGFilledIcons[goalNumber];

  // Return an image element with the appropriate source and styling
  return (
    <img
      src={iconSrc}
      alt={`SDG Goal ${goalNumber}: ${getSDGName(goalNumber)}`}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain", width: "100%" }}
    />
  );
};

export default SDGIconFilled;
