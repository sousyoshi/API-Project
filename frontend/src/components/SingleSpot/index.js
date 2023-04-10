import { useDispatch, useSelector } from "react-redux";
import { getSingleSpotThunk } from "../../store/spots";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleSpot.css";

const SingleSpot = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  console.log(spotId);
  const spot = useSelector((state) => Object.values(state.spots)[1]);
  console.log("balh", spot.SpotImages);

  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId));
  }, [dispatch]);

  return (
    <div>
      <ul className="spotImageArray">
        <h2>{spot.name}</h2>
        <p>
          {spot.city}, {spot.state} {spot.country}
        </p>
        {spot.SpotImages.map((spot) => {
          return (
            <li>
              <img alt="img" src={`${spot.url}`} />
            </li>
          );
        })}
      </ul>
      <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
    </div>
  );
};

export default SingleSpot;
