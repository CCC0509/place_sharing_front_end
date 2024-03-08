import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";
import { useInputValid } from "../../hooks/useInputValid";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreciewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const { inputState, touchHandler, pickedHandler } = useInputValid(props);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreciewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = (e) => {
    filePickerRef.current.click();
    if (!isValid) {
      touchHandler();
    } else {
      pickedHandler();
    }
  };
  return (
    <div
      className={`form-control ${
        !isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>

        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && inputState.isTouched && (
        <p className="center">{props.errorText}</p>
      )}
    </div>
  );
};

export default ImageUpload;
