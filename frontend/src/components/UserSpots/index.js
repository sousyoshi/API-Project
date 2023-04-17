import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getSpotsThunk } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import "./UserSpots.css";

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
    <div className="userSpotContainer">
      <h1>Manage Your Spots</h1>
      <Link to={"/spots/new"}>
        <button className="userSpotButton">Create a New Spot</button>
      </Link>
      <ul>
        {userSpot.map((spot) => {
          return (
            <div className="userSpot" key={spot.id}>
              <a href={`/spots/${spot.id}`}>
                {" "}
                <img className="userSpotImage" alt="img" src={spot.previewImage} title={spot.name}></img>
              </a>

              <p className="userSpotDetails">
                {spot.city}, {spot.state}
              </p>
              <p className="userSpotRating">
                <i class="fa-solid fa-star"></i>
                {+spot?.avgRating ? spot.avgRating.toFixed(1) : "New"}
              </p>
              <p className="userSpotPrice">${spot.price} night</p>
              <div className="userButtons">
                <Link to={`/spots/${spot.id}/edit`}>
                  <button>Update</button>
                </Link>

                <OpenModalButton buttonText={"Delete"} modalComponent={<DeleteSpotModal spot={spot} />} />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default UserSpots;
