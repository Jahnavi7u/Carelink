const { initDB, getDb } = require("./database/db");
const bcrypt = require("bcryptjs");

// Initialize the database
initDB();
const db = getDb();

const doctors = [
    // ── Cardiology ──
    { name: "Dr. Arjun Mehta", email: "arjun.mehta@carelink.com", age: 45, gender: "M", phone: "9876543201", mlno: "MCI-CARD-001", libody: "Medical Council of India", specialization: "Cardiology", yoe: 18, degree: "MD Cardiology", clinicname: "HeartCare Clinic", clinicloc: "Mumbai", availability: "10:00 AM - 1:00 PM, 4:00 PM - 6:00 PM", fee: 800, language: "English, Hindi" },
    { name: "Dr. Priya Sharma", email: "priya.sharma@carelink.com", age: 40, gender: "F", phone: "9876543202", mlno: "MCI-CARD-002", libody: "Medical Council of India", specialization: "Cardiology", yoe: 14, degree: "DM Cardiology", clinicname: "Pulse Heart Center", clinicloc: "Delhi", availability: "9:00 AM - 12:00 PM, 3:00 PM - 5:00 PM", fee: 900, language: "English, Hindi, Punjabi" },
    { name: "Dr. Rajesh Iyer", email: "rajesh.iyer@carelink.com", age: 50, gender: "M", phone: "9876543203", mlno: "MCI-CARD-003", libody: "Medical Council of India", specialization: "Cardiology", yoe: 22, degree: "MD Cardiology", clinicname: "CardioLife Hospital", clinicloc: "Chennai", availability: "11:00 AM - 2:00 PM", fee: 1000, language: "English, Tamil" },

    // ── Neurology ──
    { name: "Dr. Sneha Kulkarni", email: "sneha.kulkarni@carelink.com", age: 38, gender: "F", phone: "9876543204", mlno: "MCI-NEUR-001", libody: "Medical Council of India", specialization: "Neurology", yoe: 12, degree: "DM Neurology", clinicname: "BrainCare Clinic", clinicloc: "Pune", availability: "10:00 AM - 1:00 PM, 5:00 PM - 7:00 PM", fee: 850, language: "English, Hindi, Marathi" },
    { name: "Dr. Vikram Singh", email: "vikram.singh@carelink.com", age: 47, gender: "M", phone: "9876543205", mlno: "MCI-NEUR-002", libody: "Medical Council of India", specialization: "Neurology", yoe: 20, degree: "MD Neurology", clinicname: "NeuroWell Center", clinicloc: "Jaipur", availability: "9:00 AM - 12:00 PM", fee: 750, language: "English, Hindi" },
    { name: "Dr. Ananya Reddy", email: "ananya.reddy@carelink.com", age: 35, gender: "F", phone: "9876543206", mlno: "MCI-NEUR-003", libody: "Medical Council of India", specialization: "Neurology", yoe: 9, degree: "DM Neurology", clinicname: "MindHealth Clinic", clinicloc: "Hyderabad", availability: "2:00 PM - 6:00 PM", fee: 700, language: "English, Telugu, Hindi" },

    // ── Orthopedics ──
    { name: "Dr. Suresh Patel", email: "suresh.patel@carelink.com", age: 52, gender: "M", phone: "9876543207", mlno: "MCI-ORTH-001", libody: "Medical Council of India", specialization: "Orthopedics", yoe: 25, degree: "MS Orthopedics", clinicname: "BoneFirst Hospital", clinicloc: "Ahmedabad", availability: "10:00 AM - 2:00 PM", fee: 600, language: "English, Hindi, Gujarati" },
    { name: "Dr. Kavitha Nair", email: "kavitha.nair@carelink.com", age: 42, gender: "F", phone: "9876543208", mlno: "MCI-ORTH-002", libody: "Medical Council of India", specialization: "Orthopedics", yoe: 16, degree: "MS Orthopedics", clinicname: "JointCare Clinic", clinicloc: "Kochi", availability: "9:00 AM - 1:00 PM, 4:00 PM - 6:00 PM", fee: 650, language: "English, Malayalam" },
    { name: "Dr. Anil Gupta", email: "anil.gupta@carelink.com", age: 48, gender: "M", phone: "9876543209", mlno: "MCI-ORTH-003", libody: "Medical Council of India", specialization: "Orthopedics", yoe: 21, degree: "DNB Orthopedics", clinicname: "SpineCare Center", clinicloc: "Lucknow", availability: "11:00 AM - 3:00 PM", fee: 550, language: "English, Hindi" },

    // ── Dermatology ──
    { name: "Dr. Meera Joshi", email: "meera.joshi@carelink.com", age: 36, gender: "F", phone: "9876543210", mlno: "MCI-DERM-001", libody: "Medical Council of India", specialization: "Dermatology", yoe: 10, degree: "MD Dermatology", clinicname: "GlowSkin Clinic", clinicloc: "Mumbai", availability: "10:00 AM - 1:00 PM, 3:00 PM - 5:00 PM", fee: 700, language: "English, Hindi, Marathi" },
    { name: "Dr. Karthik Rajan", email: "karthik.rajan@carelink.com", age: 41, gender: "M", phone: "9876543211", mlno: "MCI-DERM-002", libody: "Medical Council of India", specialization: "Dermatology", yoe: 15, degree: "MD Dermatology", clinicname: "SkinFirst Center", clinicloc: "Bangalore", availability: "9:00 AM - 12:00 PM", fee: 800, language: "English, Kannada, Tamil" },
    { name: "Dr. Ritu Verma", email: "ritu.verma@carelink.com", age: 33, gender: "F", phone: "9876543212", mlno: "MCI-DERM-003", libody: "Medical Council of India", specialization: "Dermatology", yoe: 7, degree: "DVD Dermatology", clinicname: "ClearSkin Clinic", clinicloc: "Delhi", availability: "2:00 PM - 7:00 PM", fee: 650, language: "English, Hindi" },

    // ── Pediatrics ──
    { name: "Dr. Deepak Kumar", email: "deepak.kumar@carelink.com", age: 44, gender: "M", phone: "9876543213", mlno: "MCI-PEDI-001", libody: "Medical Council of India", specialization: "Pediatrics", yoe: 17, degree: "MD Pediatrics", clinicname: "KidsCare Hospital", clinicloc: "Kolkata", availability: "10:00 AM - 1:00 PM, 4:00 PM - 6:00 PM", fee: 500, language: "English, Hindi, Bengali" },
    { name: "Dr. Nisha Agarwal", email: "nisha.agarwal@carelink.com", age: 39, gender: "F", phone: "9876543214", mlno: "MCI-PEDI-002", libody: "Medical Council of India", specialization: "Pediatrics", yoe: 13, degree: "MD Pediatrics", clinicname: "LittleStar Clinic", clinicloc: "Chandigarh", availability: "9:00 AM - 12:00 PM, 3:00 PM - 5:00 PM", fee: 450, language: "English, Hindi, Punjabi" },
    { name: "Dr. Ramesh Babu", email: "ramesh.babu@carelink.com", age: 55, gender: "M", phone: "9876543215", mlno: "MCI-PEDI-003", libody: "Medical Council of India", specialization: "Pediatrics", yoe: 28, degree: "DCH Pediatrics", clinicname: "ChildWell Center", clinicloc: "Coimbatore", availability: "10:00 AM - 2:00 PM", fee: 400, language: "English, Tamil" },

    // ── Psychiatry ──
    { name: "Dr. Aarti Deshmukh", email: "aarti.deshmukh@carelink.com", age: 37, gender: "F", phone: "9876543216", mlno: "MCI-PSYC-001", libody: "Medical Council of India", specialization: "Psychiatry", yoe: 11, degree: "MD Psychiatry", clinicname: "MindPeace Clinic", clinicloc: "Pune", availability: "11:00 AM - 2:00 PM, 5:00 PM - 7:00 PM", fee: 900, language: "English, Hindi, Marathi" },
    { name: "Dr. Sanjay Rao", email: "sanjay.rao@carelink.com", age: 49, gender: "M", phone: "9876543217", mlno: "MCI-PSYC-002", libody: "Medical Council of India", specialization: "Psychiatry", yoe: 22, degree: "DPM Psychiatry", clinicname: "CalmMind Center", clinicloc: "Bangalore", availability: "10:00 AM - 1:00 PM", fee: 1000, language: "English, Kannada" },
    { name: "Dr. Pooja Malhotra", email: "pooja.malhotra@carelink.com", age: 34, gender: "F", phone: "9876543218", mlno: "MCI-PSYC-003", libody: "Medical Council of India", specialization: "Psychiatry", yoe: 8, degree: "MD Psychiatry", clinicname: "WellBeing Clinic", clinicloc: "Delhi", availability: "3:00 PM - 7:00 PM", fee: 850, language: "English, Hindi" },

    // ── Ophthalmology ──
    { name: "Dr. Manoj Tiwari", email: "manoj.tiwari@carelink.com", age: 46, gender: "M", phone: "9876543219", mlno: "MCI-OPHT-001", libody: "Medical Council of India", specialization: "Ophthalmology", yoe: 19, degree: "MS Ophthalmology", clinicname: "ClearVision Eye Center", clinicloc: "Varanasi", availability: "9:00 AM - 1:00 PM", fee: 600, language: "English, Hindi" },
    { name: "Dr. Lakshmi Sundaram", email: "lakshmi.sundaram@carelink.com", age: 43, gender: "F", phone: "9876543220", mlno: "MCI-OPHT-002", libody: "Medical Council of India", specialization: "Ophthalmology", yoe: 17, degree: "DO Ophthalmology", clinicname: "BrightEyes Clinic", clinicloc: "Madurai", availability: "10:00 AM - 2:00 PM, 4:00 PM - 6:00 PM", fee: 550, language: "English, Tamil" },
    { name: "Dr. Rohit Saxena", email: "rohit.saxena@carelink.com", age: 38, gender: "M", phone: "9876543221", mlno: "MCI-OPHT-003", libody: "Medical Council of India", specialization: "Ophthalmology", yoe: 12, degree: "MS Ophthalmology", clinicname: "EyeCare Plus", clinicloc: "Indore", availability: "11:00 AM - 3:00 PM", fee: 500, language: "English, Hindi" },

    // ── Gynecology ──
    { name: "Dr. Swati Kapoor", email: "swati.kapoor@carelink.com", age: 41, gender: "F", phone: "9876543222", mlno: "MCI-GYNE-001", libody: "Medical Council of India", specialization: "Gynecology", yoe: 15, degree: "MS Obstetrics & Gynecology", clinicname: "WomenCare Clinic", clinicloc: "Delhi", availability: "10:00 AM - 1:00 PM, 4:00 PM - 6:00 PM", fee: 700, language: "English, Hindi" },
    { name: "Dr. Sunita Menon", email: "sunita.menon@carelink.com", age: 48, gender: "F", phone: "9876543223", mlno: "MCI-GYNE-002", libody: "Medical Council of India", specialization: "Gynecology", yoe: 21, degree: "MD Gynecology", clinicname: "MotherCare Hospital", clinicloc: "Thiruvananthapuram", availability: "9:00 AM - 12:00 PM", fee: 650, language: "English, Malayalam" },
    { name: "Dr. Amit Choudhary", email: "amit.choudhary@carelink.com", age: 44, gender: "M", phone: "9876543224", mlno: "MCI-GYNE-003", libody: "Medical Council of India", specialization: "Gynecology", yoe: 18, degree: "MS Obstetrics & Gynecology", clinicname: "LifeFirst Clinic", clinicloc: "Patna", availability: "10:00 AM - 2:00 PM", fee: 600, language: "English, Hindi" },

    // ── General Medicine ──
    { name: "Dr. Vinod Sharma", email: "vinod.sharma@carelink.com", age: 53, gender: "M", phone: "9876543225", mlno: "MCI-GENM-001", libody: "Medical Council of India", specialization: "General Medicine", yoe: 26, degree: "MD General Medicine", clinicname: "City Health Clinic", clinicloc: "Jaipur", availability: "9:00 AM - 1:00 PM, 5:00 PM - 7:00 PM", fee: 400, language: "English, Hindi" },
    { name: "Dr. Fatima Sheikh", email: "fatima.sheikh@carelink.com", age: 36, gender: "F", phone: "9876543226", mlno: "MCI-GENM-002", libody: "Medical Council of India", specialization: "General Medicine", yoe: 10, degree: "MBBS, MD", clinicname: "HealthFirst Clinic", clinicloc: "Hyderabad", availability: "10:00 AM - 2:00 PM", fee: 350, language: "English, Hindi, Urdu" },
    { name: "Dr. Prakash Jha", email: "prakash.jha@carelink.com", age: 60, gender: "M", phone: "9876543227", mlno: "MCI-GENM-003", libody: "Medical Council of India", specialization: "General Medicine", yoe: 32, degree: "MD General Medicine", clinicname: "Family Health Center", clinicloc: "Ranchi", availability: "8:00 AM - 12:00 PM", fee: 300, language: "English, Hindi" },
    { name: "Dr. Divya Pillai", email: "divya.pillai@carelink.com", age: 34, gender: "F", phone: "9876543228", mlno: "MCI-GENM-004", libody: "Medical Council of India", specialization: "General Medicine", yoe: 8, degree: "MBBS, DNB", clinicname: "QuickCare Clinic", clinicloc: "Kochi", availability: "11:00 AM - 3:00 PM, 6:00 PM - 8:00 PM", fee: 450, language: "English, Malayalam, Hindi" },

    // ── ENT ──
    { name: "Dr. Harish Chandra", email: "harish.chandra@carelink.com", age: 47, gender: "M", phone: "9876543229", mlno: "MCI-ENT-001", libody: "Medical Council of India", specialization: "ENT", yoe: 20, degree: "MS ENT", clinicname: "ENT Specialty Clinic", clinicloc: "Nagpur", availability: "10:00 AM - 1:00 PM, 4:00 PM - 6:00 PM", fee: 500, language: "English, Hindi, Marathi" },
    { name: "Dr. Geeta Bhat", email: "geeta.bhat@carelink.com", age: 39, gender: "F", phone: "9876543230", mlno: "MCI-ENT-002", libody: "Medical Council of India", specialization: "ENT", yoe: 13, degree: "DNB ENT", clinicname: "HearWell Center", clinicloc: "Surat", availability: "9:00 AM - 12:00 PM, 3:00 PM - 5:00 PM", fee: 550, language: "English, Hindi, Gujarati" },
    { name: "Dr. Naveen Prasad", email: "naveen.prasad@carelink.com", age: 51, gender: "M", phone: "9876543231", mlno: "MCI-ENT-003", libody: "Medical Council of India", specialization: "ENT", yoe: 24, degree: "MS ENT", clinicname: "VoiceCare Hospital", clinicloc: "Visakhapatnam", availability: "10:00 AM - 2:00 PM", fee: 600, language: "English, Telugu" },
];

