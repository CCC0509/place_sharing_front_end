import React, { useContext, useState } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import axios from "axios";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import { AuthContext } from "../../shared/context/auth-content";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", inValid: false },
    },
    false
  );

  const loginHandler = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      try {
        const response = await sendRequest(
          "post",
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }
        );
        auth.login(response.userId, response.token);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const response = await sendRequest(
          "post",
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          formData
        );
        auth.login(response.userId, response.token);
      } catch (error) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLoginMode(!isLoginMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>登入</h2>
        <hr />
        <form onSubmit={loginHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="你的暱稱"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password (at least 6 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "登入" : "註冊"}
          </Button>
        </form>
        <Button onClick={switchModeHandler}>
          {isLoginMode ? "切換到註冊" : "切換到登入"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
