// import { useState, useEffect } from "react";
// import { AddEnquirys } from "../../reducer/EnquirySlice";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
// import { Formik, Field, ErrorMessage, Form } from "formik";
// import * as Yup from "yup";
// import { GetAllCountries } from "../../reducer/Countries";

// import { NavLink, useNavigate } from "react-router-dom";
// export default function AddEnquiry() {
//   const dispatch = useDispatch();

//   const { Enquiry, loading, error } = useSelector((state) => state.Enquiry);
//   const { Countries } = useSelector((state) => state.Countries);
//   console.log(error);
//   useEffect(() => {
//     dispatch(GetAllCountries());
//     console.log(error, Countries);
//   }, [dispatch]);

//   const navigate = useNavigate();

//   const passwordRules =
//     /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
//   const basicSchema = Yup.object().shape({
//     name: Yup.string()
//       .required("Name is required")
//       .min(2, "Name must be at least 2 characters")
//       .max(50, "Name cannot exceed 50 characters"),
//     disease_name: Yup.string().required("Disease name is required"),

//     country: Yup.string().required("Country is required"),
//     address: Yup.string().required("Address is required"),
//     email: Yup.string()

//       .matches(passwordRules, "Please enter a valid email")
//       .required("Email is required"),
//     age: Yup.string()
//       // .matches(passwordRules, { message: "Please create a stronger password" })
//       .required("Age is Required"),
//     emergency_contact_no: Yup.string()
//       .matches(/^[0-9]{10,11}$/, "Phone number must be 10-11 digits")
//       .required("Phone number is required"),
//     patient_emergency_contact_no: Yup.string()
//       .matches(/^[0-9]{10,11}$/, "Emergency Contact No must be 10-11 digits")
//       .required("Emergency contact is required"),

//     gender: Yup.string()
//       .oneOf(["Male", "Female", "Others"], "Invalid gender selection") // Predefined valid values
//       .required("Gender is required"), // Make it mandatory
//   });

//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="row">
//             <div className="col-md-12">
//               <h4 className="page-title">
//                 <span>
//                   <i
//                     class="fi fi-sr-angle-double-small-left"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => {
//                       window.history.back();
//                     }}
//                   ></i>
//                 </span>
//                 New Enquiry
//               </h4>
//             </div>
//           </div>
//           <div className="main_content">
//             <div className="row">
//               <div className="col-lg-12">
//                 <Formik
//                   initialValues={{
//                     name: "",
//                     age: "",
//                     email: "",
//                     gender: "",
//                     emergency_contact_no: "",
//                     patient_emergency_contact_no: "",
//                     country: "",
//                     address: "",
//                     disease_name: "",
//                     patient_relation_name: "",
//                     patient_relation: "",
//                     relation_id: null, // file
//                   }}
//                   validationSchema={basicSchema}
//                   onSubmit={async (values, { setSubmitting }) => {
//                     const formData = new FormData();
//                     for (const key in values) {
//                       formData.append(key, values[key]);
//                     }

//                     try {
//                       const result = await dispatch(
//                         AddEnquirys(formData)
//                       ).unwrap();
//                       Swal.fire(`${result.message}`, "", "success");
//                       navigate("/Admin/Inquiry");
//                     } catch (err) {
//                       Swal.fire(
//                         "Error!",
//                         err?.message || "An error occurred",
//                         "error"
//                       );
//                     }

