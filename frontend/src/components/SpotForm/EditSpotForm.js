import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SpotForm from ".";
import { useEffect } from "react";
import { getSingleSpotThunk } from "../../store/spots";

const EditSpotForm = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const data = useSelector((state) => (state.spots.singleSpot));
//   const spotData = data.find((spot) => +spot.id === +spotId);

  console.log('this is spotdata', data.address)


  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const spot = {
    country: data.country,
    address: data.address,
    city: data.city,
    state:data.state,
    description: data.description,
    name: data.name,
    price: data.price

  }

  return <SpotForm spot={spot} formType="Update your spot" />;
};
export default EditSpotForm;
