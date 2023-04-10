const GET_SPOTS = "spots/get";
const SINGLE_SPOT= 'spots/one'


export const getSpots = (spots) => ({ type: GET_SPOTS, spots });
export const getSpotsThunk = () => async (dispatch) => {
  const res = await fetch("/api/spots");
  if (res.ok) {
    const spots = await res.json();

    dispatch(getSpots(spots));
  }
};
export const getSingleSpot = spot => ({type:SINGLE_SPOT, spot})
export const getSingleSpotThunk =(spotId) => async dispatch =>{
const res = await fetch(`/api/spots/${spotId}`)

if(res.ok){
  const spot = await res.json()
  console.log("this is spot", spot)
  dispatch(getSingleSpot(spot))
}
}


const initialState = { allSpots: {}, singleSpot: { SpotImages: [], Owner: {} } };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS:{
      const newState = { ...state };
      action.spots.Spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });
      return newState;}
      case SINGLE_SPOT:
        const newState = {...state};
        newState.singleSpot = action.spot;
        return newState
    default:
      return state;
  }
};

export default spotsReducer;
