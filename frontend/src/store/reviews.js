import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/get";

export const getReviews = (reviews) => ({ type: GET_REVIEWS, reviews });
export const getReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const review = await res.json();

    dispatch(getReviews(review));
  }
};

const initialState = { spot: { } };

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS:
      const newState = { ...state, spot: {...state.spot} };
      action.reviews.Reviews.forEach((review) => {
        newState.spot[review.id] = review;
   });
      return newState;
    default:
      return state;
  }
};

export default reviewReducer;
