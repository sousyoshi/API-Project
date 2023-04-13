import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteSpotThunk, getSpotsThunk } from "../../store/spots";

const UserSpots = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const userSpot = spots.filter((spot) => spot.ownerId === sessionUser.id);

  useEffect(() => {
    dispatch(getSpotsThunk());

  }, [dispatch]);



  if (!userSpot || !sessionUser) return ( <h1>Loading...</h1>);


  return (
    <>
      <h1>Manage Your Spots</h1>
      <Link to={"/spots/new"}>
        <button>Create a New Spot</button>
      </Link>
      <ul>
        {userSpot.map((spot) => {
          return (
            <li key={spot.id}>
              <img alt="img" src={spot.previewImage}></img>
              <p>
                {spot.city}, {spot.state}
              </p>
              <p>{+spot?.avgRating}</p>
              <p>${spot.price} night</p>
              <Link to={`/spots/${spot.id}/edit`}>
                <button>Update</button>
              </Link>

              <button onClick={async()=>dispatch(deleteSpotThunk(spot.id))}>Delete</button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default UserSpots;
