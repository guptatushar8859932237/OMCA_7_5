import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { GetAllStaffUser } from "../../reducer/StaffSlice";
import { baseurl, image } from "../../Basurl/Baseurl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { ActiveStaffUser } from "../../reducer/StaffSlice";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import { DeleteStaff } from "../../reducer/StaffSlice";
import { Pagination, Stack } from "@mui/material";
import axios from "axios";
export default function Staff() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const { staff, loading, error } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(GetAllStaffUser());
    console.log(error, staff);
  }, [dispatch]);

  useEffect(() => {
    if (staff) {
      setRows(staff);
    }
  }, [staff]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const EditButton = (e, id) => {
    navigate("/Admin/edit-staff", {
      state: {
        staffID: id,
      },
    });
  };

  const dataActiveInactive = async (id, currentState) => {
    try {
      const newState = currentState === 1 ? 0 : 1; // Invert status
      const result = await dispatch(ActiveStaffUser({ id: id })).unwrap();
      dispatch(GetAllStaffUser()); 
      Swal.fire(
        "Status!",
        newState === 1 ? "Activate." : "DeActivate.",
        "success"
      );
    } catch (err) {
      console.error("Error object:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : typeof err?.message === "string"
          ? err.message
          : typeof err?.message?.message === "string"
          ? err.message.message
          : JSON.stringify(err);
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  const handledelet = (e, staffID) => {
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
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(DeleteStaff({ id: staffID }))
            .unwrap() // If using Redux Toolkit, unwrap to handle success/failure easily
            .then(() => {
              return dispatch(GetAllStaffUser());
            })
            .then((newData) => {
              Swal.fire("Deleted!", "Staff has been deleted.", "success");
              setRows(newData.payload); // Update rows with the latest data
            })
            .catch((err) => {
              Swal.fire("Error!", err?.message || "An error occurred", "error");
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            icon: "error",
          });
        }
      });
  };

  const handleSampleFile = async () => {
    try {
      const response = await axios.get(
        `${baseurl}export_staffs`,
        {
          responseType: "blob", // Important for downloading files
        }
      );
      console.log(response.data);
      // Create a downloadable link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Sample_Enquiry.xlsx"); // File name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return response.data; // Success response
    } catch (err) {
      console.error(
        "Error downloading the sample file:",
        err.response?.data?.message || err.message
      );
      // Handle error properly or throw
      throw err;
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="country-top">
                <div className="">
                  <h4 className="page-title mb-0">Manage staff</h4>
                </div>
                <div className="search-btn-main">
                  <div className="mr-3">
                    <TextField
                      className="field-count"
                      sx={{ width: "100%" }}
                      label="Search By Staff Name"
                      id="outlined-size-small"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      // value={filterValue}
                      // onChange={(e) => handleFilter(e)}
                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment position="end" className="input-set">
                      //       {filterValue && (
                      //         <IconButton onClick={handleClearFilter} edge="end">
                      //           <ClearIcon />
                      //         </IconButton>
                      //       )}
                      //     </InputAdornment>
                      //   ),
                      // }}
                    />
                  </div>
                  <div className="">
                    <Link to="/Admin/add-staff" className="add-button">
                      <i className="fa fa-plus mx-1"></i> New Staff
                    </Link>
                    <button
                      onClick={handleSampleFile}
                      className="add-button ms-2"
                    >
                      <span>
                        <i className="fa fa-file mx-1"></i>
                      </span>
                      Export File
                    </button>
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
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {staff
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((info, i) => {
                            console.log(info, "info");
                            return (
                              <TableRow
                                role="checkbox"
                                tabIndex={-1}
                                key={info.code}
                              >
                                <TableCell>
                                  {page * rowsPerPage + i + 1}
                                </TableCell>
                                <TableCell>
                                  <img
                                    src={`${image}${info.profileImage}`}
                                    className="hos-img"
                                    alt=""
                                  />
                                </TableCell>
                                <TableCell>{info.name}</TableCell>
                                <TableCell>{info.role}</TableCell>
                                <TableCell>{info.email}</TableCell>

                                <TableCell>
                                  {
                                    // <BootstrapSwitchButton
                                    //   width={100}
                                    //   checked={Boolean(info.status)}
                                    //   onlabel="Active"
                                    //   offlabel="Inactive"
                                    //   onstyle="success"
                                    //   onChange={() => {
                                    //     dataActiveInactive(info._id, info.status);
                                    //   }}
                                    // />
                                    <label className="active-switch">
                                      <input
                                        className="active-switch-input "
                                        type="checkbox"
                                        checked={Boolean(info.status)}
                                        onChange={() => {
                                          dataActiveInactive(
                                            info._id,
                                            info.status
                                          );
                                        }}
                                      />
                                      <span
                                        className="active-switch-label "
                                        data-on="Active"
                                        data-off="Inactive"
                                      ></span>
                                      <span className="active-switch-handle"></span>
                                    </label>
                                  }
                                </TableCell>
                                <TableCell className="action-icon">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={(e) => EditButton(e, info._id)}
                                  ></i>
                                  {/* <i
                                    className="fa-solid fa-trash"
                                    onClick={(e) => handledelet(e, info._id)}
                                  ></i> */}
                                  {localStorage.getItem("Role") === "Admin" ? (
                                    <i
                                      className="fa-solid fa-trash"
                                      onClick={(e) => handledelet(e, info._id)}
                                    ></i>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                                {/* <TableCell align="left" className="dropdown dropdown-action"> <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown"
                                  aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" onClick={(e) => EditButton(e, info._id)}><i className="fa fa-pencil m-r-5"></i>
                                      Edit</a>
                                    <a className="dropdown-item" href="#" data-toggle="modal" data-target="#delete_patient"><i
                                      className="fa fa-trash-o m-r-5"></i> Delete</a></div></TableCell> */}
                              </TableRow>
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
                        className="page-item"
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
      <div
        id="delete_patient"
        className="modal fade delete-modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Are you sure want to delete this Patient?</h3>
              <div className="m-t-20">
                {" "}
                <a href="#" className="btn btn-white" data-dismiss="modal">
                  Close
                </a>
                <button type="submit" className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