//                     setSubmitting(false);
//                   }}
//                 >
//                   {({ isSubmitting, setFieldValue }) => (
//                     <Form>
//                       <div className="row">
//                         <div>
//                           <h5>Patient Details</h5>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Name<span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="text"
//                               name="name"
//                             />
//                             <ErrorMessage
//                               name="name"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Email<span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="email"
//                               name="email"
//                             />
//                             <ErrorMessage
//                               name="email"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Age<span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="number"
//                               name="age"
//                             />
//                             <ErrorMessage
//                               name="age"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Address<span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="text"
//                               name="address"
//                             />
//                             <ErrorMessage
//                               name="address"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Phone No. / (WhatsAap )
//                               <span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="text"
//                               name="emergency_contact_no"
//                             />
//                             <ErrorMessage
//                               name="emergency_contact_no"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Emergency Contact No
//                               <span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="text"
//                               name="patient_emergency_contact_no"
//                             />
//                             <ErrorMessage
//                               name="patient_emergency_contact_no"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Disease name<span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="text"
//                               name="disease_name"
//                             />
//                             <ErrorMessage
//                               name="disease_name"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Country <span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               as="select"
//                               className="form-control"
//                               name="country"
//                             >
//                               <option value="" disabled selected>
//                                 Select a country
//                               </option>
//                               {Countries.map((con, index) => (
//                                 <option key={index} value={con.name}>
//                                   {con.name}
//                                 </option>
//                               ))}
//                             </Field>
//                             <ErrorMessage
//                               name="country"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set gender-select">
//                             <label className="gen-label">
//                               Gender<span className="text-danger">*</span>
//                             </label>
//                             <div className="form-check-inline">
//                               <label className="form-check-label">
//                                 <Field
//                                   type="radio"
//                                   name="gender"
//                                   value="Male"
//                                   className="form-check-input"
//                                 />
//                                 Male
//                               </label>
//                             </div>
//                             <div className="form-check-inline">
//                               <label className="form-check-label">
//                                 <Field
//                                   type="radio"
//                                   name="gender"
//                                   value="Female"
//                                   className="form-check-input"
//                                 />
//                                 Female
//                               </label>
//                             </div>
//                             <div className="form-check-inline">
//                               <label className="form-check-label">
//                                 <Field
//                                   type="radio"
//                                   name="gender"
//                                   value="Others"
//                                   className="form-check-input"
//                                 />
//                                 Others
//                               </label>
//                             </div>
//                             <ErrorMessage
//                               name="gender"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         {/* <div className="col-sm-6">
//                                                     <div className="form-group">
//                                                         <label>Discussion Notes<span className="text-danger">*</span></label><br></br>
//                                                         <Field id="w3review" name="discussionNotes" rows="4" cols="70" className="form-control" component="textarea"></Field>
//                                                         <ErrorMessage name="discussionNotes" component="div" className="text-danger" />
//                                                     </div>
//                                                 </div> */}
//                       </div>
//                       <div className="row">
//                         <div>
//                           <h5>Attendant Details</h5>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Attendant Nam
//                               <span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="text"
//                               name="patient_relation_name"
//                             />
//                             <ErrorMessage
//                               name="patient_relation_name"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Patient Relation
//                               <span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="text"
//                               name="patient_relation"
//                             />
//                             <ErrorMessage
//                               name="patient_relation"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                         {/* <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Emergency Contact Number
//                               <span className="text-danger">*</span>
//                             </label>
//                             <Field
//                               className="form-control"
//                               type="number"
//                               name="patient_emergency_contact_no"
//                             />
//                             <ErrorMessage
//                               name="age"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div> */}
//                         <div className="col-sm-6">
//                           <div className="field-set">
//                             <label>
//                               Patient Relation Id
//                               <span className="text-danger">*</span>
//                             </label>
//                             <input
//                               className="form-control"
//                               type="file"
//                               name="patient_relation_id"
//                               onChange={(event) =>
//                                 setFieldValue(
//                                   "relation_id",
//                                   event.currentTarget.files[0]
//                                 )
//                               }
//                             />
//                             <ErrorMessage
//                               name="patient_relation_id"
//                               component="div"
//                               style={{ color: "red" }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="">
//                         <button
//                           className="submit-btn"
//                           type="submit"
//                           disabled={isSubmitting || loading}
//                         >
//                           {loading ? "Submitting..." : "Submit"}
//                         </button>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";

import { AddEnquirys } from "../../reducer/EnquirySlice";
import { GetAllCountries } from "../../reducer/Countries";

