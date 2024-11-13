import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import RateServices from "../services/RateServices";
import TravelDetails from "./TravelDetails";

const TravelItinerary = ({
  rows,
  addRow,
  handleTravelItinerary,
  removeRow,
  error,
  data,
}) => {
  const [from, setFrom] = useState([]);
  const [to, setTo] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const fetchCountry = async () => {
    try {
      const [responseFrom, responseTo] = await Promise.all([
        RateServices.getCountryFrom(),
        RateServices.getCountryTo(),
      ]);

      if (responseFrom && responseFrom.status === 200) {
        setFrom(responseFrom.data);
      }

      if (responseTo && responseTo.status === 200) {
        setTo(responseTo.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  const handleDialogSubmit = async () => {};

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <div className="bg-white px-4">
      <label className="form-label">Travel Itinerary</label>
      {rows.map((row, index) => (
        <div className="row w-100" key={index}>
          <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
            <label className="form-label">Start Date</label>
            <input
              className="form-control"
              type="datetime-local"
              name="startDate"
              value={data ? row.start_date : row.startDate}
              disabled={data ? true : false}
              onChange={(e) =>
                handleTravelItinerary(index, "startDate", e.target.value)
              }
            />
          </div>
          <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
            <label className="form-label">End Date</label>
            <input
              className="form-control"
              type="datetime-local"
              name="endDate"
              disabled={data ? true : false}
              value={data ? row.end_date : row.endDate}
              onChange={(e) =>
                handleTravelItinerary(index, "endDate", e.target.value)
              }
            />
          </div>
          <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
            <label className="form-label">From</label>
            <select
              className="form-select"
              name="from"
              value={row.from}
              disabled={data ? true : false}
              onChange={(e) =>
                handleTravelItinerary(index, "from", e.target.value)
              }
            >
              <option value="" disabled>
                Select From
              </option>
              {from.map((location, index) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
            <label className="form-label">To</label>
            <select
              className="form-select"
              name="to"
              value={row.to}
              disabled={data ? true : false}
              onChange={(e) =>
                handleTravelItinerary(index, "to", e.target.value)
              }
            >
              <option value="" disabled>
                Select To
              </option>
              {to.map((location, index) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
            <label className="form-label">Mode of travel</label>
            <select
              className="form-select"
              name="mode"
              disabled={data ? true : false}
              value={row.mode}
              onChange={(e) =>
                handleTravelItinerary(index, "mode", e.target.value)
              }
            >
              <option value="" disabled>
                Select mode
              </option>
              <option value="Airplane">Airplane</option>
              <option value="Train">Train</option>
              <option value="Car">Car</option>
            </select>
          </div>
          <div className="tourdetails col-xl-1 col-lg-1 col-md-4 col-12 mb-3">
            <label className="form-label">Rate(Nu)</label>
            <input
              className="form-control"
              type="text"
              name="rate"
              disabled
              value={data ? row.amount : row.rate}
            />
          </div>
          <div className="col-xl-1 col-lg-1 col-md-2 col-12 mb-3 d-flex align-items-end justify-content-center">
            <button
              type="button"
              className="btn btn-danger"
              disabled={data ? true : false}
              onClick={() => removeRow(index)}
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>
      ))}
      {error && (
        <div className="invalid-feedback" style={{ display: "block" }}>
          {error}
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowDialog(true)}
      >
        <FaPlus size={18} />
      </button>
      {showDialog && (
        <TravelDetails isOpen={showDialog} onClose={handleDialogClose} />
      )}
    </div>
  );
};

export default TravelItinerary;
