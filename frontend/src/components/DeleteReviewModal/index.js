import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";


const DeleteReviewModal = ({ spot }) => {
    const dispatch = useDispatch()
   const {closeModal} = useModal()

  const deleteSpot = async() => {
     return dispatch(deleteReviewThunk(spot.id)).then(closeModal)
  };

  return (
    <>
      <section>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
        <button onClick={deleteSpot}>Yes (Delete Review)</button>
        <button onClick={closeModal}>No (Keep Review)</button>
      </section>
    </>
  );
};

export default DeleteReviewModal;
