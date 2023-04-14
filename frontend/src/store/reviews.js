import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/get";
const CREATE_REVIEW = "review/add";
const DELETE_REVIEW = "review/delete";

export const deleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })
  if(res.ok){
    dispatch(deleteReview(reviewId))
  }
};

export const getReviews = (reviews) => ({ type: GET_REVIEWS, reviews });
export const getReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const review = await res.json();

    await dispatch(getReviews(review));
  }
};

export const createReview = (review) => ({ type: CREATE_REVIEW, review });

export const createReviewThunk = (newReview) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${newReview.spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stars: newReview.rating, review: newReview.review }),
  });

  if (res.ok) {
    const review = await res.json();
    review.spotId = newReview.spotId;
    review.User = newReview.user;
    console.log(review);
    return dispatch(createReview(review));
  }
};
const initialState = { spot: {} };

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS: {
      const newState = { ...state, spot: { ...state.spot } };
      action.reviews.Reviews.forEach((review) => {
        newState.spot[review.id] = review;
      });
      return newState;
    }
    case CREATE_REVIEW: {
      const newState = { ...state, spot: { ...state.spot } };
      newState.spot[action.review.id] = action.review;
      return newState;
    }
    case DELETE_REVIEW:{
      const newState = { ...state, spot: { ...state.spot } };
     delete newState.spot[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewReducer;
