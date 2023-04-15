import { createReviewThunk } from "../../store/reviews";
import { getSpotsThunk, getSingleSpot, getSingleSpotThunk } from "../../store/spots";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./PostReviewModal.css";

const PostReviewModal = ({ spot }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const sessionUser = useSelector((state) => state.session.user);
  const {closeModal} = useModal()
  console.log(sessionUser.id, spot.id);

  useEffect(() => {
    setRating(rating);
  }, [rating]);
  const newReview = { user: sessionUser, spotId: spot.id, review, rating };
  console.log(newReview);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(createReviewThunk(newReview)).then(closeModal).then(dispatch(getSingleSpotThunk(spot.id)))

  };

  const starRating = () => {
    return (
      <div className="rating">
        {[...Array(5)].map((star, i) => {
          i++;
          return (
            <div
              key={i}
              className={i <= (hover || rating) ? "filled" : "empty"}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(rating)}
            >
              {console.log(i)}
              <i className="fa-regular fa-star"></i>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {" "}
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Just a quick review" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
        <div className="rating-input"></div>
        {starRating()}
        <p>Stars</p>
        <button type="submit">Submit Your Review</button>
      </form>
    </>
  );
};
export default PostReviewModal;
