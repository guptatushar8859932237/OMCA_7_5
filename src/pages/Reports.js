// import React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import { useState, useEffect } from "react";
// import Paper from "@mui/material/Paper";
// import TextField from "@mui/material/TextField";
// import { useSelector, useDispatch } from "react-redux";
// import { GetAllPatients } from "../reducer/PatientsSlice";
// import { useNavigate } from "react-router-dom";
// import { DeletePatient } from "../reducer/PatientsSlice";
// import Swal from "sweetalert2";
// import { StatusPatient } from "../reducer/PatientsSlice";
// import { GetAllTreatment } from "../reducer/TreatmentSlice";
// import axios from "axios";
// import { baseurl } from "../Basurl/Baseurl";
// import DatePicker, { DateObject } from "react-multi-date-picker";
// export default function Reports() {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [rows, setRows] = useState([]);
//   const dispatch = useDispatch();
//   const { patient, loading, error } = useSelector((state) => state.patient);
//   const { Treatment } = useSelector((state) => state.Treatment);
//   const [seekerStatus, setSeekerStatus] = React.useState({});
//   const [treatmentname, setTreatmentname] = useState([]);
//   const [selectedJobTitle, setSelectedJobTitle] = useState("");
//   const [dateRange, setDateRange] = useState([null, null]);
//   const startDate = dateRange?.[0]?.format("YYYY-MM-DD") || "";
//   const endDate = dateRange?.[1]?.format("YYYY-MM-DD") || "";
//   const [fromdate, setFromdate] = useState(startDate);
//   const [todate, setTodate] = useState(endDate);
//   console.log(Treatment);
//   const [report, setReport] = useState({
//     country: " ",
//     treatment: " ",
//     age: " ",
//   });
//   const submitInputdata = (e) => {
//     const { name, value } = e.target;
//     setReport({ ...report, [name]: value });
//   };
//   const handleJobTitleChange = (event, value) => {
//     setSelectedJobTitle(event.target.value);
//   };

//   useEffect(() => {
//     dispatch(GetAllTreatment());
//   }, [dispatch]);

//   useEffect(() => {
//     if (Treatment) {
//       setTreatmentname(Treatment);
//     }
//   }, [Treatment]);
//   useEffect(() => {
//     dispatch(GetAllPatients());
//     console.log(error, patient);
//   }, [dispatch]);

//   useEffect(() => {
//     if (patient) {
//       setRows(patient);
//     }
//   }, [patient]);
//   console.log(patient);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };
//   const EditButton = (e, id) => {
//     navigate("/Admin/edit-patient", {
//       state: {
//         patientId: id,
//       },
//     });
//   };
//   const PatientDetail = (e, id) => {
//     navigate("/Admin/Patient-Detail", {
//       state: {
//         patientId: id,
//       },
//     });
//   };

//   const handledelet = (e, patientId) => {
//     e.preventDefault();

//     const swalWithBootstrapButtons = Swal.mixin({
//       customClass: {
//         confirmButton: "btn btn-success",
//         cancelButton: "btn btn-danger",
//       },
//       buttonsStyling: false,
//     });

//     swalWithBootstrapButtons
//       .fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "No, cancel!",
//         reverseButtons: true,
//       })
//       .then((result) => {
//         if (result.isConfirmed) {
//           dispatch(DeletePatient({ id: patientId }))
//             .unwrap() // If using Redux Toolkit, unwrap to handle success/failure easily
//             .then(() => {
//               return dispatch(GetAllPatients());
//             })
//             .then((newData) => {
//               Swal.fire("Deleted!", "patient has been deleted.", "success");
//               setRows(newData.payload); // Update rows with the latest data
//             })
//             .catch((err) => {
//               Swal.fire("Error!", err?.message || "An error occurred", "error");
//             });
//         } else if (result.dismiss === Swal.DismissReason.cancel) {
//           swalWithBootstrapButtons.fire({
//             title: "Cancelled",
//             text: "Hospital data is safe :)",
//             icon: "error",
//           });
//         }
//       });
//   };
//   const handleChange = (event, id) => {
//     const { value } = event.target;
//     setSeekerStatus(value);
//   };
//   const handleClickOpen = async (e, id) => {
//     e.preventDefault();

