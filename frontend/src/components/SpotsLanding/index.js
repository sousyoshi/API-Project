import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import { useEffect } from "react";
import "./SpotsLanding.css";


const SpotsLanding = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getSpotsThunk());
  }, [dispatch]);

  return (
    <main className="spotContainer">
      {spots.map((spot) => {
        return (
          <div className="spotDiv" key={spot.id}>
            <a href={`/spots/${spot.id}`}>
              {" "}
              <img className="spotImage" src={spot.previewImage} alt="img" title={spot.name} />
            </a>

            <p className="spotDetails">
              {spot.city}, {spot.state}
            </p>
            <p className="spotRating"><i className="fa-solid fa-star"></i>{spot.avgRating ? spot.avgRating.toFixed(1) : "New"}</p>
            <p className="spotPrice">${spot.price.toLocaleString("en-US")} night</p>
          </div>
        );
      })}
    </main>
  );
};

export default SpotsLanding;
