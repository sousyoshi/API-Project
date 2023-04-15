

import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";


const DeleteSpotModal = ({ spot }) => {
    const dispatch = useDispatch()
   const {closeModal} = useModal()

  const deleteSpot = async() => {
     await dispatch(deleteSpotThunk(spot.id)).then(()=>closeModal())
  };

  return (
    <>
      <form>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button onClick={deleteSpot}>Yes (Delete Spot)</button>
        <button onClick={closeModal}>No (Keep Spot)</button>
      </form>
    </>
  );
};

export default DeleteSpotModal;
