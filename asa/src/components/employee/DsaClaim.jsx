import React, { useState } from "react";
import DataTable from "react-data-table-component";

const DsaClaim = () => {
  const [haltChecked, setHaltChecked] = useState(true);
  const [returnChecked, setReturnChecked] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    halt: true,
    dsaPercent: "100",
    day: "",
    dsaAmount: "",
  });

  const handleReturnChange = (e) => {
    const isChecked = e.target.checked;
    setReturnChecked(isChecked);
    if (isChecked) {
      setHaltChecked(false);
    }
  };

  const handleHaltChange = (e) => {
    const isChecked = e.target.checked;
    setHaltChecked(isChecked);

    if (isChecked) {
      setReturnChecked(false);
    }
  };

  const formatDateForInput = (dateString) => {
    const [date, time, period] = dateString.split(" ");
    const [month, day, year] = date.split("/");
    const [hours, minutes] = time.split(":");
    const formattedHours =
      period.toLowerCase() === "pm" && hours !== "12"
        ? String(Number(hours) + 12).padStart(2, "0")
        : hours.padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");
    return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}`;
  };

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
      fromDate: "",
      toDate: "",
      halt: true,
      dsaPercent: "100",
      day: "",
      dsaAmount: "",
    });
    setHaltChecked(true); // Reset checkboxes if needed
    setReturnChecked(false); // Reset checkboxes if needed
    setIsEditable(true); // Ensure inputs are editable after reset
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
      selector: (row) => row.fromDate,
    },
    {
      name: "To Date",
      sortable: true,
      selector: (row) => row.toDate,
    },
    {
      name: "Halt",
      selector: (row) => row.halt,
    },
    {
      name: "DSA Percent",
      selector: (row) => row.dsaPercent,
    },
    {
      name: "No. of Days",
      selector: (row) => row.days,
    },
    {
      name: "DSA Amount",
      selector: (row) => row.dsaAmount,
    },
  ];

  const data = [
    {
      id: 1,
      fromDate: "07/17/2024 10:07 AM",
      toDate: "07/17/2024 10:07 PM",
      halt: "true",
      dsaPercent: "100",
      days: "1",
      dsaAmount: "2000",
    },
    {
      id: 2,
      fromDate: "07/17/2024 10:07 AM",
      toDate: "07/22/2024 10:07 PM",
      halt: "false",
      dsaPercent: "50",
      days: "5",
      dsaAmount: "5000",
    },
  ];

  return (
    <div className="bg-white px-4 py-4">
      <div className="row w-100">
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label className="form-label">
            From Date <span className="reqspan">*</span>
          </label>
          <input
            type="datetime-local"
            className="form-control"
            name="fromDate"
            value={formData.fromDate}
            onChange={(e) =>
              setFormData({ ...formData, fromDate: e.target.value })
            }
            disabled={!isEditable}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label className="form-label">
            To Date <span className="reqspan">*</span>
          </label>
          <input
            type="datetime-local"
            className="form-control"
            name="toDate"
            value={formData.toDate}
            onChange={(e) =>
              setFormData({ ...formData, toDate: e.target.value })
            }
            disabled={!isEditable}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label></label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="halt"
              checked={haltChecked}
              onChange={handleHaltChange}
              disabled={!isEditable}
            />
            <label className="form-check-label">Halt?</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="return"
              checked={returnChecked}
              onChange={handleReturnChange}
              disabled={!isEditable}
            />
            <label className="form-check-label">Return on the same day?</label>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label className="form-label">Halt At</label>
          <input
            type="text"
            className="form-control"
            name="haltAt"
            disabled={returnChecked || !isEditable}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label className="form-label">
            DSA Percent <span className="reqspan">*</span>
          </label>
          <select
            className="form-select"
            name="dsaPercent"
            value={formData.dsaPercent}
            onChange={(e) =>
              setFormData({ ...formData, dsaPercent: e.target.value })
            }
            disabled={!isEditable}
          >
            <option value="100">100</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label className="form-label">DSA Amount (Per Day)</label>
          <input
            className="form-control"
            type="text"
            name="amount"
            value={formData.dsaAmount}
            onChange={(e) =>
              setFormData({ ...formData, dsaAmount: e.target.value })
            }
            disabled={!isEditable}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label className="form-label">No. of Days</label>
          <input
            className="form-control"
            type="text"
            name="day"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            disabled={!isEditable}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
          <label className="form-label">DSA Amount</label>
          <input
            className="form-control"
            type="text"
            name="dsaAmount"
            value={formData.dsaAmount}
            onChange={(e) =>
              setFormData({ ...formData, dsaAmount: e.target.value })
            }
            disabled={!isEditable}
          />
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
          <label className="form-label">Other Details</label>
          <textarea
            className="form-control"
            name="otherDetails"
            rows="4"
            disabled={!isEditable}
          ></textarea>
        </div>
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
          data={data}
          customStyles={customStyles}
          onRowClicked={handleRowClicked}
        />
      </div>
    </div>
  );
};

export default DsaClaim;
