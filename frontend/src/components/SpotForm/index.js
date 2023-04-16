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
  const [valErrors, setValErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSpot = { ...spot, ownerId: user.id, country, lat: 88, lng: 150.595959, city, address, description, name, price, state };
    console.log(newSpot);
    if (formType === "Update your spot") {
      const newerSpot = await dispatch(editSpotThunk(newSpot));
      console.log("this is what i need", newerSpot);
      history.push(`/spots/${spot.id}`);
    } else {
      const newerSpot = await dispatch(createSpotThunk(newSpot, newUrl));
      const newNew = newerSpot;
      history.push(`/spots/${newNew.id}`);
    }
  };

  useEffect(() => {
    if (!!spot) {
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setDescription(spot.description);
      setPrice(spot.price);
      setName(spot.name)
    }
  }, [spot]);

  useEffect(() => {
    const errors = {};
    if (!country.length) errors.country = "Country is required";
    if (!city.length) errors.city = "City is required";
    if (!address.length) errors.address = "Address is required";
    if (!state.length) errors.state = "State is required";
    if (description.length < 30) errors.description = "Description needs a minimum of 30 characters";
    if (!name.length) errors.name = "Name is required";
    if (!price.length) errors.price = "Price is required";
    if (!newUrl.url.length) errors.newUrl = "Preview image is required";
    if (!newUrl.url.endsWith(".png") && !newUrl.url.endsWith(".jpeg") && !newUrl.url.endsWith(".jpg"))
      errors.newUrlImages = "Image URL must end in .png, .jpg, or .jpeg";

    setValErrors(errors);
  }, [country, city, address, description, name, price, state, newUrl]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>{formType}</h2>
      <h3>Where's your place located?</h3>
      <p>Guests will only see your exact address once they booked a reservation.</p>
      <label className="countryLabel">
        Country: {valErrors.country && <p className="errors">{valErrors.country}</p>}
        <input placeholder="Country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
      </label>
      <label>
        Street Address: {valErrors.address && <p className="errors">{valErrors.address}</p>}
        <input placeholder="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <label>
        City: {valErrors.city && <p className="errors">{valErrors.city}</p>}
        <input placeholder="City" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
      </label>
      <label>
        State: {valErrors.state && <p className="errors">{valErrors.state}</p>}
        <input placeholder="STATE" type="text" value={state} onChange={(e) => setState(e.target.value)} />
      </label>
      <h3>Describe your place to guests</h3>
      <p>
        Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the
        neighborhood.
      </p>
      <label>
        {valErrors.description && <p className="errors">{valErrors.description}</p>}
        <textarea
          placeholder="Please write at least 30 characters"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <h3>Create a title for your spot</h3>
      <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
      <label>
        {valErrors.name && <p className="errors">{valErrors.name}</p>}
        <input placeholder="Name of your spot" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <h3>Set a base price for your spot</h3>
      <p>Competitve pricing can help your listing stand out and rank higher in search results</p>
      <label>
        {valErrors.price && <p className="errors">{valErrors.price}</p>}
        $ <input placeholder="Price per night (USD)" type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      {formType === "Create a new Spot" ? (
        <div>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            placeholder="Preview Image URL"
            type="text"
            value={newUrl.url}
            onChange={(e) => setUrl({ ...newUrl, url: e.target.value })}
          />{" "}
          {valErrors.newUrl && <p className="errors">{valErrors.newUrl}</p>}
          {valErrors.newUrlImages && <p className="errors">{valErrors.newUrlImages}</p>}
        </div>
      ) : null}

      <button type="submit">{formType}</button>
    </form>
  );
};

export default SpotForm;
