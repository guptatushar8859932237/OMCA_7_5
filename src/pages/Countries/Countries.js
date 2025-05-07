import React from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { baseurl } from "../../Basurl/Baseurl";
import { useNavigate } from "react-router-dom";
import { GetAllCountries } from "../../reducer/Countries";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { Pagination, Stack } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
export default function Countries() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [rows, setRows] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const dispatch = useDispatch();
  const { Countries, loading, error } = useSelector((state) => state.Countries);
  const [seekerStatus, setSeekerStatus] = React.useState({});
  const [searchApiData, setSearchApiData] = useState([]);
const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    dispatch(GetAllCountries());
    console.log(error, Countries);
  }, [dispatch]);

  useEffect(() => {
    if (Countries) {
      setRows(Countries);
      setSearchApiData(Countries);
    }
  }, [Countries]);
  console.log(Countries);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const EditButton = (e, id) => {
    navigate("/Admin/edit-patient", {
      state: {
        patientId: id,
      },
    });
  };
  const handleFilter = (event) => {
    if (event.target.value === "") {
      setRows(searchApiData);
    } else {
      const filterResult = searchApiData.filter((item) => {
        const enquiryId = item.countryName?.toLowerCase() || "";
        // const emailMatches = item.job_Desciption.toLowerCase();
        const country = item.countryCapital?.toLowerCase() || "";
        const countryCurrency = item.countryCurrency?.toLowerCase() || "";
        const searchValue = event.target.value.toLowerCase();

        return (
          enquiryId.includes(searchValue) ||
          countryCurrency.includes(searchValue) ||
          country.includes(searchValue)
        );
      });
      setRows(filterResult);
    }
    setFilterValue(event.target.value);
  };
  const handleClearFilter = () => {
    setFilterValue("");
    setRows(searchApiData);
  };

  const handledelet = (id) => {
    console.log(id, "id");
    axios
      .delete(`${baseurl}deleteCountry/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message)
          console.log(response.data.message);
          dispatch(GetAllCountries());
        } else {
          console.error("Failed to fetch job titles:", response.data.message);
        }
      })
  }
  const handleedit =(id) => {
    console.log(id, "id");
    navigate("/Admin/edit-countries", {
      state: {
        countryId: id,
      },
    });
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="country-top">
                <div className="">
                  <h4 className="page-title mb-0">Manage Countries</h4>
                </div>
                <div className="search-btn-main">
                  <div className="mr-3">
                    <TextField
                      className="field-count"
                      sx={{ width: "100%" }}
                      label="Search by countries"
                      id="outlined-size-small"
                      size="small"
                      value={filterValue}
                      onChange={(e) => handleFilter(e)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" className="input-set">
                            {filterValue && (
                              <IconButton
                                onClick={handleClearFilter}
                                edge="end"
                              >
                                <ClearIcon />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div className="">
                    <Link to="/Admin/add-countries" className="add-button">
                      <i className="fa fa-plus"></i> New Countries
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main_content">
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <TableContainer
                    component={Paper}
                    style={{ overflowX: "auto" }}
                  >
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      className="table-no-card"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr.No.</TableCell>
                          <TableCell>Country Name</TableCell>
                          <TableCell>Country Code</TableCell>
                          <TableCell>Country Capital</TableCell>
                          <TableCell>Country Currency</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((info, i) => {
                            console.log(info, "info");
                            return(
                              <>
                               <TableRow
                              role="checkbox"
                              tabIndex={-1}
                              key={info.code || i}
                            >
                              <TableCell>
                                {page * rowsPerPage + i + 1}
                              </TableCell>
                              <TableCell>{info.countryName}</TableCell>
                              <TableCell>{info.countryCode}</TableCell>
                              <TableCell>{info.countryCapital}</TableCell>
                              <TableCell>{info.countryCurrency}</TableCell>
                              <TableCell className="action-icon">
                                <i
                                  className="fa-solid fa-pen-to-square"
                                  onClick={(e) => handleedit(info._id)}
                                ></i>
                                <i
                                  className="fa-solid fa-trash"
                                  onClick={(e) => handledelet(info._id)}
                                ></i>
                              </TableCell>
                            </TableRow>
                              </>
                            )
                          }
                          )}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={rows.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[5, 10, 15]}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
