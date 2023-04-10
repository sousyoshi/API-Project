import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import { useEffect } from "react";
import "./SpotsLanding.css";
import { Link } from "react-router-dom";

const SpotsLanding = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getSpotsThunk());
  }, [dispatch]);

  return (
    <section className="spotContainer">
      {spots.map((spot) => {
        return (
          <div className="spotDiv" key={spot.id}>
            <a href={`/spots/${spot.id}`}>
              {" "}
              <img className="spotImage" src={spot.previewImage} alt="img" />
            </a>

            <p className="spotDetails">
              {spot.city}, {spot.state}
            </p>
            <p className="spotRating">{spot.avgRating ? spot.avgRating.toFixed(1) : "New"}</p>
            <p>${spot.price.toLocaleString("en-US")} night</p>
          </div>
        );
      })}
    </section>
  );
};

export default SpotsLanding;
