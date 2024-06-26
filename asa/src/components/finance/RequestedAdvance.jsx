import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../../assets/css/main.css";

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
          <p className="dataheading p-0 m-0">{row.name}</p>
          <p className="datasubheading p-0 m-0">{row.email}</p>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading1 p-0 m-0 text-success">pending</p>
          <p className="datasubheading p-0 m-0">Application date: 19/06/2024</p>
        </div>
      ),
    },
    {
      name: "Advance Type",
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading p-0 m-0">{row.address.street}</p>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading p-0 m-0">1000</p>
          <p className="datasubheading p-0 m-0 text-end">NU</p>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <span className="datasubheading">
            <a href="/viewRequestedAdvance">View More</a>
          </span>{" "}
          <i className="bi bi-three-dots-vertical"></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
          setRecords(res.data);
          setFilterRecords(res.data);
        })
        .catch((err) => console.log(err));
    };
    fetchData();
  }, []);

  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);

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
          <i className="bi bi-funnel-fill fs-6"></i>
          <span className="ms-2">Filter</span>
        </div>
        <div className="ms-2">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
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
        selectableRows
      ></DataTable>
    </div>
  );
};

export default RequestedAdvance;
