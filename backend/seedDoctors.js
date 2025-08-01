import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js";

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "HOSPITAL_MANAGEMENT_SYSTEM",
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample doctors data
const doctors = [
  {
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "03001234567",
    nic: "1234567890123",
    dob: "1985-03-15",
    gender: "Female",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "Cardiology",
    docAvatar: {
      public_id: "doctor1",
      url: "https://example.com/doctor1.jpg"
    }
  },
  {
    firstName: "Dr. Michael",
    lastName: "Chen",
    email: "michael.chen@hospital.com",
    phone: "03001234568",
    nic: "1234567890124",
    dob: "1980-07-22",
    gender: "Male",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "Neurology",
    docAvatar: {
      public_id: "doctor2",
      url: "https://example.com/doctor2.jpg"
    }
  },
  {
    firstName: "Dr. Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@hospital.com",
    phone: "03001234569",
    nic: "1234567890125",
    dob: "1988-11-08",
    gender: "Female",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "Dermatology",
    docAvatar: {
      public_id: "doctor3",
      url: "https://example.com/doctor3.jpg"
    }
  },
  {
    firstName: "Dr. James",
    lastName: "Wilson",
    email: "james.wilson@hospital.com",
    phone: "03001234570",
    nic: "1234567890126",
    dob: "1975-12-03",
    gender: "Male",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "Orthopedics",
    docAvatar: {
      public_id: "doctor4",
      url: "https://example.com/doctor4.jpg"
    }
  },
  {
    firstName: "Dr. Lisa",
    lastName: "Thompson",
    email: "lisa.thompson@hospital.com",
    phone: "03001234571",
    nic: "1234567890127",
    dob: "1982-05-18",
    gender: "Female",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "Pediatrics",
    docAvatar: {
      public_id: "doctor5",
      url: "https://example.com/doctor5.jpg"
    }
  },
  {
    firstName: "Dr. Robert",
    lastName: "Davis",
    email: "robert.davis@hospital.com",
    phone: "03001234572",
    nic: "1234567890128",
    dob: "1978-09-25",
    gender: "Male",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "Oncology",
    docAvatar: {
      public_id: "doctor6",
      url: "https://example.com/doctor6.jpg"
    }
  },
  {
    firstName: "Dr. Maria",
    lastName: "Garcia",
    email: "maria.garcia@hospital.com",
    phone: "03001234573",
    nic: "1234567890129",
    dob: "1987-01-14",
    gender: "Female",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "ENT",
    docAvatar: {
      public_id: "doctor7",
      url: "https://example.com/doctor7.jpg"
    }
  },
  {
    firstName: "Dr. David",
    lastName: "Brown",
    email: "david.brown@hospital.com",
    phone: "03001234574",
    nic: "1234567890130",
    dob: "1983-06-30",
    gender: "Male",
    password: "password123",
    role: "Doctor",
    doctorDepartment: "Radiology",
    docAvatar: {
      public_id: "doctor8",
      url: "https://example.com/doctor8.jpg"
    }
  }
];

// Seed doctors function
const seedDoctors = async () => {
  try {
    // Clear existing doctors
    await User.deleteMany({ role: "Doctor" });
    console.log("Cleared existing doctors");

    // Insert new doctors
    const insertedDoctors = await User.insertMany(doctors);
    console.log(`Successfully added ${insertedDoctors.length} doctors to the database`);

    // Display the added doctors
    insertedDoctors.forEach((doctor, index) => {
      console.log(`${index + 1}. Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.doctorDepartment}`);
    });

  } catch (error) {
    console.error("Error seeding doctors:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the seeding
connectDB().then(() => {
  seedDoctors();
}); 