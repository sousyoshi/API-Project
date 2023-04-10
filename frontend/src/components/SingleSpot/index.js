import { useDispatch, useSelector } from "react-redux";
import { getSingleSpotThunk } from "../../store/spots";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const SingleSpot = () => {
    const dispatch = useDispatch();
  const { spotId } = useParams();
  console.log(spotId);
  const spot = useSelector((state) => Object.values(state.spots)[1]);
   console.log(spot.address)

  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId));
  }, [dispatch]);

  return (
    <div>

    </div>
  );
};

export default SingleSpot;
