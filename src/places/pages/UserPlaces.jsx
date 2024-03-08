import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState(null);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const response = await sendRequest(
          "get",
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(response.places);
      } catch (error) {
        console.log(error);
      }
    };

    getPlaces();
  }, [sendRequest]);

  const deleteHandler = (deleteId) => {
    setLoadedPlaces((placeLeft) => placeLeft.filter((p) => p.id !== deleteId));
  };

  return (
    <>
      <ErrorModal className="center" onClear={errorHandler} error={error} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {loadedPlaces && !isLoading && (
        <PlaceList item={loadedPlaces} deleteHandler={deleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
