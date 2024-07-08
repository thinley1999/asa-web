import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../../assets/css/main.css";
import AdvanceServices from "../services/AdvanceServices";
import { FaFilter, FaSearch } from "react-icons/fa";

const RequestedAdvance = () => {
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

  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchAdvances = async (pageNum) => {
    const advanceParams = {
      status: ["pending"],
      advance_type: all_advance,
      type: "other_advance",
      page: pageNum,
    };

    try {
      const response = await AdvanceServices.get(advanceParams);
      setRecords(response.data.advances);
      setFilterRecords(response.data.advances);
      setTotalPages(response.data.pagy.pages);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  useEffect(() => {
    fetchAdvances(page);
  }, [page]);

  const handleFilter = (event) => {
    const newData = filterRecords.filter((row) =>
      row.user.email.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setRecords(newData);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="mb-3">
      <div className="d-flex bg-white py-3 justify-content-center">
        <div className="filterdiv d-flex p-1 px-4">
          <span>
            <FaFilter color="#6e6893" />
          </span>
          <span className="ms-2">Filter</span>
        </div>
        <div className="ms-2">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch color="#6e6893" />
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
        columns={columns}
        data={records}
        customStyles={customStyles}
        pagination
        paginationServer
        paginationTotalRows={totalPages * 10}
        paginationPerPage={10}
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
        onChangePage={handlePageChange}
      />
    </div>
  );
};

export default RequestedAdvance;
