import React, { useState, useEffect } from "react";
import { EditEnquiryType } from "../../reducer/EnquirySlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { GetAllEnquiry } from "../../reducer/EnquirySlice";
import { GetAllCountries } from "../../reducer/Countries";
import { InputLabel, MenuItem, Select } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
export default function EditEnquiry() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { Enquiry, loading, error } = useSelector((state) => state.Enquiry);
  const { Countries } = useSelector((state) => state.Countries);
  const [editenquiry, setEnquiry] = useState("");
  useEffect(() => {
    dispatch(GetAllCountries());
  }, [dispatch]);
  useEffect(() => {
    dispatch(GetAllEnquiry());
  }, [dispatch]);
  console.log(Enquiry)
  useEffect(() => {
    if (location.state?.enquiryId && Enquiry.length > 0) {
      const selectedUser = Enquiry.find(
        (item) => item.enquiryId === location.state.enquiryId
      );
      setEnquiry(selectedUser || {});
    }
  }, [location.state?.enquiryId, Enquiry]);
  const basicSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    disease_name: Yup.string().required("Disease name is required"),
    country: Yup.string().required("Country is required"),
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    age: Yup.string().required("Age is required"),
    address: Yup.string().required("Address is required"),
    emergency_contact_no: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Phone number must be 10-11 digits")
      .required("Phone number is required"),
    patient_emergency_contact_no: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Emergency Contact No must be 10-11 digits")
      .required("Emergency Contact No is required"),
    gender: Yup.string()
      .oneOf(["Male", "Female", "Others"], "Invalid gender selection")
      .required("Gender is required"),
  });
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <h4 className="page-title">
              <span>
                <i class="fi fi-sr-angle-double-small-left" onClick={()=>{
                                    window.history.back()
                                }} style={{cursor:"pointer"}}></i>
              </span>
              Edit Enquiry
            </h4>
          </div>
        </div>
        <div className="main_content">
          <div className="row">
            <div className="col-lg-12">
              <Formik
                enableReinitialize
                initialValues={{
                  name: editenquiry?.name || "",
                  age: editenquiry?.age || "",
                  email: editenquiry?.email || "",
                  gender: editenquiry?.gender || "",
                  emergency_contact_no: editenquiry?.emergency_contact || "",
                  country: editenquiry?.country || "",
                  disease_name: editenquiry?.disease_name || "",
                  address: editenquiry?.address || "",
                  patient_emergency_contact_no: editenquiry?.patient_emergency_contact_no || "",
                }}
                validationSchema={basicSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await dispatch(
                      EditEnquiryType({ id: editenquiry.enquiryId, ...values })
                    ).unwrap();
                    Swal.fire(
                      "Enquiry details updated successfully!",
                      "",
                      "success"
                    );
                    navigate("/Admin/Inquiry");
                  } catch (err) {
                    Swal.fire(
                      "Error!",
                      err?.message || "An error occurred",
                      "error"
                    );
                  }
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            type="text"
                            name="name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Email <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            type="email"
                            name="email"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Age <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            type="number"
                            name="age"
                          />
                          <ErrorMessage
                            name="age"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Phone No / (whats App) <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            type="text"
                            name="emergency_contact_no"
                          />
                          <ErrorMessage
                            name="emergency_contact_no"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Emergency Contact No <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            type="text"
                            name="patient_emergency_contact_no"
                          />
                          <ErrorMessage
                            name="patient_emergency_contact_no"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Address <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            type="text"
                            name="address"
                          />
                          <ErrorMessage
                            name="address"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Disease Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            type="text"
                            name="disease_name"
                          />
                          <ErrorMessage
                            name="disease_name"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>
                            Country <span className="text-danger">*</span>
                          </label>
                          {/* <Field
                            as="select"
                            className="form-control"
                            name="country"
                          >
                            <option value="">Select Country</option>
                            {Countries.map((con, index) => (
                              <option key={index} value={con.name}>
                                {con.name}
                              </option>
                            ))}
                          </Field> */}
                          <Field name="country">
                            {({ field, form }) => (
                              <>
                                <FormControl fullWidth size="small">
                                  <Select
                                    id="country"
                                    name="country"
                                    value={field.value}
                                    onChange={(event) =>
                                      form.setFieldValue("country", event.target.value)
                                    }
                                    input={<OutlinedInput placeholder="Select Country" />}
                                    className="select-country form-control"
                                    displayEmpty
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200, // Limit dropdown height
                                        },
                                      },
                                    }}
                                    sx={{
                                      height: 40, // Fix input height
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Country</em>
                                    </MenuItem>
                                    {Countries.map((country, index) => (
                                      <MenuItem key={index} value={country.name}>
                                        {country.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <ErrorMessage
                                  name="country"
                                  component="div"
                                  style={{ color: "red" }}
                                />
                              </>
                            )}
                          </Field>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="field-set gender-select">
                          <label className="gen-label">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <Field
                                type="radio"
                                name="gender"
                                value="Male"
                                className="form-check-input"
                              />
                              Male
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <Field
                                type="radio"
                                name="gender"
                                value="Female"
                                className="form-check-input"
                              />
                              Female
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <Field
                                type="radio"
                                name="gender"
                                value="Others"
                                className="form-check-input"
                              />
                              Others
                            </label>
                          </div>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <button
                        className="submit-btn"
                        type="submit"
                        disabled={isSubmitting || loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
