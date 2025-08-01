import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

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

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log("Fetching doctors from:", "http://localhost:4000/api/v1/user/doctors");
        
        // Test if backend is responding
        const response = await axios.get("http://localhost:4000/api/v1/user/doctors");
        console.log("Response status:", response.status);
        console.log("Raw response:", response.data);
        
        setDoctors(response.data.doctors);
        console.log("Doctors loaded:", response.data.doctors);
        console.log("Number of doctors:", response.data.doctors?.length || 0);
        
        // Log each doctor's department
        response.data.doctors?.forEach((doctor, index) => {
          console.log(`Doctor ${index + 1}:`, doctor.firstName, doctor.lastName, "- Department:", doctor.doctorDepartment);
        });
        
      } catch (error) {
        console.error("Error fetching doctors:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        toast.error(`Failed to load doctors: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
      
      // Find the selected doctor
      const selectedDoctor = doctors.find(doctor => doctor._id === selectedDoctorId);
      
      if (!selectedDoctor) {
        toast.error("Please select a doctor");
        return;
      }
      
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: selectedDoctor.firstName,
          doctor_lastName: selectedDoctor.lastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setFirstName(""),
        setLastName(""),
        setEmail(""),
        setPhone(""),
        setNic(""),
        setDob(""),
        setGender(""),
        setAppointmentDate(""),
        setDepartment(""),
        setSelectedDoctorId(""),
        setHasVisited(false),
        setAddress("");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first to submit an appointment");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Appointment</h2>
        <form onSubmit={handleAppointment}>
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
          </div>
          <div>
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
          </div>
          <div>
            <input
              type="number"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setSelectedDoctorId("");
              }}
            >
              {departmentsArray.map((depart, index) => {
                return (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                );
              })}
            </select>
            {/* <select
              value={`${doctorFirstName} ${doctorLastName}`}
              onChange={(e) => {
                const [firstName, lastName] = e.target.value.split(" ");
                setDoctorFirstName(firstName);
                setDoctorLastName(lastName);
              }}
              disabled={!department}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor, index) => (
                  <option
                    value={`${doctor.firstName} ${doctor.lastName}`}
                    key={index}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
            </select> */}
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              disabled={!department || loading}
            >
              <option value="">
                {loading ? "Loading doctors..." : "Select Doctor"}
              </option>
              {(() => {
                const filteredDoctors = doctors.filter((doctor) => doctor.doctorDepartment === department);
                console.log("Current department:", department);
                console.log("All doctors:", doctors);
                console.log("Filtered doctors for", department, ":", filteredDoctors);
                return filteredDoctors.map((doctor, index) => (
                  <option
                    key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ));
              })()}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Have you visited before?</p>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
              style={{ flex: "none", width: "25px" }}
            />
          </div>
          <button style={{ margin: "0 auto" }}>GET APPOINTMENT</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
