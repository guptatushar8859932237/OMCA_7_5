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
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { GetAllPatients } from "../../reducer/PatientsSlice";
import { useNavigate } from "react-router-dom";
import { image } from "../../Basurl/Baseurl";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { DeletePatient } from "../../reducer/PatientsSlice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";
import { StatusPatient } from "../../reducer/PatientsSlice";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Autocomplete from "@mui/material/Autocomplete";
import { GetAllTreatment } from "../../reducer/TreatmentSlice";
import axios from "axios";
import { baseurl } from "../../Basurl/Baseurl";
import { Padding } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { Pagination, Stack } from "@mui/material";
export default function Patient() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const { patient, loading, error } = useSelector((state) => state.patient);
  const { Treatment } = useSelector((state) => state.Treatment);
  const [seekerStatus, setSeekerStatus] = React.useState({});
  const [treatmentname, setTreatmentname] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  console.log(Treatment);
  const [report, setReport] = useState({
    country: " ",
    gender: " ",
    age: " ",
  });
  const submitInputdata = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };
  const handleJobTitleChange = (event, value) => {
    setSelectedJobTitle(value);
  };

  useEffect(() => {
    dispatch(GetAllTreatment());
  }, [dispatch]);

  useEffect(() => {
    if (Treatment) {
      setTreatmentname(Treatment);
    }
  }, [Treatment]);
  useEffect(() => {
    dispatch(GetAllPatients());
    console.log(error, patient);
  }, [dispatch]);

  useEffect(() => {
    if (patient) {
      setRows(patient);
      setSearchApiData(patient);
    }
  }, [patient]);
  console.log(patient);
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
  const PatientDetail = (e, id, enq) => {
    navigate("/Admin/Patient-Detail", {
      state: {
        patientId: id,
        enqId: enq,
      },
    });
  };

  // const handledelet =(e,id)=>{
  //   e.preventDefault();
  //   alert("dcvdfg")
  //   console.log(id)
  // }
  const handledelet = (e, patientId) => {
    e.preventDefault();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(DeletePatient({ id: patientId }))
            .unwrap() // If using Redux Toolkit, unwrap to handle success/failure easily
            .then(() => {
              return dispatch(GetAllPatients());
            })
            .then((newData) => {
              Swal.fire("Deleted!", "Patient has been deleted.", "success");
              setRows(newData.payload); // Update rows with the latest data
            })
            .catch((err) => {
              Swal.fire("Error!", err?.message || "An error occurred", "error");
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            // text: "Patient data is safe :)",
            icon: "error",
          });
        }
      });
  };

  const handleChange = (event, id) => {
    const { value } = event.target;
    setSeekerStatus(value);
  };

  const handleClickOpen = async (e, id) => {
    e.preventDefault(); // Prevent default behavior of the event

    try {
      // Dispatch the action and await its result
      const result = await dispatch(
        StatusPatient({ id: id, status: Number(seekerStatus) })
      ).unwrap();

      // Show success alert
      Swal.fire("Success!", "Patient details updated successfully.", "success");
      dispatch(GetAllPatients());

      // Navigate to the patients page
    } catch (err) {
      // Handle errors and show an error alert
      Swal.fire("Error!", err?.message || "An error occurred", "error");
    }
  };

  const getReportData = () => {
    axios
      .get(
        `${baseurl}exportfilteredpatient/${localStorage.getItem(
          "_id"
        )}?gender=${encodeURIComponent(
          report.gender.trim()
        )}&treatment_name=${encodeURIComponent(
          selectedJobTitle.trim()
        )}&age=${encodeURIComponent(
          report.age.trim()
        )}&country=${encodeURIComponent(report.country.trim())}`,
        {
          responseType: "blob", // Important to set the response type to 'blob'
        }
      )
      .then((response) => {
        // Create a URL for the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // You can set a default file name here
        link.setAttribute("download", `report_${report}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove(); // Clean up after download
      })
      .catch((error) => {
        Swal.fire(
          "Error",
          `No candidates found for the jobs posted by this client`,
          "error"
        );
      })
      .finally(() => {
        // Resetting states regardless of success or error
      });
  };
  // console.log(searchApiData)
  const handleFilter = (event) => {
    if (event.target.value === "") {
      setRows(searchApiData);
    } else {
      const filterResult = searchApiData.filter((item) => {
        const enquiryId = item.patientId?.toLowerCase() || "";
        const emailMatches = item.email.toLowerCase();
        const name = item.patient_name?.toLowerCase() || "";
        const contact = item?.emergency_contact
          ? item.emergency_contact.toString().toLowerCase()
          : "";
        const country = item.country?.toLowerCase() || "";
        const patientdesiese =
          item.patient_disease[0].disease_name?.toLowerCase() || "";
        const searchValue = event.target.value.toLowerCase();
        return (
          enquiryId.includes(searchValue) ||
          country.includes(searchValue) ||
          patientdesiese.includes(searchValue) ||
          contact.includes(searchValue) ||
          name.includes(searchValue) ||
          emailMatches.includes(searchValue)
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

  console.log(seekerStatus);
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="country-top">
                <div className="">
                  <h4 className="page-title mb-0">Manage Patients</h4>
                </div>
                <div className="search-btn-main">
                  <div className="mr-3">
                    <TextField
                      sx={{ width: "100%" }}
                      label="Search By Patient Id and Name"
                      id="outlined-size-small"
                      size="small"
                      className="field-count"
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
                          <TableCell>Patient Id</TableCell>
                          <TableCell>Patient Name</TableCell>
                          <TableCell>Emergency contact</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Country</TableCell>
                          <TableCell>Patient Disease</TableCell>
                          {/* <TableCell align="left" style={{ minWidth: "150px", "fontWeight": "bold" }}>
                            View
                          </TableCell> */}
                          {/* <TableCell align="left" style={{ minWidth: "100px", "fontWeight": "bold" }}>
                             Status
                          </TableCell> */}
                          {/* <TableCell align="left" style={{ minWidth: "100px" }}>
                    candidateCounts
                  </TableCell> */}
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      {/* <TableBody>
                        {rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((info, i) => {
                            return (
                              <TableRow
                                role="checkbox"
                                tabIndex={-1}
                                key={info.code}
                              >
                                <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                                <TableCell> {info.patientId}</TableCell>
                                <TableCell>{info.patient_name}</TableCell>
                                <TableCell>{info.emergency_contact}</TableCell>
                                <TableCell>{info.email}</TableCell>
                                <TableCell>{info.country}</TableCell>
                                <TableCell>{info.patient_disease.map((item) => (item.disease_name))}</TableCell>
                                <TableCell className='action-icon'>
                                  <VisibilityIcon className='eye-icon' onClick={(e) => PatientDetail(e, info.patientId, info.enquiryId)} />
                                  <i className="fa-solid fa-pen-to-square" onClick={(e) => EditButton(e, info.patientId)}></i>
                                  <i className="fa-solid fa-trash" onClick={(e) => handledelet(e, info.patientId)}></i>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody> */}
                      <TableBody>
                        {rows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              No data found
                            </TableCell>
                          </TableRow>
                        ) : (
                          rows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((info, i) => (
                              <TableRow
                                role="checkbox"
                                tabIndex={-1}
                                key={info.code}
                              >
                                <TableCell>
                                  {page * rowsPerPage + i + 1}
                                </TableCell>
                                <TableCell>{info.patientId}</TableCell>
                                <TableCell>{info.patient_name}</TableCell>
                                <TableCell>{info.emergency_contact}</TableCell>
                                <TableCell>{info.email}</TableCell>
                                <TableCell>{info.country}</TableCell>
                                <TableCell>
                                  {info.patient_disease
                                    .map((item) => item.disease_name)
                                    .join(", ")}
                                </TableCell>
                                <TableCell className="action-icon">
                                  <VisibilityIcon
                                    className="eye-icon"
                                    onClick={(e) =>
                                      PatientDetail(
                                        e,
                                        info.patientId,
                                        info.enquiryId
                                      )
                                    }
                                  />
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={(e) =>
                                      EditButton(e, info.patientId)
                                    }
                                  ></i>
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={(e) =>
                                      handledelet(e, info.patientId)
                                    }
                                  ></i>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                    <Stack spacing={2}>
                      <Pagination
                        className='page-nation'
                        count={rows.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={1}
                        defaultPage={6}
                        siblingCount={0}
                      /> 
                     </Stack>
                    {/* <TablePagination
                      component="div"
                      count={rows.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[]}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div id="delete_patient" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Are you sure want to delete this Patient?</h3>
              <div className="m-t-20"> <a href="#" className="btn btn-white" data-dismiss="modal">Close</a>
                <button type="submit" className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>

      </div> */}
    </>
  );
}
