import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElement/Card";
import "./UsersList.css";

const UserList = (props) => {
  if (props.User.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.User.map((user) => {
        return (
          <UserItem
            id={user.id}
            name={user.name}
            image={user.image}
            placeCount={user.places.length}
            key={user.id}
          />
        );
      })}
    </ul>
  );
};

export default UserList;