export default function AddEnquiry() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.Enquiry);
  const { Countries } = useSelector((state) => state.Countries);

  useEffect(() => {
    dispatch(GetAllCountries());
  }, [dispatch]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const basicSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required("Name is required"),
    disease_name: Yup.string().required("Disease name is required"),
    country: Yup.string().required("Country is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().matches(emailRegex, "Invalid email").required(),
    age: Yup.string().required("Age is required"),
    emergency_contact_no: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Phone number must be 10-11 digits")
      .required("Phone number is required"),
    patient_emergency_contact_no: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Emergency Contact must be 10-11 digits")
      .required("Emergency contact is required"),
    gender: Yup.string()
      .oneOf(["Male", "Female", "Others"])
      .required("Gender is required"),
    patient_relation_name: Yup.string().required("Attendant name is required"),
    patient_relation: Yup.string().required("Patient relation is required"),
    relation_id: Yup.mixed()
      .nullable()
      .required("Patient Relation ID is required"),
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <h4 className="page-title">
              <span>
                <i
                  className="fi fi-sr-angle-double-small-left"
                  style={{ cursor: "pointer" }}
                  onClick={() => window.history.back()}
                ></i>
              </span>
              New Enquiry
            </h4>
          </div>
        </div>

        <div className="main_content">
          <div className="row">
            <div className="col-lg-12">
              <Formik
                initialValues={{
                  name: "",
                  age: "",
                  email: "",
                  gender: "",
                  emergency_contact_no: "",
                  patient_emergency_contact_no: "",
                  country: "",
                  address: "",
                  disease_name: "",
                  patient_relation_name: "",
                  patient_relation: "",
                  relation_id: null,
                }}
                validationSchema={basicSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  const formData = new FormData();
                  for (const key in values) {
                    formData.append(key, values[key]);
                  }

                  try {
                    const result = await dispatch(AddEnquirys(formData)).unwrap();
                    Swal.fire(result.message, "", "success");
                    navigate("/Admin/Inquiry");
                  } catch (err) {
                    Swal.fire("Error!", err?.message || "Something went wrong", "error");
                  }
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    {/* --- Patient Details --- */}
                    <div className="row">
                      <div>
                        <h5>Patient Details</h5>
                      </div>

                      {/* Name */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Name<span className="text-danger">*</span></label>
                          <Field className="form-control" name="name" />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Email<span className="text-danger">*</span></label>
                          <Field className="form-control" name="email" type="email" />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Age */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Age<span className="text-danger">*</span></label>
                          <Field className="form-control" name="age" type="number" />
                          <ErrorMessage name="age" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Address */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Address<span className="text-danger">*</span></label>
                          <Field className="form-control" name="address" />
                          <ErrorMessage name="address" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Emergency Contact No */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Phone No / WhatsApp<span className="text-danger">*</span></label>
                          <Field className="form-control" name="emergency_contact_no" />
                          <ErrorMessage name="emergency_contact_no" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Patient Emergency Contact No */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Emergency Contact No<span className="text-danger">*</span></label>
                          <Field className="form-control" name="patient_emergency_contact_no" />
                          <ErrorMessage name="patient_emergency_contact_no" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Disease Name */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Disease Name<span className="text-danger">*</span></label>
                          <Field className="form-control" name="disease_name" />
                          <ErrorMessage name="disease_name" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Country */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Country<span className="text-danger">*</span></label>
                          <Field as="select" className="form-control" name="country">
                            <option value="">Select a country</option>
                            {Countries.map((con, idx) => (
                              <option key={idx} value={con.name}>
                                {con.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="country" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Gender */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Gender<span className="text-danger">*</span></label>
                          <div className="form-check">
                            <label className="form-check-label">
                              <Field type="radio" name="gender" value="Male" className="form-check-input" /> Male
                            </label>
                          </div>
                          <div className="form-check">
                            <label className="form-check-label">
                              <Field type="radio" name="gender" value="Female" className="form-check-input" /> Female
                            </label>
                          </div>
                          <div className="form-check">
                            <label className="form-check-label">
                              <Field type="radio" name="gender" value="Others" className="form-check-input" /> Others
                            </label>
                          </div>
                          <ErrorMessage name="gender" component="div" className="text-danger" />
                        </div>
                      </div>
                    </div>
                    {/* --- Attendant Details --- */}
                    <div className="row">
                      <h5>Attendant Details</h5>
                      {/* Attendant Name */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Attendant Name<span className="text-danger">*</span></label>
                          <Field className="form-control" name="patient_relation_name" />
                          <ErrorMessage name="patient_relation_name" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Patient Relation */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Patient Relation<span className="text-danger">*</span></label>
                          <Field className="form-control" name="patient_relation" />
                          <ErrorMessage name="patient_relation" component="div" className="text-danger" />
                        </div>
                      </div>
                      {/* Relation ID File Upload */}
                      <div className="col-sm-6">
                        <div className="field-set">
                          <label>Attendent Relation <span className="text-danger">*</span></label>
                          <input
                            className="form-control"
                            type="file"
                            name="relation_id"
                            onChange={(e) =>
                              setFieldValue("relation_id", e.currentTarget.files[0])
                            }
                          />
                          <ErrorMessage name="relation_id" component="div" className="text-danger" />
                        </div>
                      </div>
                    </div>
                    {/* Submit Button */}
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