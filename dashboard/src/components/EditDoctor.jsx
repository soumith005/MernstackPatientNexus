import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/api";

const EditDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const { id } = useParams();
  const navigateTo = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [useExistingPhoto, setUseExistingPhoto] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const availablePhotos = [
    "/doc1.jpg",
    "/doc2.jpg", 
    "/doc3.jpg",
    "/doc4.jpg",
    "/doc5.jpg",
    "/doc6.jpg",
    "/doc7.jpg",
    "/doc8.jpg",
    "/doc9.jpg",
    "/doc10.jpg",
    "/doc.png",
    "/docHolder.jpg"
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(
          API_ENDPOINTS.GET_DOCTOR_BY_ID(id),
          { withCredentials: true }
        );
        setDoctor(data.doctor);
        setFirstName(data.doctor.firstName);
        setLastName(data.doctor.lastName);
        setEmail(data.doctor.email);
        setPhone(data.doctor.phone);
        setNic(data.doctor.nic);
        setDob(data.doctor.dob.substring(0, 10));
        setGender(data.doctor.gender);
        setDoctorDepartment(data.doctor.doctorDepartment);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching doctor details");
        navigateTo("/doctors");
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id, navigateTo]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
      setUseExistingPhoto(false);
      setSelectedPhoto("");
    };
  };

  const handlePhotoSelection = (photoPath) => {
    setSelectedPhoto(photoPath);
    setDocAvatarPreview("");
    setDocAvatar("");
    setUseExistingPhoto(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      console.log("Starting doctor update...");
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      
      if (useExistingPhoto && selectedPhoto) {
        console.log("Using existing photo:", selectedPhoto);
        formData.append("useExistingPhoto", "true");
        formData.append("selectedPhoto", selectedPhoto);
      } else if (docAvatar) {
        console.log("Uploading new photo:", docAvatar.name);
        formData.append("docAvatar", docAvatar);
      } else {
        console.log("No photo selected or uploaded");
      }

      console.log("Sending request to:", API_ENDPOINTS.UPDATE_DOCTOR(id));
      
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_DOCTOR(id),
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      console.log("Update successful:", response.data);
      toast.success("Doctor updated successfully!");
      navigateTo("/doctors");
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Error updating doctor");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <img src="/logo.png" alt="logo" className="logo"/>
        <h1 className="form-title">EDIT DOCTOR PROFILE</h1>
        <form onSubmit={handleUpdateDoctor}>
          <div className="first-wrapper">
            <div>
              <img
                src={
                  docAvatarPreview 
                    ? `${docAvatarPreview}` 
                    : selectedPhoto 
                    ? selectedPhoto 
                    : doctor.docAvatar?.url || "/docHolder.jpg"
                }
                alt="Doctor Avatar"
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }}
              />
              
              <div style={{ marginTop: "10px" }}>
                <h4>Upload New Photo:</h4>
                <input type="file" onChange={handleAvatar} accept="image/*" />
              </div>
              
              <div style={{ marginTop: "20px" }}>
                <h4>Or Select from Existing Photos:</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "10px" }}>
                  {availablePhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      onClick={() => handlePhotoSelection(photo)}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: selectedPhoto === photo ? "3px solid #007bff" : "1px solid #ddd"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="number"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="number"
                placeholder="NIC"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />
              <input
                type={"date"}
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                value={doctorDepartment}
                onChange={(e) => {
                  setDoctorDepartment(e.target.value);
                }}
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => {
                  return (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  );
                })}
              </select>
              <button type="submit">Update Doctor Profile</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default EditDoctor; 