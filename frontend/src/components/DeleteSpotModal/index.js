

import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";


const DeleteSpotModal = ({ spot }) => {
    const dispatch = useDispatch()
   const {closeModal} = useModal()

  const deleteSpot = async() => {
     return dispatch(deleteSpotThunk(spot.id)).then(closeModal)
  };

  return (
    <>
      <section>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button onClick={deleteSpot}>Yes (Delete Spot)</button>
        <button onClick={closeModal}>No (Keep Spot)</button>
      </section>
    </>
  );
};

export default DeleteSpotModal;
