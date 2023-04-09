import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spots";
import { useEffect } from "react";
import './SpotsLanding.css'


const SpotsLanding = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  console.log(spots)


  useEffect(() => {
    dispatch(getSpotsThunk());
  }, [dispatch]);

  return (
    <section className="spotContainer">

        {
        spots.map((spot) => {
          return (
             <div key={spot.id}>
                 <h2>{spot.name}</h2>
                 <img className="spotImage" src={spot.previewImage} alt='img' />
                 <p>{spot.city}, {spot.state}</p>
                 <p>${(spot.price).toLocaleString("en-US")}</p>
             </div>
          )
        })}

    </section>
  );
};

export default SpotsLanding;
