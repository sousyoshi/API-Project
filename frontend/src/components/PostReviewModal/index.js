import "./PostReviewModal.css";
const PostReviewModal = () => {

  
  return (
    <>
      {" "}
      <h1>How was your stay</h1>
      <form>
        <textarea placeholder="Just a quick review"></textarea>
        <div className="rating-input">
          <div className="filled">
            <i class="fa-solid fa-star"></i>

            <i class="fa-solid fa-star"></i>

            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>

            <i class="fa-solid fa-star"></i>
          </div>
          <p>Stars</p>
        </div>
      </form>
      <button>Submit Your Review</button>
    </>
  );
};
export default PostReviewModal;
