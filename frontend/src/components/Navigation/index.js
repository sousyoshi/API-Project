import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar">
      <li >
        <NavLink exact to="/">
          <img className="logo" alt="LAIRBNB" src="https://i0.wp.com/gaminglyfe.com/wp-content/uploads/2018/07/Villainous-Lairs.jpg?fit=840%2C520&ssl=1" />
        </NavLink>
      </li>
      {!!sessionUser && <div className="createNewSpot" ><NavLink  to="/spots/new">Create a New Spot </NavLink></div>}
      {isLoaded && (
        <li className="profileButton">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
