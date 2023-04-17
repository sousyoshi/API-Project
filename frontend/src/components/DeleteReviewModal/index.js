import { useDispatch, useSelector } from "react-redux";
import { deleteReviewThunk, getReviewsThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import {useHistory} from "react-router-dom"
import { getSingleSpotThunk } from "../../store/spots";


const DeleteReviewModal = ({ reviewVal, spotId }) => {
    const dispatch = useDispatch()
    const history = useHistory();
    const user = useSelector(state=>state.session.user)
   const {closeModal} = useModal()
   console.log('these right hreere',user.id)


const reviewId = reviewVal.find(review => review.userId === user.id)
console.log('theseseeeeeeeee', reviewId)

  const deleteSpot = async() => {
     await dispatch(deleteReviewThunk(reviewId.id))
     await dispatch(getReviewsThunk(spotId))
     await dispatch(getSingleSpotThunk(spotId))
     await closeModal()
     await history.push(`/api/spots/${spotId}`)
  };

  return (
    <>
      <form onSubmit={deleteSpot}>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
        <button type='submit'>Yes (Delete Review)</button>
        <button onClick={closeModal}>No (Keep Review)</button>
      </form>
    </>
  );
};

export default DeleteReviewModal;
