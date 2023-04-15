import { useDispatch, useSelector } from "react-redux";
import { deleteReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";


const DeleteReviewModal = ({ reviewVal }) => {
    const dispatch = useDispatch()
    const user = useSelector(state=>state.session.user)
   const {closeModal} = useModal()
   console.log('these right hreere',user.id)
const reviewId = reviewVal.find(review => review.userId === user.id)
console.log('theseseeeeeeeee', reviewId.id)
  const deleteSpot = async() => {
     await dispatch(deleteReviewThunk(reviewId.id)).then(closeModal)
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
