import createReviewThunk from '../../store/reviews'
import {  useState } from "react";
import { useDispatch } from "react-redux";
import "./PostReviewModal.css";

const PostReviewModal = ({spot}) => {
  const dispatch = useDispatch()
const [review, setReview] = useState('asdfadfadfadfadfadf')
const [rating, setRating] = useState(0)

console.log(spot.id)
// useEffect(()=>{
//   dispatch(createReviewThunk(spot))
// }, [dispatch])

const handleSubmit = async(e) =>{
  e.preventDefault();
  const newReview = {review,rating}
  return dispatch(createReviewThunk(newReview))

}

  return (
    <>
      {" "}
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Just a quick review"></textarea>
        <div className="rating-input">
          <div className="filled">
            <i className="fa-solid fa-star"></i>

            <i className="fa-solid fa-star"></i>

            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>

            <i className="fa-solid fa-star"></i>
          </div>
          <p>Stars</p>
        </div>
      </form>
      <button type='submit'>Submit Your Review</button>
    </>
  );
};
export default PostReviewModal;
