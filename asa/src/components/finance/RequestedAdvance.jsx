import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../../assets/css/main.css";
import AdvanceServices from "../services/AdvanceServices";
import { FaFilter } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const RequestedAdvance = () => {
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#F4F1F9",
        color: "#928AA2",
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

  const column = [
    {
      name: "Name",
      sortable: true,
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading p-0 m-0">{row.user.name}</p>
          <p className="datasubheading p-0 m-0">{row.user.email}</p>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading1 p-0 m-0 text-success">{row.status}</p>
          <p className="datasubheading p-0 m-0">
            Application date: {formatDate(row.created_at)}
          </p>
        </div>
      ),
    },
    {
      name: "Advance Type",
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading p-0 m-0">{row.advance_type}</p>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading p-0 m-0">{row.amount}</p>
          <p className="datasubheading p-0 m-0 text-end">NU</p>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <span className="datasubheading">
            <a href={`/viewRequestedAdvance/${row.id}`}>View More</a>
          </span>
        </div>
      ),
    },
  ];

  const all_advance = [
    "ex_country_tour_advance",
    "in_country_tour_advance",
    "other_advance",
    "salary_advance",
  ];

  const advanceParams = {
    status: ["pending"],
    advance_type: all_advance,
    type: "other_advance",
  };

  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchAdvances = async () => {
    try {
      const response = await AdvanceServices.get(advanceParams);
      setRecords(response.data.advances);
      setFilterRecords(response.data.advances);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  console.log("response", records);

  useEffect(() => {
    fetchAdvances();
  }, []);

  const handleFilter = (event) => {
    const newData = filterRecords.filter((row) =>
      row.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setRecords(newData);
  };

  return (
    <div className="mb-3">
      <div className="d-flex bg-white py-3 justify-content-center">
        <div className="filterdiv d-flex p-1 px-4">
          <span>
            <FaFilter />
          </span>
          <span className="ms-2">Filter</span>
        </div>
        <div className="ms-2">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              className="form-control"
              type="text"
              placeholder="Search application by email"
              onChange={handleFilter}
            />
          </div>
        </div>
      </div>
      <DataTable
        columns={column}
        data={records}
        customStyles={customStyles}
        pagination
      ></DataTable>
    </div>
  );
};

export default RequestedAdvance;