async function seed() {
    console.log("🌱 Seeding doctor accounts...\n");

    const password = "doctor123"; // Default password for all seeded doctors
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insert = db.prepare(`
    INSERT OR IGNORE INTO doctors (name, email, password, age, gender, phone, mlno, libody, specilization, yoe, degree, clinicname, clinicloc, availability, fee, language, verify)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Verified')
  `);

    let added = 0;
    let skipped = 0;

    for (const doc of doctors) {
        const availabilityArr = doc.availability.split(",").map(s => s.trim());
        const languageArr = doc.language.split(",").map(s => s.trim());

        const result = insert.run(
            doc.name, doc.email, hashedPassword,
            doc.age, doc.gender, doc.phone,
            doc.mlno, doc.libody, doc.specialization,
            doc.yoe, doc.degree,
            doc.clinicname, doc.clinicloc,
            JSON.stringify(availabilityArr), doc.fee, JSON.stringify(languageArr)
        );

        if (result.changes > 0) {
            added++;
            console.log(`  ✅ Added: ${doc.name} (${doc.specialization} - ${doc.gender === "M" ? "Male" : "Female"})`);
        } else {
            skipped++;
            console.log(`  ⏭️  Skipped (already exists): ${doc.name}`);
        }
    }

    console.log(`\n🎉 Done! Added ${added} doctors, skipped ${skipped}.`);
    console.log(`📧 All seeded doctors use password: "${password}"`);
}

seed().catch(console.error);
