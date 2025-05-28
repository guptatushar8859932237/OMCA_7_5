// import React from "react";
// import { Link } from "react-router-dom";
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
// import { GetAllServices } from "../../reducer/ServiceSlice";
// import { useNavigate } from "react-router-dom";
// import { ActiveService } from "../../reducer/ServiceSlice";
// import Swal from "sweetalert2";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import ClearIcon from "@mui/icons-material/Clear";
// export default function AllServices() {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(8);
//   const [rows, setRows] = useState([]);
//   const [filterValue, setFilterValue] = useState("");
//   const dispatch = useDispatch();
//   const { Service, loading, error } = useSelector((state) => state.Service);
//   const [seekerStatus, setSeekerStatus] = React.useState({});
//   const [searchApiData, setSearchApiData] = useState([]);
//   useEffect(() => {
//     dispatch(GetAllServices());
//     console.log(error, Service);
//   }, [dispatch]);

//   useEffect(() => {
//     if (Service) {
//       setRows(Service);
//       setSearchApiData(Service);
//     }
//   }, [Service]);
//   console.log(Service);

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };
//   const EditButton = (e, id) => {
//     // navigate("/Admin/edit-patient", {
//     //   state: {
//     //     patientId: id,
//     //   },
//     // });
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
//   };
//   const handleChange = (event, id) => {
//     const { value } = event.target;
//     setSeekerStatus(value);
//   };
//   const dataActiveInactive = async (id, currentState) => {
//     try {
//       const result = await dispatch(ActiveService({ id: id })).unwrap();
//       console.log("API Response:", result); // Debug API response
//       setRows((prevServices) =>
//         prevServices.map((service) =>
//           service.serviceId === id
//             ? { ...service, isActive: !currentState } // Toggle state in UI
//             : service
//         )
//       );
//       Swal.fire("Status!", "Status updated successfully", "success");
//     } catch (err) {
//       console.error("Error:", err);
//       const errorMessage = err?.message || JSON.stringify(err);

//       Swal.fire({
//         title: "Error!",
//         text: errorMessage,
//         icon: "error",
//       });
//     }
//   };

//   const handleFilter = (event) => {
//     if (event.target.value === "") {
//       setRows(searchApiData);
//     } else {
//       const filterResult = searchApiData.filter((item) => {
//         const enquiryId = item.serviceId?.toLowerCase() || "";
//         // const emailMatches = item.job_Desciption.toLowerCase();
//         const country = item.serviceName?.toLowerCase() || "";
//         const price = item.price.toString().toLowerCase();
//         const duration = item.duration.toLowerCase();
//         const searchValue = event.target.value.toLowerCase();

