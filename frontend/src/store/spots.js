import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/get";
const SINGLE_SPOT = "spots/one";
const EDIT_SPOT = "spot/edit";
const CREATE_SPOT = "spots/add";
const CREATE_IMAGE = "spotImage/add";
const DELETE_SPOT = "spots/delete";

export const deleteSpot = (spotId) => ({ type: DELETE_SPOT, spotId });
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    return dispatch(deleteSpot(spotId));
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

    const newSpot = await dispatch(editSpot(spot));

    return newSpot;
  }
};

export const getSpots = (spots) => ({ type: GET_SPOTS, spots });
export const getSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  if (res.ok) {
    const spots = await res.json();

    await dispatch(getSpots(spots));
    return spots;
  }
};
export const getSingleSpot = (spot) => ({ type: SINGLE_SPOT, spot });
export const getSingleSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
    const spotData = await dispatch(getSingleSpot(spot));

    return spotData;
  }
};

export const createSpot = (spot) => ({ type: CREATE_SPOT, spot });
export const createImage = (image) => ({ type: CREATE_IMAGE, image });
export const createSpotThunk = (spot, urlArr) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const spot = await res.json();
    await dispatch(createSpot(spot));
    for (let i = 0; i < urlArr.length; i++) {
      const imageRes = await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlArr[i]),
      });
      const image = await imageRes.json();
      if (imageRes.ok) {
        await dispatch(createImage(image));
      }
    }

    return spot;
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
      const newState = { ...state, singleSpot: { ...state.singleSpot } };
      newState.singleSpot = action.spot;
      return newState;
    }
    case EDIT_SPOT: {
      const newState = { ...state, singleSpot: {} };
      newState.singleSpot[action.spot.id] = action.spot;
      return newState;
    }
    case CREATE_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { SpotImages: [], Owner: {} } };
      newState.allSpots[action.spot.id] = action.spot;
      return newState;
    }

    case CREATE_IMAGE:
      const newState = { ...state, singleSpot: { SpotImages: [], Owner: {} } };
      newState.singleSpot.SpotImages.push(action.image);
      return newState;

    case DELETE_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { SpotImages: [], Owner: {} } };
      delete newState.allSpots[action.spotId];
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
