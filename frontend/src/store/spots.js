import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/get";
const SINGLE_SPOT = "spots/one";
const EDIT_SPOT = "spot/edit";
const CREATE_SPOT = "spots/add";
const CREATE_IMAGE = "spotImage/add";


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
export const createImage = (image) => ({ type: CREATE_IMAGE, image });
export const createSpotThunk = (spot, url) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const spot = await res.json();
    await dispatch(createSpot(spot));
    const imageRes = await csrfFetch(`/api/spots/${spot.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(url),
    });
    const image = await imageRes.json();
    dispatch(createImage(image));
    return spot;
  }
};

export const editSpot = (spot) => ({ type: EDIT_SPOT, spot });
export const editSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });
  if (res.ok) {
    const spot = await res.json();
    await dispatch(editSpot(spot));
    return res
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
    case SINGLE_SPOT: {
      const newState = { ...state };
      newState.singleSpot = action.spot;
      return newState;
    }
    case EDIT_SPOT: {
      const newState = { ...state };
      newState.singleSpot = action.spot;
      return newState;
    }
    case CREATE_SPOT: {
      const newState = { ...state, singleSpot: { SpotImages: [], Owner: {} } };
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    }

    case CREATE_IMAGE:
      const newState = { ...state, singleSpot: { SpotImages: [], Owner: {} } };
      newState.singleSpot.SpotImages.push(action.image);
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