//         return (
//           enquiryId.includes(searchValue) ||
//           price.includes(searchValue) ||
//           duration.includes(searchValue) ||
//           country.includes(searchValue)
//         );
//       });
//       setRows(filterResult);
//     }
//     setFilterValue(event.target.value);
//   };
//   const handleClearFilter = () => {
//     setFilterValue("");
//     setRows(searchApiData);
//   };
//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="row">
//             <div className="col-md-12">
//               <div className="country-top">
//                 <div className="">
//                   <h4 className="page-title mb-0">Manage Services</h4>
//                 </div>
//                 <div className="search-btn-main">
//                   <div className="mr-3">
//                     <TextField
//                       className="field-count"
//                       sx={{ width: "100%" }}
//                       label="Search By Service Id and Name"
//                       id="outlined-size-small"
//                       size="small"
//                       value={filterValue}
//                       onChange={(e) => handleFilter(e)}
//                       InputLabelProps={{ shrink: true }}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end" className="input-set">
//                             {filterValue && (
//                               <IconButton
//                                 onClick={handleClearFilter}
//                                 edge="end"
//                               >
//                                 <ClearIcon />
//                               </IconButton>
//                             )}
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </div>
//                   <div className="">
//                     <Link to="/Admin/add-Services" className="add-button">
//                       <i className="fa fa-plus"></i> New Service
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="main_content">
//             <div className="row">
//               <div className="col-md-12">
//                 <div className="table-responsive">
//                   <TableContainer
//                     component={Paper}
//                     style={{ overflowX: "auto" }}
//                   >
//                     <Table
//                       stickyHeader
//                       aria-label="sticky table"
//                       className="table-no-card"
//                     >
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>Sr.No.</TableCell>
//                           <TableCell>Service ID</TableCell>
//                           <TableCell>Service Name</TableCell>
//                           <TableCell>Price</TableCell>
//                           <TableCell>Duration</TableCell>
//                           <TableCell>Status</TableCell>
//                           <TableCell>Action</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {(rows || [])
//                           .slice(
//                             page * rowsPerPage,
//                             page * rowsPerPage + rowsPerPage
//                           )
//                           .map((info, i) => (
//                             <TableRow
//                               role="checkbox"
//                               tabIndex={-1}
//                               key={info.code || i}
//                             >
//                               <TableCell>
//                                 {page * rowsPerPage + i + 1}
//                               </TableCell>
//                               <TableCell>{info.serviceId}</TableCell>
//                               <TableCell>{info.serviceName}</TableCell>
//                               <TableCell>{info.price}</TableCell>
//                               <TableCell>{info.duration}</TableCell>
//                               <TableCell>
//                                 <label className="active-switch">
//                                   <input
//                                     className="active-switch-input "
//                                     type="checkbox"
//                                     checked={Boolean(info.isActive)}
//                                     onChange={() =>
//                                       dataActiveInactive(
//                                         info.serviceId,
//                                         info.isActive
//                                       )
//                                     }
//                                   />
//                                   <span
//                                     className="active-switch-label "
//                                     data-on="Active"
//                                     data-off="Inactive"
//                                   ></span>
//                                   <span className="active-switch-handle"></span>
//                                 </label>
//                               </TableCell>
//                               <TableCell
//                                 align="left"
//                                 className="dropdown dropdown-action"
//                               >
//                                 <a
//                                   href="#"
//                                   className="action-icon dropdown-toggle"
//                                   data-toggle="dropdown"
//                                   aria-expanded="false"
//                                 >
//                                   <i className="fa fa-ellipsis-v"></i>
//                                 </a>
//                                 <div className="dropdown-menu dropdown-menu-right">
//                                   <a
//                                     className="dropdown-item"
//                                     onClick={(e) =>
//                                       EditButton(e, info.patientId)
//                                     }
//                                   >
//                                     <i className="fa fa-pencil m-r-5"></i> Edit
//                                   </a>
//                                   <a
//                                     className="dropdown-item"
//                                     onClick={(e) =>
//                                       handledelet(e, info.patientId)
//                                     }
//                                   >
//                                     <i className="fa fa-trash-o m-r-5"></i>{" "}
//                                     Delete
//                                   </a>
//                                 </div>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                       </TableBody>
//                     </Table>
//                     <TablePagination
//                       component="div"
//                       count={rows.length}
//                       page={page}
//                       onPageChange={handleChangePage}
//                       rowsPerPage={rowsPerPage}
//                       rowsPerPageOptions={[]}
//                       onRowsPerPageChange={handleChangeRowsPerPage}
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
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Pagination,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { GetAllServices, ActiveService } from "../../reducer/ServiceSlice";
import axios from "axios";
import { baseurl } from "../../Basurl/Baseurl";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function AllServices() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [activeToggleLoading, setActiveToggleLoading] = useState(null);
  

  const { Service, loading, error } = useSelector((state) => state.Service);

  useEffect(() => {
    dispatch(GetAllServices());
  }, [dispatch]);

  useEffect(() => {
    if (Service) {
      setRows(Service);
      setSearchApiData(Service);
    }
  }, [Service]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const EditButton = (e, id) => {
    // Example: navigate to edit page
    navigate("/Admin/edit-service", { state: { serviceId: id } });
  };

  const handleDelete = async (e, serviceId) => {
    e.preventDefault();
    const response = await axios.delete(`${baseurl}delete_service/${serviceId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",

      },
    })
    if (response.data.success === true) {
      await dispatch(GetAllServices());
      Swal.fire("Status!", "Status updated successfully", "success");
    } else {
      console.log("coe error", error)
    }
  };

  // const dataActiveInactive = async (id, currentState) => {
  //   try {
  //     setActiveToggleLoading(id);
  //     const result = await dispatch(ActiveService({ id })).unwrap();
  //     console.log("API Response:", result);
  //     setRows((prevServices) =>
  //       prevServices.map((service) =>
  //         service.serviceId === id
  //           ? { ...service, isActive: !currentState }
  //           : service
  //       )
  //     );
  //     Swal.fire("Status!", "Status updated successfully", "success");
  //   } catch (err) {
  //     console.error("Error:", err);
  //     const errorMessage = err?.message || JSON.stringify(err);
  //     Swal.fire({
  //       title: "Error!",
  //       text: errorMessage,
  //       icon: "error",
  //     });
  //   } finally {
  //     setActiveToggleLoading(null);
  //   }
  // };
  const dataActiveInactive = async (id, currentState) => {
    try {
      setActiveToggleLoading(id);
      const result = await dispatch(ActiveService({ id })).unwrap();
      console.log("API Response:", result);

      // ✅ Refresh full data from backend
      await dispatch(GetAllServices());

      Swal.fire("Status!", "Status updated successfully", "success");
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err?.message || JSON.stringify(err);
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setActiveToggleLoading(null);
    }
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterValue(value);

    if (!value) {
      setRows(searchApiData);
      return;
    }

    const filtered = searchApiData.filter((item) => {
      const id = item.serviceId?.toLowerCase() || "";
      const name = item.serviceName?.toLowerCase() || "";
      const price = item.price?.toString().toLowerCase() || "";
      const duration = item.duration?.toLowerCase() || "";
      return (
        id.includes(value) ||
        name.includes(value) ||
        price.includes(value) ||
        duration.includes(value)
      );
    });

    setRows(filtered);
  };

  const handleClearFilter = () => {
    setFilterValue("");
    setRows(searchApiData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="country-top">
              <div>
                <h4 className="page-title mb-0">Manage Services</h4>
              </div>
              <div className="search-btn-main">
                <div className="mr-3">
                  <TextField
                    className="field-count"
                    sx={{ width: "100%" }}
                    label="Search By Service Id and Name"
                    size="small"
                    value={filterValue}
                    onChange={handleFilter}
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
                <div>
                  <Link to="/Admin/add-Services" className="add-button">
                    <i className="fa fa-plus"></i> New Service
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
                <TableContainer component={Paper} style={{ overflowX: "auto" }}>
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    className="table-no-card"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr.No.</TableCell>
                        <TableCell>Service ID</TableCell>
                        <TableCell>Service Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    {/* <TableBody>
                      {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((info, i) => (
                          <TableRow key={info.serviceId}>
                            <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                            <TableCell>{info.serviceId}</TableCell>
                            <TableCell>{info.serviceName}</TableCell>
                            <TableCell>{info.price}</TableCell>
                            <TableCell>{info.duration}</TableCell>
                            <TableCell>
                              <label className="active-switch">
                                <input
                                  type="checkbox"
                                  className="active-switch-input"
                                  checked={Boolean(info.isActive)}
                                  disabled={activeToggleLoading === info.serviceId}
                                  onChange={() =>
                                    dataActiveInactive(info.serviceId, info.isActive)
                                  }
                                />
                                <span
                                  className="active-switch-label"
                                  data-on="Active"
                                  data-off="Inactive"
                                ></span>
                                <span className="active-switch-handle"></span>
                              </label>
                            </TableCell>
                            {/* <TableCell align="left" className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a
                                  className="dropdown-item" style={{ cursor: "pointer" }}
                                  onClick={(e) => EditButton(e, info.serviceId)}
                                >
                                  <i className="fa fa-pencil m-r-5"></i> Edit
                                </a>
                                <a
                                  className="dropdown-item" style={{ cursor: "pointer" }}
                                  onClick={(e) => handleDelete(e, info.serviceId)}
                                >
                                  <i className="fa fa-trash-o m-r-5"></i> Delete
                                </a>
                              </div>
                            </TableCell> */}
                            {/* <TableCell className="action-icon">
                              <VisibilityIcon
                                className="eye-icon"
                                onClick={(e) => EditButton(e, info.serviceId)}
                              />
                              <i
                                className="fa-solid fa-trash"
                                onClick={(e) => handleDelete(e, info.serviceId)}
                              ></i>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody> */}
                    <TableBody>
  {rows.length > 0 && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0 ? (
    rows
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((info, i) => (
        <TableRow key={info.serviceId}>
          <TableCell>{page * rowsPerPage + i + 1}</TableCell>
          <TableCell>{info.serviceId}</TableCell>
          <TableCell>{info.serviceName}</TableCell>
          <TableCell>{info.price}</TableCell>
          <TableCell>{info.duration}</TableCell>
          <TableCell>
            <label className="active-switch">
              <input
                type="checkbox"
                className="active-switch-input"
                checked={Boolean(info.isActive)}
                disabled={activeToggleLoading === info.serviceId}
                onChange={() =>
                  dataActiveInactive(info.serviceId, info.isActive)
                }
              />
              <span
                className="active-switch-label"
                data-on="Active"
                data-off="Inactive"
              ></span>
              <span className="active-switch-handle"></span>
            </label>
          </TableCell>
          <TableCell className="action-icon">
            <VisibilityIcon
              className="eye-icon"
              onClick={(e) => EditButton(e, info.serviceId)}
            />
            <i
              className="fa-solid fa-trash"
              onClick={(e) => handleDelete(e, info.serviceId)}
            ></i>
          </TableCell>
        </TableRow>
      ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No Data Found
      </TableCell>
    </TableRow>
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
  );
}
