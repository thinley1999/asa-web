import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "../../assets/css/main.css";
import AdvanceServices from "../services/AdvanceServices";
import { FaSearch } from "react-icons/fa";
import { BsFillFilterSquareFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { advance_type } from "../datas/advance_type";

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
          <p className="dataheading p-0 m-0">
            {advance_type[row.advance_type]}
          </p>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => (
        <div className="tabledetails">
          <p className="dataheading p-0 m-0">
            {row.advance_type === "ex_country_tour_advance"
              ? `${row.advance_amount?.Nu ?? 0}, ${
                  row.advance_amount?.INR ?? 0
                }, ${row.advance_amount?.USD ?? 0}`
              : row.advance_type === "in_country_tour_advance"
              ? `${row.advance_amount?.Nu ?? 0}`
              : `${row.amount}`}
          </p>
          <p className="datasubheading p-0 m-0 text-end">
            {row.advance_type === "ex_country_tour_advance"
              ? `NU., INR., USD.`
              : `NU.`}
          </p>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <span className="datasubheading">
            <FaEye size={20} />{" "}
            <a href={`/viewRequestedAdvance/${row.id}`}>View</a>
          </span>{" "}
          {"  "}
          {(row.status === "pending" || row.status === "rejected") && (
            <span className="datasubheading">
              <MdEdit size={20} />
              <a href={`/editRequestedAdvance/${row.id}`}>Edit</a>
            </span>
          )}
        </div>
      ),
    },
  ];

  const displayAdvanceTypes = {
    ex_country_tour_advance: "Ex Country Tour Advance",
    in_country_tour_advance: "In Country Tour Advance",
    other_advance: "Other Advance",
    salary_advance: "Salary Advance",
  };

  const initialAdvanceState = {
    ex_country_tour_advance: true,
    in_country_tour_advance: true,
    other_advance: true,
    salary_advance: true,
  };

  const initialStatusState = {
    pending: true,
    verified: true,
    confirmed: true,
    dispatched: true,
    rejected: true,
    closed: true,
  };

  const [statusState, setStatusState] = useState(initialStatusState);
  const [advanceState, setAdvanceState] = useState(initialAdvanceState);

  const [all_status, setAllStatus] = useState(Object.keys(initialStatusState));
  const [all_advances, setAllAdvances] = useState(
    Object.keys(initialAdvanceState)
  );

  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchAdvances = async (pageNum, perPage) => {
    if (all_status.length === 0 || all_advances.length === 0) {
      setRecords([]);
      setFilterRecords([]);
      setTotalPages(0);
      return;
    }

    const advanceParams = {
      status: all_status,
      advance_type: all_advances,
      page: pageNum,
      per_page: perPage,
      search_query: searchTerm,
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
    fetchAdvances(page, rowsPerPage);
  }, [page, all_status, all_advances, rowsPerPage, searchTerm]);

  const handleFilter = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page) => {
    setPage(page);
    fetchAdvances(page, rowsPerPage);
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    fetchAdvances(page, newPerPage);
  };

  const handleButtonClick = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleStatusChange = (event) => {
    const { id, checked } = event.target;
    const updatedStatusState = { ...statusState, [id]: checked };
    setStatusState(updatedStatusState);
    const newAllStatus = Object.keys(updatedStatusState).filter(
      (key) => updatedStatusState[key]
    );
    setAllStatus(newAllStatus);
  };

  const handleAdvancesChange = (event) => {
    const { id, checked } = event.target;
    const updatedAdvancesState = { ...advanceState, [id]: checked };
    setAdvanceState(updatedAdvancesState);
    const newAllAdvances = Object.keys(updatedAdvancesState).filter(
      (key) => updatedAdvancesState[key]
    );
    setAllAdvances(newAllAdvances);
  };

  return (
    <div className="mb-3">
      <div className="d-flex bg-white py-3 justify-content-center">
        <button
          className="filterdiv d-flex p-1 px-4"
          onClick={handleButtonClick}
        >
          <span>
            <BsFillFilterSquareFill color="#6e6893" />
          </span>
          <span className="ms-2">Filter</span>
        </button>

        {showToast && (
          <div
            className="toast show position-fixed top-0 start-50 translate-middle-x customfiltertoast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-body">
              <div className="d-flex justify-content-between">
                <div className="statusdiv">
                  <h6 className="fw-bold">Status</h6>
                  {Object.keys(initialStatusState).map((status) => (
                    <div className="form-check" key={status}>
                      <input
                        id={status}
                        className="form-check-input customcheckbox"
                        type="checkbox"
                        checked={statusState[status]}
                        onChange={handleStatusChange}
                      />
                      <span className="text-black fw-bold ms-2">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="advancetypediv">
                  <h6 className="fw-bold">Advance Type</h6>
                  {Object.keys(initialAdvanceState).map((advance_type) => (
                    <div className="form-check" key={advance_type}>
                      <input
                        id={advance_type}
                        className="form-check-input customcheckbox"
                        type="checkbox"
                        checked={advanceState[advance_type]}
                        onChange={handleAdvancesChange}
                      />
                      <span className="text-black fw-bold ms-2">
                        {displayAdvanceTypes[advance_type]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCloseToast}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
              value={searchTerm}
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
        paginationTotalRows={totalPages * rowsPerPage}
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
      />
    </div>
  );
};

export default RequestedAdvance;