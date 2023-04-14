import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteSpotThunk, getSpotsThunk } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";

const UserSpots = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const userSpot = spots.filter((spot) => spot.ownerId === sessionUser.id);

  useEffect(() => {
    dispatch(getSpotsThunk());
  }, [dispatch]);

  if (!userSpot || !sessionUser) return <h1>Loading...</h1>;

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
              <a href={`/spots/${spot.id}`}>
                {" "}
                <img alt="img" src={spot.previewImage} title={spot.name}></img>
              </a>

              <p>
                {spot.city}, {spot.state}
              </p>
              <p>{+spot?.avgRating}</p>
              <p>${spot.price} night</p>
              <Link to={`/spots/${spot.id}/edit`}>
                <button>Update</button>
              </Link>
                
              <OpenModalButton buttonText={'Delete'} modalComponent={<DeleteSpotModal spot={spot}/>}/>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default UserSpots;
