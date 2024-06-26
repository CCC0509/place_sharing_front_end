import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElements/Button.js";
import Modal from "../../shared/components/UIElement/Modal.jsx";
import Map from "../../shared/components/UIElement/Map.jsx";
import { AuthContext } from "../../shared/context/auth-content.jsx";
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook.jsx";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner.js";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => setShowConfirmModal(false);
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        "delete",
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        null,
        { Authorization: "Bearer " + auth.token }
      );
    } catch (error) {}

    props.onDelete(props.id);
  };

  return (
    <>
      <ErrorModal onClear={errorHandler} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>關閉</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="確定要刪除嗎？"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              取消
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              刪除
            </Button>
          </>
        }
      >
        <p>確定要刪除這個地點資料嗎？刪除後就無法回復囉！</p>
      </Modal>
      <li className="place-item">
        <Card
          className="
        place-item__content"
        >
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              在地圖上查看
            </Button>
            {props.creatorId === auth.userId && (
              <>
                <Button to={`/places/${props.id}`}>編輯</Button>
                <Button danger onClick={showDeleteWarningHandler}>
                  刪除
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
