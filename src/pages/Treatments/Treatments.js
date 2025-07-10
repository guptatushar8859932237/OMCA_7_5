import React from "react";
import { Link } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Swal from "sweetalert2";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";
import { image } from "../../Basurl/Baseurl";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { GetAllTreatment } from "../../reducer/TreatmentSlice";
import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import TableCell from "@mui/material/TableCell";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { DeleteTreatment } from "../../reducer/TreatmentSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import { usePDF } from 'react-to-pdf';
import { Edit } from "@mui/icons-material";
export default function Treatments() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const { Treatment, loading, error } = useSelector((state) => state.Treatment);
   const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  useEffect(() => {
    dispatch(GetAllTreatment());
  }, [dispatch]);

  useEffect(() => {
    if (Treatment) {
      setRows(Treatment);
    }
  }, [Treatment]);

  console.log(error, Treatment);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const EditButton = (e, id) => {
    navigate("/Admin/edit-treatments", {
      state: {
        course_id: id,
      },
    });
  };
  const handledelet = (e, hospitalId) => {
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
          dispatch(DeleteTreatment({ id: hospitalId }))
            .unwrap() // If using Redux Toolkit, unwrap to handle success/failure easily
            .then(() => {
              return dispatch(GetAllTreatment());
            })
            .then((newData) => {
              Swal.fire(
                "Deleted!",
                "Treatment Course has been deleted.",
                "success"
              );
              setRows(newData.payload); // Update rows with the latest data
            })
            .catch((err) => {
              Swal.fire("Error!", err?.message || "An error occurred", "error");
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            // text: "Hospital data is safe :)",
            icon: "error",
          });
        }
      });
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="country-top">
                <div className="">
                  <h4 className="page-title mb-0">Manage Treatments</h4>
                </div>
                <div className="search-btn-main">
                  <div className="">
                    <Link to="/Admin/add-treatments" className="add-button">
                      <i className="fa fa-plus"></i> New Treatment
                    </Link>
                    <Link onClick={() => toPDF()}  className="add-button ms-2">
                      <i className="fa fa-file-pdf-o"></i> Pdf
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
                      ref={targetRef}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr.No.</TableCell>
                          <TableCell>Disease Name</TableCell>
                          <TableCell>Price </TableCell>
                          <TableCell>Demanding Country</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows.length > 0 &&
                        rows.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        ).length > 0 ? (
                          rows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((info, i) => (
                              <TableRow key={info.serviceId}>
                                <TableCell>
                                  {page * rowsPerPage + i + 1}
                                </TableCell>
                                <TableCell>{info.course_name}</TableCell>
                                <TableCell>{info.course_price}</TableCell>
                                <TableCell>
                                  {info.most_demanded_country ? (
                                    <span>{info.most_demanded_country}</span>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                                <TableCell className="action-icon">
                                  <i
                                    className="fa-solid fa-pen-to-square"
                                    onClick={(e) =>
                                      EditButton(e, info.course_id)
                                    }
                                  />
                                  {/* <i
              className="fa-solid fa-trash"
              onClick={(e) =>
                                    handledelet(e, info.course_id)
                                  }
            ></i> */}
                                  {localStorage.getItem("Role") === "Admin" ? (
                                    <i
                                      className="fa-solid fa-trash"
                                      onClick={(e) =>
                                        handledelet(e, info.course_id)
                                      }
                                    ></i>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                                {/* <TableCell className="action-icon">
                    <Typography className="action-icon">
                                <a
                                  className="dropdown-item"
                                  onClick={(e) => EditButton(e, info.course_id)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </a>
                              </Typography>
                   <Typography className="action-icon">
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#delete_patient"
                                  onClick={(e) =>
                                    handledelet(e, info.course_id)
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </a>
                              </Typography>
                  </TableCell> */}
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
                        className="page-nation"
                        count={Math.ceil(rows.length / rowsPerPage)}
                        page={page + 1}
                        onChange={(event, value) => setPage(value - 1)}
                        color="primary"
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

          {/* <div className="row">
            <div className="col-md-12">
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => {
                  console.log(item);
                  return (
                    <>
                      <div className="main_content1">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreRoundedIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            className="order-mnge"
                          >
                            <div className="d-flex justify-content-between w-100">
                              <div className="" style={{ width:'50%' }}>
                                <div className="treat-name">
                                  <Typography>{item.course_name}</Typography>
                                  <Typography>Price-{item.course_price}</Typography>
                                </div>
                              </div>
                              <div className="" style={{ width:'50%' }}>
                                <div className="treat-name">
                                  <Typography>
                                    <span>Demanding Country-</span>
                                    {item.most_demanded_country ? (
                                      <span>{item.most_demanded_country}</span>
                                    ) : (
                                      ""
                                    )}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div className="treat-icon">
                              <Typography className="action-icon">
                                <a
                                  className="dropdown-item"
                                  onClick={(e) => EditButton(e, item.course_id)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </a>
                              </Typography>
                              <Typography className="action-icon">
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#delete_patient"
                                  onClick={(e) =>
                                    handledelet(e, item.course_id)
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </a>
                              </Typography>
                            </div>
                            {/* <Typography sx={{ color: 'text.secondary' }}><div align="left" className="dropdown dropdown-action"> <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown"
                            aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                            <div className="dropdown-menu dropdown-menu-right">
                              
                              <a className="dropdown-item" href="#" data-toggle="modal" data-target="#delete_patient"  onClick={(e) => handledelet(e, item.course_id)}><i
                                className="fa fa-trash-o m-r-5"></i> Delete</a></div></div></Typography> */}
          {/* </AccordionSummary>
                          <AccordionDetails className="acc-details">
                            <Typography>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="cat-hd">
                                    <h6>Categories</h6>
                                  </div>
                                  <div className="acc-list">
                                    {item.categories.length > 0 ? (
                                      item.categories.map((row, i) => (
                                        <ul key={i}>
                                          <li>{row.category_name}</li>
                                        </ul>
                                      ))
                                    ) : (
                                      <ul>
                                        <li colSpan="6">
                                          <h3>No Jobs Apply</h3>
                                        </li>
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              </div> */}
          {/* <table className="table table-hover text-right thead-light">
                              <thead>
                                <tr className="text-capitalize">
                                  <th className="text-left common_style">categories</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.categories.length > 0 ? (
                                  item.categories.map((row, i) => (
                                    <tr key={i}>
                                      <td className="text-left common_style">{i + 1}{" "}.{row.category_name
                                      } </td>


                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="6"><h3>No Jobs Apply</h3></td>
                                  </tr>
                                )}
                              </tbody>
                            </table> */}
          {/* </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </>
                  );
                })} */}
          {/* <Stack spacing={2} alignItems="end" marginTop={2}>
                <Pagination
                  count={Math.ceil(rows.length / rowsPerPage)}
                  page={page + 1}
                  onChange={(event, value) => setPage(value - 1)}
                  shape="rounded"
                  className="page-item"
                />
              </Stack> */}
          {/* <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              /> */}
          {/* </div>
          </div> */}
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
