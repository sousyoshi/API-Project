import React from 'react';
import {  NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar'>
      <li >
        <NavLink exact to="/"><img className="logo"
        alt='LAIRBNB'/></NavLink>
      </li>
{!!sessionUser && <a href='/spots/new'>Create a New Spot </a>}
      {isLoaded && (
        <li className='profileButton'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
