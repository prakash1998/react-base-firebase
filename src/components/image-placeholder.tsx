import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { CSSProperties } from "react";

interface Iprops {
  style?: CSSProperties;
}

const ImagePlaceholder = ({ style = {} }: Iprops) => {
  return (
    <div
      style={{
        display: "flex",
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        border: "2px dashed black",
        ...style,
      }}
    >
      <FontAwesomeIcon icon={faPlus} size="5x" />
    </div>
  );
};

export default ImagePlaceholder;