//     try {
//       const result = await dispatch(
//         StatusPatient({ id: id, status: Number(seekerStatus) })
//       ).unwrap();
//       Swal.fire("Success!", "Patient details updated successfully.", "success");
//       dispatch(GetAllPatients());
//     } catch (err) {
//       Swal.fire("Error!", err?.message || "An error occurred", "error");
//     }
//   };

//   const getReportData = () => {
//     axios
//       .get(
//         `${baseurl}exportfilteredpatient/?startDate=${encodeURIComponent(
//           startDate
//         )}&treatment_name=${encodeURIComponent(
//           report.treatment.trim()
//         )}&endDate=${encodeURIComponent(endDate)}&country=${encodeURIComponent(
//           report.country.trim()
//         )}&age=${encodeURIComponent(report.age.trim())}`,
//         { responseType: "blob" }
//       )
//       .then((response) => {
//         console.log(response)
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `report.xlsx`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//       })
//       .catch(async (error) => {
//         if (error.response?.data instanceof Blob) {
//           const text = await error.response.data.text();
//           const json = JSON.parse(text);
//           Swal.fire("Error", json?.message || "An error occurred", "error");
//         } else {
//           Swal.fire(
//             "Error",
//             error.message || "An unknown error occurred",
//             "error"
//           );
//         }
//       });
//   };

//   console.log(seekerStatus);
//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="row">
//             <div className="col-md-12">
//               <h4 className="page-title">Reports</h4>
//             </div>
//           </div>
//           <div className="main_content">
//             <div className="row g-3 align-items-center">
//               {/* Date Picker */}
//               <div className="col-md-3">
//               <DatePicker
//                   value={dateRange}
//                   format="MM/DD/YYYY"
//                   placeholder="Start Date To End Date"
//                   onChange={setDateRange}
//                   range
//                   numberOfMonths={2}
//                 />
//               </div>

//               {/* Country Input */}
//               <div className="col-md-3">
//                 <TextField
//                   id="country"
//                   label="Country"
//                   variant="outlined"
//                   size="small"
//                   onChange={submitInputdata}
//                   name="country"
//                   value={report.country}
//                   fullWidth
//                 />
//               </div>

//               {/* Treatment Name Input */}
//               <div className="col-md-3">
//                 <TextField
//                   id="treatment"
//                   label="Treatment Name"
//                   variant="outlined"
//                   size="small"
//                   onChange={submitInputdata}
//                   name="treatment"
//                   value={report.treatment}
//                   fullWidth
//                 />
//               </div>

//               {/* Age Input */}
//               <div className="col-md-2">
//                 <TextField
//                   id="age"
//                   label="Age"
//                   variant="outlined"
//                   size="small"
//                   onChange={submitInputdata}
//                   name="age"
//                   value={report.age}
//                   fullWidth
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="col-md-1 text-end">
//                 <button
//                   className="btn btn-primary w-100"
//                   onClick={getReportData}
//                 >
//                   Report
//                 </button>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-12">
//                 <div className="table-responsive">
//                   <TableContainer
//                     component={Paper}
//                     style={{ overflowX: "auto" }}
//                   >
//                     <Table stickyHeader aria-label="sticky table">
//                       <TableHead>
//                         <TableRow style={{ "white-space": "nowrap" }}>
//                           <TableCell
//                             align="left"
//                             style={{ minWidth: "80px", fontWeight: "bold" }}
//                           >
//                             S. No.
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             style={{ minWidth: "60px", fontWeight: "bold" }}
//                           >
//                             Patient Id
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             style={{ minWidth: "150px", fontWeight: "bold" }}
//                           >
//                             Patient Name
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             style={{ minWidth: "150px", fontWeight: "bold" }}
//                           >
//                             Emergency contact
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             style={{ minWidth: "150px", fontWeight: "bold" }}
//                           >
//                             email
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             style={{ minWidth: "150px", fontWeight: "bold" }}
//                           >
//                             country
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             style={{ minWidth: "150px", fontWeight: "bold" }}
//                           >
//                             Patient Disease
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {patient
//                           .slice(
//                             page * rowsPerPage,
//                             page * rowsPerPage + rowsPerPage
//                           )
//                           .map((info, i) => {
//                             return (
//                               <TableRow
//                                 hover
//                                 role="checkbox"
//                                 tabIndex={-1}
//                                 key={info.code}
//                               >
//                                 <TableCell align="left">
//                                   {page * rowsPerPage + i + 1}
//                                 </TableCell>{" "}
//                                 {/* Corrected line */}
//                                 <TableCell>{info.patientId}</TableCell>
//                                 <TableCell>{info.patient_name}</TableCell>
//                                 <TableCell>{info.emergency_contact}</TableCell>
//                                 <TableCell>{info.email}</TableCell>
//                                 <TableCell>{info.country}</TableCell>
//                                 <TableCell>
//                                   {info.patient_disease.map(
//                                     (item) => item.disease_name
//                                   )}
//                                 </TableCell>
//                               </TableRow>
//                             );
//                           })}
//                       </TableBody>
//                     </Table>
//                     <TablePagination
//                       component="div"
//                       count={rows.length}
//                       page={page}
//                       onPageChange={handleChangePage}
//                       rowsPerPage={rowsPerPage}
//                       onRowsPerPageChange={handleChangeRowsPerPage}
//                       rowsPerPageOptions={[3,5,10]}
//                     />
//                   </TableContainer>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import {
  GetAllPatients,
  DeletePatient,
  StatusPatient,
} from "../reducer/PatientsSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GetAllTreatment } from "../reducer/TreatmentSlice";
import axios from "axios";
import { baseurl, excelExoprt, image } from "../Basurl/Baseurl";
import DatePicker from "react-multi-date-picker";
import { Pagination, Stack } from "@mui/material";

