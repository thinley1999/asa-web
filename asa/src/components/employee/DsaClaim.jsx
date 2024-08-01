import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ItenararyService from "../services/ItenararyService";
import { useParams } from "react-router-dom";
import ClaimInput from "../general/ClaimInput";
import ClaimDropDown from "./ClainDropDown";
import RateServices from "../services/RateServices";
import SuccessMessage from "../general/SuccessMessage";
import ErrorMessage from "../general/ErrorMessage";
import AdvanceServices from "../services/AdvanceServices";
import { dzongkhags } from "../datas/dzongkhag_lists";

const DsaClaim = () => {
  const [itinararies, setItineraries] = useState([]);
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [dsa_amount, setDsaAmount] = useState({ Nu: 0, INR: 0, USD: 0 });
  const [countries, setCountries] = useState([]);
  const [newForm, setNewForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [advance, setAdvance] = useState(null);
  const [showButton, setShowButton] = useState(true);

  const handleRowClicked = (row) => {
    setFormData(row);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchCountry = async () => {
    if (advance?.advance_type === "in_country_tour_advance") {
      setCountries(dzongkhags);
    } else if (advance?.advance_type === "ex_country_tour_advance") {
      try {
        const response = await RateServices.getCountryTo();
        if (response && response.status === 200) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
  };

  const calculateDsa = () => {
    if (!advance || !advance.advance_percentage) {
      console.error("Advance or advance_percentage is not defined");
      return;
    }

    let Nu = 0;
    let INR = 0;
    let USD = 0;

    itinararies.forEach((row) => {
      const rate = parseFloat(row.rate);
      if (row.currency === "Nu" && !isNaN(rate)) {
        Nu += rate;
      } else if (row.currency === "INR" && !isNaN(rate)) {
        INR += rate;
      } else if (row.currency === "USD" && !isNaN(rate)) {
        USD += rate;
      } else {
        console.error("Invalid rate or currency:", row);
      }
    });

    const advancePercentage = parseFloat(advance.advance_percentage);

    if (isNaN(advancePercentage)) {
      console.error("Advance percentage is NaN:", advance.advance_percentage);
      return;
    }

    setDsaAmount({
      Nu: (Nu * (1 - advancePercentage)).toFixed(2),
      INR: (INR * (1 - advancePercentage)).toFixed(2),
      USD: (USD * (1 - advancePercentage)).toFixed(2),
    });
  };

  const handleSave = async () => {
    const { isValid, errors } = validateData();
    setErrors(errors);
    if (!isValid) return;

    try {
      const { from, to, dsa_percentage, days, mode, mileage, halt_at } =
        formData;

      const rate = await fetchRate(
        from,
        to,
        dsa_percentage,
        days,
        mode,
        mileage,
        halt_at
      );

      const updatedFormData = {
        ...formData,
        rate,
      };

      console.log("updatedFormData", updatedFormData);

      const response = await ItenararyService.updateRow(updatedFormData);
      if (response) {
        fetchItinaries();
      }
      setSuccessMessage("Data Updated Successfully");
    } catch (error) {
      console.error("Error fetching countries:", error);
      setErrorMessage(error);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    try {
      const response = await ItenararyService.deleteRow(formData.id);

      if (response) {
        fetchItinaries();
      }
      setSuccessMessage("Delete Successful");
    } catch (error) {
      console.error("Error fetching countries:", error);
      setErrorMessage(error);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddRow = async () => {
    const { isValid, errors } = validateData();
    setErrors(errors);
    if (!isValid) return;

    if (newForm) {
      try {
        const { from, to, dsa_percentage, days, mode, mileage, halt_at } =
          formData;

        const rate = await fetchRate(
          from,
          to,
          dsa_percentage,
          days,
          mode,
          mileage,
          halt_at
        );

        const updatedFormData = {
          ...formData,
          rate,
        };

        const response = await ItenararyService.addRow(updatedFormData);
        if (response) {
          fetchItinaries();
        }
        setSuccessMessage("New rows added successfully");
      } catch (error) {
        console.error("Error fetching countries:", error);
        setErrorMessage(error);
      }
    }
    setNewForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetForm = () => {
    setNewForm(true);
    setFormData({
      start_date: null,
      end_date: null,
      to: null,
      halt_at: null,
      mode: null,
      mileage: null,
      dsa_percentage: null,
      days: null,
      rate: null,
      advance_id: id,
    });
  };

  const getNumberOfDays = (start_date, end_date) => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
  };

  const validateData = () => {
    const {
      start_date,
      end_date,
      from,
      to,
      mode,
      mileage,
      halt_at,
      dsa_percentage,
    } = formData;
    const newErrors = {};

    if (!start_date) newErrors.start_date = "Start date is required";
    if (!end_date) newErrors.end_date = "End date is required";
    if (!from) newErrors.from = "From location is required";
    if (!to) newErrors.to = "To location is required";
    if (!mode) newErrors.mode = "Mode of travel is required";
    if (!dsa_percentage)
      newErrors.dsa_percentage = "DSA percentage is required";

    if (mode === "Private Vehicle" && !mileage) {
      newErrors.mileage = "Mileage is required for private vehicle";
    }

    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (endDate <= startDate) {
        newErrors.end_date = "End date must be greater than start date";
      }
    }

    if (halt_at == "on") {
      newErrors.halt_at = "Halt location is required when halt is checked";
    }

    if (Object.keys(newErrors).length === 0) {
      return { isValid: true, errors: {} };
    }

    return { isValid: false, errors: newErrors };
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "start_date" || name === "end_date") {
      const { start_date, end_date } = { ...formData, [name]: value };
      if (start_date && end_date) {
        if (new Date(start_date) >= new Date(end_date)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            end_date: "End date must be greater than start date",
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, end_date: "" }));
          const days = getNumberOfDays(start_date, end_date);
          setFormData((prevData) => ({ ...prevData, days: days }));
        }
      }
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const hours = ("0" + d.getHours()).slice(-2);
    const minutes = ("0" + d.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      if (response && response.data) {
        setAdvance(response.data);
      } else {
        console.error("No data received from advance API");
      }
    } catch (error) {
      console.error("Error fetching advance:", error);
    }
  };

  const fetchItinaries = async () => {
    try {
      const response = await ItenararyService.getItineraries(id);
      if (response) {
        setItineraries(response);
        if (response.length > 0) {
          setFormData(response[0]);
        } else {
          console.error("No itineraries found");
        }
      } else {
        console.error("No response from itineraries API");
      }
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  const fetchRate = async (
    from,
    to,
    dsaPercentage,
    days,
    mode,
    mileage,
    halt_at,
    type
  ) => {
    try {
      if (mode === "Private Vehicle") {
        return dsaPercentage * 16 * mileage;
      }

      let response;
      if (advance.advance_type === "in_country_tour_advance") {
        response = await RateServices.getRate("Bhutan", "Bhutan");
      } else if (advance.advance_type === "ex_country_tour_advance") {
        if (halt_at) {
          response = await RateServices.getStopOverRate(
            halt_count + 1,
            halt_at
          );
        } else if (
          (from === "India" && to === "India") ||
          (from === "Bhutan" && to === "Bhutan")
        ) {
          response = await RateServices.getRate(from, to);
        } else if (
          (from === "Bhutan" && to === "India") ||
          (from === "India" && to === "Bhutan")
        ) {
          response = await RateServices.getRate("Other", to);
        } else if (
          (from != "India" && to === "Bhutan") ||
          (from != "India" && to === "India")
        ) {
          response = await RateServices.getRate("Other", to);
        } else {
          response = await RateServices.getThirdCountryRate(to);
        }
      }

      if (response) {
        return dsaPercentage * days * response.rate;
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
      throw error;
    }
  };

  const handleClaim = async () => {
    try {
      const response = await AdvanceServices.claimDsa(id, dsa_amount);
      if (response) {
        setSuccessMessage("Dsa Claimed Successfully");
        setShowButton(false);
      }
    } catch (error) {
      console.error("Error fetching advance:", error);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleCloseErrorMessage = () => {
    setErrors("");
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f4f2ff",
        color: "#6e6893",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
  };

  const columns = [
    {
      name: "From Date",
      sortable: true,
      selector: (row) => row.start_date,
    },
    {
      name: "To Date",
      sortable: true,
      selector: (row) => row.end_date,
    },
    {
      name: "From",
      selector: (row) => row.from,
    },
    {
      name: "To",
      selector: (row) => row.to,
    },
    {
      name: "DSA Percent",
      selector: (row) => row.dsa_percentage,
    },
    {
      name: "No. of Days",
      selector: (row) => row.days,
    },
    {
      name: "DSA Amount",
      selector: (row) => row.rate,
    },
  ];

  useEffect(() => {
    fetchItinaries();
    fetchAdvance();
  }, []);

  useEffect(() => {
    fetchCountry();
  }, [advance]);

  useEffect(() => {
    if (formData && itinararies.length > 0 && advance) {
      calculateDsa();
    }
  }, [formData, itinararies, advance]);

  if (formData === null) {
    return null;
  }

  console.log("formData:", formData);
  console.log("itineraries", itinararies);
  console.log("advance", advance);

  return (
    <div>
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={handleCloseSuccessMessage}
        />
      )}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={handleCloseErrorMessage}
        />
      )}
      <div className="bg-white px-4 py-4">
        <div className="row w-100">
          <ClaimInput
            label="From Date"
            type="datetime-local"
            name="start_date"
            value={formatDateForInput(formData.start_date)}
            handleChange={handleFormChange}
            errors={errors?.start_date}
          />
          <ClaimInput
            label="To Date"
            type="datetime-local"
            name="end_date"
            value={formatDateForInput(formData.end_date)}
            handleChange={handleFormChange}
            errors={errors?.end_date}
          />
          <ClaimDropDown
            label="From"
            name="from"
            disoptions="Select From"
            value={formData.from}
            handleChange={handleFormChange}
            dropDown={countries}
            errors={errors?.from}
          />
          <ClaimDropDown
            label="To"
            name="to"
            disoptions="Select To"
            value={formData.to}
            handleChange={handleFormChange}
            dropDown={countries}
            errors={errors?.to}
          />
          <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
            <label></label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="halt_at"
                checked={formData.halt_at ? true : false}
                onChange={handleFormChange}
              />
              <label className="form-check-label">Halt?</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="return"
                onChange={handleFormChange}
              />
              <label className="form-check-label">
                Return on the same day?
              </label>
            </div>
          </div>
          <ClaimDropDown
            label="Halt AT"
            name="halt_at"
            value={formData.halt_at}
            handleChange={handleFormChange}
            dropDown={countries}
            isDisable={formData?.halt_at ? false : true}
            errors={errors?.halt_at}
            disoptions="Select Halt Location"
          />
          <ClaimDropDown
            label="Mode of Travel"
            name="mode"
            disoptions="Select Mode"
            value={formData.mode}
            handleChange={handleFormChange}
            dropDown={["Airplane", "Train", "Private Vehicle", "Pool Vehicle"]}
            errors={errors?.mode}
          />
          <ClaimInput
            label="Mileage"
            type="number"
            name="mileage"
            value={formData.mileage}
            handleChange={handleFormChange}
            isDisable={formData?.mode === "Private Vehicle" ? false : true}
            errors={errors?.mileage}
          />
          <ClaimDropDown
            label="DSA Percentage"
            name="dsa_percentage"
            value={formData.dsa_percentage}
            handleChange={handleFormChange}
            dropDown={["100", "50"]}
            errors={errors?.dsa_percentage}
            disoptions="Select Percentage"
          />
          <ClaimInput
            label="No. of Days"
            type="number"
            name="days"
            value={formData.days}
            handleChange={handleFormChange}
            isDisable={true}
          />
        </div>
        <div className="d-flex justify-content-start">
          <button
            type="button"
            className="btn btn-primary me-5 mb-2 mybtn"
            onClick={handleSave}
          >
            Update
          </button>
          <button
            type="button"
            className="btn btn-primary me-5 mb-2 mybtn"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        <div className="divider1"></div>
        <div className="row w-100">
          <DataTable
            columns={columns}
            data={itinararies}
            customStyles={customStyles}
            onRowClicked={handleRowClicked}
          />
        </div>
        <div className="divider1"></div>
        <ClaimInput
          label="DSA Amount"
          type="text"
          name="dsa_amount"
          value={
            advance?.advance_type === "ex_country_tour_advance"
              ? `Nu.${dsa_amount?.Nu}, INR.${dsa_amount?.INR}, USD.${dsa_amount?.USD}`
              : `Nu.${dsa_amount?.Nu}`
          }
          isDisable={true}
        />
        {showButton && (
          <div className="bg-white px-4 pb-3 text-center">
            <button
              type="submit"
              className="btn btn-primary px-5"
              onClick={handleClaim}
            >
              Claim Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DsaClaim;
