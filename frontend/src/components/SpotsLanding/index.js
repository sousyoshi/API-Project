import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import { useEffect } from "react";

const SpotsLanding = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  console.log(spots)

  useEffect(() => {
    dispatch(getSpotsThunk());
  }, [dispatch]);

  return (
    <section>
      <ul>
        {spots.map((spot) => {
          return (
             <li key={spot.id}>{spot.address}</li>
          )
        })}
      </ul>
    </section>
  );
};

export default SpotsLanding;
