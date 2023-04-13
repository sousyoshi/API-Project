import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsLanding from "./components/SpotsLanding";
import SingleSpot from "./components/SingleSpot";
import CreateSpotForm from "./components/SpotForm/CreateSpotForm";
import EditSpotForm from "./components/SpotForm/EditSpotForm";
import UserSpots from "./components/UserSpots";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={"/"} component={SpotsLanding} />
          <Route path={`/spots/new`} component={CreateSpotForm} />
          <Route exact path={'/spots/current'} component={UserSpots} />
          <Route exact path={`/spots/:spotId`} component={SingleSpot} />
          <Route  path={'/spots/:spotId/edit'} component={EditSpotForm} />
        </Switch>
      )}
    </>
  );
}

export default App;
