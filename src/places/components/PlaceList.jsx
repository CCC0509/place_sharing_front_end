import React from "react";

import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.item.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>還沒有分享任何地點，要不要去分享一個呢？</h2>
          <Button to="/places/new">分享</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.item.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.deleteHandler}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
