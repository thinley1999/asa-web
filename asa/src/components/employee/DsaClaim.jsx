import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ItenararyService from "../services/ItenararyService";
import { useParams } from "react-router-dom";
import ClaimInput from "../general/ClaimInput";
import ClaimDropDown from "./ClainDropDown";

const DsaClaim = () => {
  const [returnChecked, setReturnChecked] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [itinararies, setItineraries] = useState([]);
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [dsa_amount, setDsaAmount] = useState(0);

  const handleRowClicked = (row) => {
    setFormData({
      fromDate: formatDateForInput(row.fromDate),
      toDate: formatDateForInput(row.toDate),
      halt: row.halt === "true",
      dsaPercent: row.dsaPercent,
      day: row.days,
      dsaAmount: row.dsaAmount,
    });
    setHaltChecked(row.halt === "true");
    setReturnChecked(row.halt !== "true");
    setIsEditable(false);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleResetClick = () => {
    setFormData({
      start_date: "",
      end_date: "",
      from: "",
      to: "",
      mode: "",
      halt_at: "",
      dsa_percentage: "",
      days: "",
      rate: "",
    });
    setHaltChecked(true);
    setReturnChecked(false);
    setIsEditable(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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

  const fetchItinaries = async () => {
    try {
      const response = await ItenararyService.getItineraries(id);

      if (response) {
        setItineraries(response);
        setFormData(response[0]);
      }
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
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
  }, []);

  if (formData === null) {
    return null;
  }

  console.log("formData:", formData);

  return (
    <div className="bg-white px-4 py-4">
      <div className="row w-100">
        <ClaimInput
          label="From Date"
          type="datetime-local"
          name="start_date"
          value={formatDateForInput(formData.start_date)}
          handleChange={handleFormChange}
        />
        <ClaimInput
          label="To Date"
          type="datetime-local"
          name="end_date"
          value={formatDateForInput(formData.end_date)}
          handleChange={handleFormChange}
        />
        <ClaimDropDown
          label="From"
          name="from"
          value={formData.from}
          handleChange={handleFormChange}
          dropDown={["In", "Out"]}
        />
        <ClaimDropDown
          label="To"
          name="to"
          value={formData.to}
          handleChange={handleFormChange}
          dropDown={["In", "Out"]}
        />
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label></label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="halt"
              checked={formData.halt_at ? true : false}
              disabled={!isEditable}
            />
            <label className="form-check-label">Halt?</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="return"
              disabled={!isEditable}
            />
            <label className="form-check-label">Return on the same day?</label>
          </div>
        </div>
        <ClaimDropDown
          label="Halt AT"
          name="halt_at"
          value={formData.halt_at}
          handleChange={handleFormChange}
          dropDown={["In", "Out"]}
          isDisable={formData?.halt_at ? false : true}
        />
        <ClaimDropDown
          label="Mode of Travel"
          name="mode"
          value={formData.mode}
          handleChange={handleFormChange}
          dropDown={["Airplane", "Train", "Private Vehicle", "Pool Vehicle"]}
        />
        <ClaimInput
          label="Mileage"
          type="number"
          name="mileage"
          value={formData.mileage}
          handleChange={handleFormChange}
          isDisable={formData?.mode === "Private Vehicle" ? false : true}
        />
        <ClaimDropDown
          label="DSA Percentage"
          name="dsa_percentage"
          value={formData.dsa_percentage}
          handleChange={handleFormChange}
          dropDown={["100", "50"]}
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
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary me-5 mb-2 mybtn"
          onClick={handleResetClick}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-primary me-5 mb-2 mybtn"
          onClick={handleEditClick}
        >
          Edit
        </button>
        <button type="submit" className="btn btn-primary me-5 mb-2 mybtn">
          Save
        </button>
        <button type="submit" className="btn btn-primary me-5 mb-2 mybtn">
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
        value={dsa_amount}
        isDisable={true}
      />
      <div className="bg-white px-4 pb-3 text-center">
        <button type="submit" className="btn btn-primary px-5">
          Claim Now
        </button>
      </div>
    </div>
  );
};

export default DsaClaim;
