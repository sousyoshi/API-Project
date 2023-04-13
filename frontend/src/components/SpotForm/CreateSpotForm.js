
import SpotForm from ".";

const CreateSpotForm = () => {

  const spot = {
    country: "",
    address: "",
    city: "",
    state: "",
    description: "",
    name: "",
    price: "",

  };


  return (
    <SpotForm spot={spot} formType='Create a new Spot' />
  )
};

export default CreateSpotForm
