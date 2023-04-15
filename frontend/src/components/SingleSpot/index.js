import { useDispatch, useSelector } from "react-redux";
import { getSingleSpotThunk } from "../../store/spots";
import { getReviewsThunk } from "../../store/reviews";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import "./SingleSpot.css";
import PostReviewModal from "../PostReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";

const SingleSpot = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => Object.values(state.spots)[1]);
  const reviews = useSelector((state) => Object.values(state.reviews)[0]);
  const reviewVal = Object.values(reviews);
  const sessionUser = useSelector((state) => state.session.user);
  console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS", reviewVal);

  const reviewArr = reviewVal.filter((review) => {
    return review?.userId === sessionUser?.id;
  });

  const sortedReviews = reviewVal.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const userOwnedSpot = sessionUser?.id === spot.Owner?.id;
  console.log(reviewArr, userOwnedSpot);

  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId));
    dispatch(getReviewsThunk(spotId));
  }, [dispatch]);

  const comingSoon = () => {
    alert("Feature coming soon.");
  };
  if (!spot || !reviews) return <h1>Loading...</h1>;

  return (
    <main className="main">
      <h2>{spot.name}</h2>
      <p>
        {spot.city}, {spot.state} {spot.country}
      </p>
      <ul className="spotImageArray">
        {spot.SpotImages?.map((spot) => {
          return (
            <li key={spot.id}>
              <img className="image" alt="img" src={spot?.url} />
            </li>
          );
        })}
      </ul>
      <h2>
        Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
      </h2>
      <p>{spot.description}</p>
      <section className="calloutBox">
        <h3>${spot.price?.toLocaleString("en-US")} night </h3>
        <i class="fa-solid fa-star"></i>
        <p>{spot.avgStarRating?.toFixed(2) || "New"} </p>
        {spot.numReviews === 0 ? null : (
          <div>
            {" "}
            <p> &#x2022;</p>
            <p>{spot.numReviews > 1 ? `${spot.numReviews} reviews` : `${spot.numReviews} review`}</p>
          </div>
        )}

        <button onClick={comingSoon} className="reserve">
          Reserve
        </button>
      </section>
      <div>
        <i class="fa-solid fa-star"></i> <h2>{!!reviewVal.length ? spot.avgStarRating?.toFixed(2) : "New"}</h2>
        {spot.numReviews === 0 ? null : (
          <div>
            <h2>&#x2022;</h2>
            <h2>{spot.numReviews >= 1 ? `${spot.numReviews} reviews` : `${spot.numReviews} review` ? spot.numReviews === 0 : null}</h2>
          </div>
        )}
      </div>
      {!!sessionUser && !reviewArr.length && !userOwnedSpot && (
        <div>
          {" "}
          <OpenModalButton buttonText={"Post your Review"} modalComponent={<PostReviewModal spot={spot} />} />
        </div>
      )}
      <ul>
        {!reviewVal.length && !userOwnedSpot ? "Be the first to post a review!": sortedReviews.map((review) => {
          return (
            <li key={review?.id}>
              {review.User.firstName},{" "}
              {new Date(review.createdAt.slice(0, 10)).toLocaleDateString("en-US", { month: "long", year: "numeric" })},{" "}
              {review.review}{" "}
              {sessionUser && sessionUser?.id === review.User.id && (
                <OpenModalButton buttonText={"Delete"} modalComponent={<DeleteReviewModal reviewVal={reviewVal} spotId={spotId} />} />
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default SingleSpot;
