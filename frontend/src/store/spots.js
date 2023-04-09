const GET_SPOTS = "spots/get";

export const getSpots = (spots) => ({ type: GET_SPOTS, spots});

export const getSpotsThunk = () => async (dispatch) => {
  const res = await fetch("/api/spots");
  if (res.ok) {
    const spots = await res.json();

    dispatch(getSpots(spots));
  }
};

const initialState = { allSpots: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS:
      const newState = {...state};

      action.spots.Spots.forEach((spot) => {

        newState.allSpots[spot.id] = spot;
      });
     return newState
    default:
      return state;
  }
};

export default spotsReducer;
