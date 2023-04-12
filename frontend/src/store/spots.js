import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/get";
const SINGLE_SPOT = "spots/one";
const CREATE_SPOT = "spots/add";

export const getSpots = (spots) => ({ type: GET_SPOTS, spots });
export const getSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  if (res.ok) {
    const spots = await res.json();

    dispatch(getSpots(spots));
  }
};
export const getSingleSpot = (spot) => ({ type: SINGLE_SPOT, spot });
export const getSingleSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
    console.log("this is spot", spot);
    dispatch(getSingleSpot(spot));
  }
};

export const createSpot = (spot) => ({ type: CREATE_SPOT, spot });
export const createSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const spot = await res.json();
    dispatch(createSpot(spot));
    return spot
  }
};

const initialState = { allSpots: {}, singleSpot: { SpotImages: [], Owner: {} } };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      const newState = { ...state };
      action.spots.Spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });
      return newState;
    }
    case SINGLE_SPOT:{
      const newState = { ...state };
      newState.singleSpot = action.spot;
      return newState};

      case CREATE_SPOT:{
      const newState = {...state, singleSpot: {SpotImages: [], Owner: {}}};
      newState.allSpots[action.spot.id] = action.spot;

      return newState}
    default:
      return state;
  }
};

export default spotsReducer;
