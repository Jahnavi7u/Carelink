const { getDb } = require("../db");

const prescriptionModel = {
  createTable() {
    const db = getDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appointmentId INTEGER NOT NULL,
        doctorId INTEGER NOT NULL,
        doctorName TEXT NOT NULL,
        userId INTEGER NOT NULL,
        userName TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        medicines TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
      );
    `);
  },

  create({ appointmentId, doctorId, doctorName, userId, userName, diagnosis, medicines, notes }) {
    const db = getDb();
    const result = db.prepare(
      `INSERT INTO prescriptions (appointmentId, doctorId, doctorName, userId, userName, diagnosis, medicines, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(appointmentId, doctorId, doctorName, userId, userName, diagnosis, JSON.stringify(medicines), notes || "");
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    const db = getDb();
    const row = db.prepare("SELECT *, id as _id FROM prescriptions WHERE id = ?").get(id);
    if (row && row.medicines) {
      try { row.medicines = JSON.parse(row.medicines); } catch { row.medicines = []; }
    }
    return row;
  },

  findByAppointment(appointmentId) {
    const db = getDb();
    const row = db.prepare("SELECT *, id as _id FROM prescriptions WHERE appointmentId = ?").get(appointmentId);
    if (row && row.medicines) {
      try { row.medicines = JSON.parse(row.medicines); } catch { row.medicines = []; }
    }
    return row;
  },

  findByPatient(userId) {
    const db = getDb();
    const rows = db.prepare("SELECT *, id as _id FROM prescriptions WHERE userId = ? ORDER BY createdAt DESC").all(userId);
    return rows.map((row) => {
      if (row.medicines) {
        try { row.medicines = JSON.parse(row.medicines); } catch { row.medicines = []; }
      }
      return row;
    });
  },

  findByDoctor(doctorId) {
    const db = getDb();
    const rows = db.prepare("SELECT *, id as _id FROM prescriptions WHERE doctorId = ? ORDER BY createdAt DESC").all(doctorId);
    return rows.map((row) => {
      if (row.medicines) {
        try { row.medicines = JSON.parse(row.medicines); } catch { row.medicines = []; }
      }
      return row;
    });
  },
};

module.exports = prescriptionModel;
