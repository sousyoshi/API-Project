import SpotForm from ".";

const EditSpotForm =() => {
    const spot = {
        country: "",
        address: "",
        city: "",
        state: "",
        description: "",
        name: "",
        price: "",
    }


    return (<SpotForm spot={spot} formType='Update a Report'/>)
}
export default EditSpotForm
