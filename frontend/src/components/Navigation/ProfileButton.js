import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './Navigation.css'
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory()
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="modalButton" onClick={openMenu}>
        <i className="fa-sharp fa-solid fa-bars" />
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li > Hello, {user.username}</li>
            <li className="userEmail">{user.email}</li>
            <li ><a className="userlinks" href="/spots/current">Manage Spots</a></li>
            <li ><a className="userlinks" href="/reviews/current">Manage Reviews</a></li>
            <li className='logOutDiv'>
              <button className="logOutButton" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <div>
            <OpenModalMenuItem itemText="Log In" onItemClick={closeMenu} modalComponent={<LoginFormModal />} />
            <OpenModalMenuItem itemText="Sign Up" onItemClick={closeMenu} modalComponent={<SignupFormModal />} />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
