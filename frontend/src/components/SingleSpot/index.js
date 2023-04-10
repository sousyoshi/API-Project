import { useDispatch, useSelector } from "react-redux";
import { getSingleSpotThunk } from "../../store/spots";
import { getReviewsThunk } from "../../store/reviews";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleSpot.css";

const SingleSpot = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => Object.values(state.spots)[1]);
  const reviews = useSelector((state) => Object.values(state.reviews)[0]);
  const reviewVal = Object.values(reviews)
  // const sessionUser = useSelector(state => state.session.user);
  // console.log('this is the user', sessionUser.id === spot.Owner.id)
  console.log("reviewVal", reviewVal);

  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId));
    dispatch(getReviewsThunk(spotId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const comingSoon =() =>{
    alert('Feature coming soon')
  }

  return (
    <main>
      <ul className="spotImageArray">
        <h2>{spot.name}</h2>
        <p>
          {spot.city}, {spot.state} {spot.country}
        </p>
        {spot.SpotImages.map((spot) => {
          return (
            <li key={spot.id}>
              <img alt="img" src={spot.url} />
            </li>
          );
        })}
      </ul>
      <h2>
        Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
      </h2>
      <p>{spot.description}</p>
      <section className="calloutBox">
        <h3>${spot.price?.toLocaleString("en-US")} night </h3>
        <p>{spot.avgStarRating?.toFixed(2)}</p>
        <p>{spot.numReviews > 1 ? `${spot.numReviews} reviews` : `${spot.numReviews} review`}</p>
        <button onClick={comingSoon} className="reserve" >Reserve</button>
      </section>

      {reviewVal.map((review)=>{
        return (<li>
          {review.review}
        </li>)
      })}
    </main>
  );
};

export default SingleSpot;
