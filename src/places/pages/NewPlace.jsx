import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import "./PlaceForm.css";
import { AuthContext } from "../../shared/context/auth-content";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: { value: null, isValid: false },
    },
    false
  );

  const redirect = useNavigate();

  const placeSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("image", formState.inputs.image.value);
    try {
      await sendRequest(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ErrorModal error={error} className="center" onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
          />
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            errorText="Please provide an image."
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <Input
            id="address"
            element="input"
            type="text"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            ADD PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default NewPlace;
