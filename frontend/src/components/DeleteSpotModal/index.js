import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";

const DeleteSpotModal = ({ spot }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteSpot = async () => {
    await dispatch(deleteSpotThunk(spot.id)).then(() => closeModal());
  };

  return (
    <>
      <form className="deleteForm">
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <div>
          <button className="deleteButton" onClick={deleteSpot}>Yes (Delete Spot)</button>
          <button onClick={closeModal}>No (Keep Spot)</button>
        </div>
      </form>
    </>
  );
};

export default DeleteSpotModal;
