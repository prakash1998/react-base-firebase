import { useState } from "react";
import { Modal } from "src/base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { v4 } from "uuid";
import TextEdit from "./TextEdit";

interface Iprops {
  title: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  hide: () => void;
}

const ImageEditModal = ({ title, type, value, onChange, hide }: Iprops) => {
  const [imageUrl, setImageUrl] = useState(value || "");

  const [uniqueId] = useState(v4());

  return (
    <Modal
      title={title}
      onClose={hide}
      onOk={() => {
        onChange(imageUrl);
        hide();
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%", maxHeight: "80vh" }}>
          <img src={imageUrl} alt="pick a file" width="100%" height="100%" />
        </div>
        Choose Image
        <label htmlFor={uniqueId}>
          <FontAwesomeIcon
            icon={faEdit}
            size="2x"
            style={{ cursor: "pointer" }}
          />
          <input
            id={uniqueId}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files;
              if (f != null) {
                imageUrl && URL.revokeObjectURL(imageUrl);
                setImageUrl(URL.createObjectURL(f[0]));
              }
            }}
          />
        </label>
        <div>
          <div>
            Or Specify Remote Url
            <TextEdit
              title="Custom Remote URL"
              value={imageUrl}
              onChange={setImageUrl}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageEditModal;
