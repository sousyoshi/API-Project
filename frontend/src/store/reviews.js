import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/get";
const CREATE_REVIEW = "reviews/add";

export const getReviews = (reviews) => ({ type: GET_REVIEWS, reviews });
export const getReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const review = await res.json();

    await dispatch(getReviews(review));
  }
};

export const createReview = (review) => ({ type: CREATE_REVIEW, review });

export const createReviewThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spot.id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const review = await res.json();
    await dispatch(createReview(review));
    return review;
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
    default:
      return state;
  }
};

export default reviewReducer;
