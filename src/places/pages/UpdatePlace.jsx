import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElement/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-content";
import "./PlaceForm.css";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;
  const [getPlace, setGetPlace] = useState();
  const [userId, setUserId] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );
  const redirect = useNavigate();

  useEffect(() => {
    const getPlace = async () => {
      try {
        const response = await sendRequest(
          "get",
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setUserId(response.place.creator);
        setGetPlace(response.place);
        setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true,
            },
            description: {
              value: response.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    getPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        "patch",
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        },
        { Authorization: "Bearer " + auth.token }
      );
      redirect(`/${userId}/places`);
    } catch (error) {}
  };
  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }
  if (!getPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {!isLoading && getPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            value={getPlace.title}
            valid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            value={getPlace.description}
            valid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
