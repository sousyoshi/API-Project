import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createSpotThunk, editSpotThunk } from "../../store/spots";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./SpotForm.css";

const SpotForm = ({ spot, formType }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("");
  const [newUrl, setUrl] = useState({ url: "", preview: true });
  const [newUrl2, setUrl2] = useState({ url: "", preview: true });
  const [newUrl3, setUrl3] = useState({ url: "", preview: true });
  const [newUrl4, setUrl4] = useState({ url: "", preview: true });
  const [newUrl5, setUrl5] = useState({ url: "", preview: true });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [valErrors, setValErrors] = useState({});

  useEffect(() => {
    if (!!spot) {
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setDescription(spot.description);
      setPrice(spot.price);
      setName(spot.name);
    }
  }, [spot]);

  useEffect(() => {
    if (hasSubmitted) {
      const errors = {};
      if (!country?.length) errors.country = "Country is required";
      if (!city?.length) errors.city = "City is required";
      if (!address?.length) errors.address = "Address is required";
      if (!state?.length) errors.state = "State is required";
      if (description?.length < 30) errors.description = "Description needs a minimum of 30 characters";
      if (!name?.length) errors.name = "Name is required";
      if (!price?.length) errors.price = "Price is required";
      if (!newUrl?.url.length) errors.newUrl = "Preview image is required";
      if (!newUrl?.url.endsWith(".png") && !newUrl?.url.endsWith(".jpeg") && !newUrl?.url.endsWith(".jpg"))
        errors.newUrlImages = "Image URL must end in .png, .jpg, or .jpeg";

      setValErrors(errors);
    }
  }, [country, city, address, description, name, price, state, newUrl, hasSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const newSpot = { ...spot, ownerId: user.id, country, lat: 88, lng: 150.595959, city, address, description, name, price, state };
    console.log(newSpot);
    if (formType === "Update your spot") {
      const newerSpot = await dispatch(editSpotThunk(newSpot));
      history.push(`/spots/${spot.id}`);
      return newerSpot;
    } else {
      const newerSpot = await dispatch(createSpotThunk(newSpot, [newUrl, newUrl2, newUrl3]));
      if (newerSpot) {
        const newNew = newerSpot;
        history.push(`/spots/${newNew.id}`);
      }
    }

    setAddress("");
    setCountry("");
    setAddress("");
    setCity("");
    setState("");
    setDescription("");
    setPrice("");
    setName("");
    setHasSubmitted(false);
  };

  return (
    <form className="spotForm" onSubmit={handleSubmit}>
      <h2>{formType}</h2>
      <fieldset className="firstField">
        <h3>Where's your place located?</h3>
        <p>Guests will only see your exact address once they booked a reservation.</p>
        <div className="countryStateDiv">
           <label className="countryLabel">
          Country: {valErrors.country && <div className="errors">{valErrors.country}</div>}
          <input placeholder="Country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
        </label>
        <label>
          Street Address: {valErrors.address && <div className="errors">{valErrors.address}</div>}
          <input placeholder="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>{" "}
        </div>

        <div className="stateDiv">
          <label>
            City: {valErrors.city && <div className="errors">{valErrors.city}</div>}
            <input placeholder="City" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            State: {valErrors.state && <div className="errors">{valErrors.state}</div>}
            <input placeholder="STATE" type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </label>
        </div>
      </fieldset>

      <h3>Describe your place to guests</h3>
      <p>
        Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the
        neighborhood.
      </p>
      <label className="textarea">
        {valErrors.description && <div className="errors">{valErrors.description}</div>}
        <textarea
          rows={6}
          cols={80}
          placeholder="Please write at least 30 characters"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <h3>Create a title for your spot</h3>
      <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
      <label>
        {valErrors.name && <div className="errors">{valErrors.name}</div>}
        <input placeholder="Name of your spot" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <h3>Set a base price for your spot</h3>
      <p>Competitve pricing can help your listing stand out and rank higher in search results</p>
      <label>
        {valErrors.price && <div className="errors">{valErrors.price}</div>}
        <span className="priceInput">
          <input placeholder="Price per night (USD)" type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </span>
      </label>
      {formType === "Create a new Spot" ? (
        <div>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          {valErrors.newUrl && <div className="errors">{valErrors.newUrl}</div>}
          {valErrors.newUrlImages && <div className="errors">{valErrors.newUrlImages}</div>}
          <input
            placeholder="Preview Image URL"
            type="text"
            value={newUrl.url}
            onChange={(e) => setUrl({ ...newUrl, url: e.target.value })}
          />{" "}
          <input
            placeholder="Image URL"
            type="text"
            value={newUrl2.url}
            onChange={(e) => setUrl2({ ...newUrl2, url: e.target.value })}
          />{" "}
          <input
            placeholder="Image URL"
            type="text"
            value={newUrl3.url}
            onChange={(e) => setUrl3({ ...newUrl3, url: e.target.value })}
          />{" "}
          <input
            placeholder="Image URL"
            type="text"
            value={newUrl4.url}
            onChange={(e) => setUrl4({ ...newUrl4, url: e.target.value })}
          />{" "}
          <input
            placeholder="Image URL"
            type="text"
            value={newUrl5.url}
            onChange={(e) => setUrl5({ ...newUrl5, url: e.target.value })}
          />{" "}
        </div>
      ) : null}

      <button className="submitForm" type="submit">
        {formType}
      </button>
    </form>
  );
};

export default SpotForm;