export default function Reports() {
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
  const [dateRange, setDateRange] = useState([null, null]);
  const startDate = dateRange?.[0]?.format("YYYY-MM-DD") || "";
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD") || "";
  const [report, setReport] = useState({
    country: "",
    treatment: "",
    age: "",
  });
  const submitInputdata = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
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
  }, [dispatch]);
  useEffect(() => {
    if (patient) {
      setRows(patient);
    }
  }, [patient]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(DeletePatient({ id: patientId }))
            .unwrap()
            .then(() => dispatch(GetAllPatients()))
            .then((newData) => {
              Swal.fire("Deleted!", "Patient has been deleted.", "success");
              setRows(newData.payload);
            })
            .catch((err) => {
              Swal.fire("Error!", err?.message || "An error occurred", "error");
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Hospital data is safe :)",
            icon: "error",
          });
        }
      });
  };

  const handleClickOpen = async (e, id) => {
    e.preventDefault();
    try {
      await dispatch(
        StatusPatient({ id, status: Number(seekerStatus) })
      ).unwrap();
      Swal.fire("Success!", "Patient details updated successfully.", "success");
      dispatch(GetAllPatients());
    } catch (err) {
      Swal.fire("Error!", err?.message || "An error occurred", "error");
    }
  };

  // const getReportData = () => {
  //   axios
  //     .get(
  //       `${baseurl}exportfilteredpatient/?startDate=${encodeURIComponent(
  //         startDate
  //       )}&treatment_name=${encodeURIComponent(
  //         report.treatment.trim()
  //       )}&endDate=${encodeURIComponent(endDate)}&country=${encodeURIComponent(
  //         report.country.trim()
  //       )}&age=${encodeURIComponent(report.age.trim())}`,
  //       { responseType: "blob" }
  //     )
  //     .then(async (response) => {
  //       const contentType = response.headers["content-type"];
  //       if (contentType.includes("application/json")) {
  //         const text = await response.data.text();
  //         const json = JSON.parse(text);
  //         Swal.fire("Error", json?.message || "No data found", "error");
  //       } else {
  //         const url = window.URL.createObjectURL(new Blob([response.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", `report.xlsx`);
  //         document.body.appendChild(link);
  //         link.click();
  //         link.remove();
  //       }
  //     })
  //     .catch(async (error) => {
  //       if (error.response?.data instanceof Blob) {
  //         const text = await error.response.data.text();
  //         const json = JSON.parse(text);
  //         Swal.fire("Error", json?.message || "An error occurred", "error");
  //       } else {
  //         Swal.fire("Error", error.message || "An unknown error occurred", "error");
  //       }
  //     });
  // };
  // const getReportData = () => {
  //   axios
  //     .get(
  //       `${baseurl}exportfilteredpatient/?startDate=${encodeURIComponent(
  //         startDate
  //       )}&treatment_name=${encodeURIComponent(
  //         report.treatment.trim()
  //       )}&endDate=${encodeURIComponent(endDate)}&country=${encodeURIComponent(
  //         report.country.trim()
  //       )}&age=${encodeURIComponent(report.age.trim())}`
  //     )
  //     .then((response) => {
  //       if (response.data.success && response.data.data) {
  //         setRows(response.data.data); // Show filtered patients in table
  //       }

  //       if (response.data.download_link) {
  //         const link = document.createElement("a");
  //         link.href = `${baseurl}${response.data.download_link}`;
  //         link.setAttribute("download", "report.xlsx");
  //         document.body.appendChild(link);
  //         link.click();
  //         link.remove();
  //       }
  //     })
  //     .catch((error) => {
  //       Swal.fire("Error", error?.message || "Something went wrong", "error");
  //     });
  // };
  const getReportData = () => {
    try {
      axios
        .get(
          `${baseurl}exportfilteredpatient/?startDate=${encodeURIComponent(
            startDate
          )}&treatment_course_name=${encodeURIComponent(
            report.treatment.trim()
          )}&endDate=${encodeURIComponent(
            endDate
          )}&country=${encodeURIComponent(
            report.country.trim()
          )}&age=${encodeURIComponent(report.age.trim())}`
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.success && response.data.data) {
            setRows(response.data.data); // Show filtered patients in table
          }

          if (response.data.download_link) {
            const link = document.createElement("a");
            link.href = `${baseurl}${response.data.download_link}`;
            link.setAttribute("download", "report.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
          }
        })
        .catch((error) => {
          console.log(error);
          console.log(error?.response?.data);

          const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Something went wrong";

          Swal.fire("Error", errorMessage, "error");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="country-top">
              <div className="">
                <h4 className="page-title mb-0">Reports</h4>
              </div>
            </div>
            <div className="search-btn-main mb-4">
              <div className="mr-3 field-count">
                <DatePicker
                  value={dateRange}
                  format="MM/DD/YYYY"
                  placeholder="Start Date To End Date"
                  onChange={setDateRange}
                  range
                  numberOfMonths={2}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="mr-3">
                <TextField
                  id="country"
                  label="Country"
                  variant="outlined"
                  size="small"
                  onChange={submitInputdata}
                  name="country"
                  value={report.country}
                  fullWidth
                  className="field-count"
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="mr-3">
                <TextField
                  id="treatment"
                  label="Treatment Name"
                  variant="outlined"
                  size="small"
                  onChange={submitInputdata}
                  name="treatment"
                  value={report.treatment}
                  fullWidth
                  className="field-count"
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="mr-3">
                <TextField
                  id="age"
                  label="Age"
                  variant="outlined"
                  size="small"
                  onChange={submitInputdata}
                  name="age"
                  value={report.age}
                  fullWidth
                  className="field-count"
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="">
                <button className="add-button" onClick={getReportData}>
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="main_content">
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <TableContainer component={Paper} style={{ overflowX: "auto" }}>
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
                        <TableCell> Contact No</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Patient Disease</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((info, i) => {
                          console.log(info);
                          return (
                            <>
                              <TableRow
                                role="checkbox"
                                tabIndex={-1}
                                key={info.patientId}
                              >
                                <TableCell>
                                  {page * rowsPerPage + i + 1}
                                </TableCell>
                                <TableCell>{info.patientId}</TableCell>
                                <TableCell>{info.patient_name}</TableCell>
                                <TableCell>
                                  {info.emergency_contact
                                    ? info.emergency_contact
                                    : info.emergency_contact_no}
                                </TableCell>
                                <TableCell>{info.email}</TableCell>
                                <TableCell>{new Date(info.createdAt).toLocaleDateString('en-GB')}</TableCell>
                                <TableCell>{info.country}</TableCell>
                                <TableCell>
                                  {info.treatment_course_name}
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                    </TableBody>
                  </Table>
                  <Stack spacing={2} alignItems="end" marginTop={2}>
                    <Pagination
                      count={Math.ceil(rows.length / rowsPerPage)}
                      page={page + 1}
                      onChange={(event, value) => setPage(value - 1)}
                      shape="rounded"
                      className='page-item'
                    />
                  </Stack>
                  {/* <TablePagination
                    component="div"
                    count={rows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[]}
                  /> */}
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
