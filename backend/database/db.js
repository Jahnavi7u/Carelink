const Database = require("better-sqlite3");
const path = require("path");

let db;

const initDB = () => {
  const dbPath = path.join(__dirname, "carelink.db");
  db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT DEFAULT 'User',
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      age INTEGER,
      gender TEXT CHECK(gender IN ('M', 'F')),
      phone TEXT,
      ephone TEXT,
      smoking INTEGER DEFAULT 0,
      ifsmoking TEXT CHECK(ifsmoking IN ('Occasionally', 'Regularly', 'Heavily', NULL)),
      drinking INTEGER DEFAULT 0,
      ifdrinking TEXT CHECK(ifdrinking IN ('Occasionally', 'Regularly', 'Heavily', NULL)),
      blood TEXT CHECK(blood IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', NULL)),
      allergy TEXT DEFAULT '[]',
      chronic TEXT DEFAULT '[]',
      currentmed TEXT DEFAULT '[]',
      pastsur TEXT DEFAULT '[]',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT DEFAULT 'Doctor',
      verify TEXT DEFAULT 'Verified' CHECK(verify IN ('Under Review', 'Verified')),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      age INTEGER,
      gender TEXT CHECK(gender IN ('M', 'F')),
      phone TEXT,
      mlno TEXT,
      libody TEXT,
      specilization TEXT,
      yoe INTEGER,
      degree TEXT,
      clinicname TEXT,
      clinicloc TEXT,
      availability TEXT DEFAULT '[]',
      fee REAL,
      language TEXT DEFAULT '[]',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctorId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      doctorName TEXT NOT NULL,
      userName TEXT NOT NULL,
      userEmail TEXT NOT NULL,
      docEmail TEXT,
      appointmentDate TEXT NOT NULL,
      timeSlot TEXT NOT NULL,
      status TEXT DEFAULT 'Pending'
    );

    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      date TEXT NOT NULL,
      reason TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      uploadedAt TEXT DEFAULT (datetime('now'))
    );
  `);

  console.log("SQLite database initialized successfully");
  return db;
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call initDB() first.");
  }
  return db;
};

module.exports = { initDB, getDb };
