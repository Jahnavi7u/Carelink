const { getDb } = require("../db");

const JSON_FIELDS = ["availability", "language"];
const VALID_COLUMNS = [
  "role", "verify", "name", "email", "password", "age", "gender", "phone",
  "mlno", "libody", "specilization", "yoe", "degree",
  "clinicname", "clinicloc", "availability", "fee", "language",
];

// Map frontend field names to DB column names
const FIELD_ALIASES = {
  specialization: "specilization",
};

function transformRow(row) {
  if (!row) return null;
  const result = { ...row, _id: row.id };
  JSON_FIELDS.forEach((f) => {
    if (result[f]) {
      try { result[f] = JSON.parse(result[f]); } catch { result[f] = []; }
    }
  });
  // Expose specilization as specialization for frontend compatibility
  if (result.specilization !== undefined) {
    result.specialization = result.specilization;
  }
  return result;
}


function prepareData(data) {
  // Remap aliased field names (e.g. specialization -> specilization)
  const mapped = { ...data };
  Object.entries(FIELD_ALIASES).forEach(([alias, dbCol]) => {
    if (mapped[alias] !== undefined && mapped[dbCol] === undefined) {
      mapped[dbCol] = mapped[alias];
      delete mapped[alias];
    }
  });

  const prepared = {};
  VALID_COLUMNS.forEach((col) => {
    if (mapped[col] !== undefined) {
      if (JSON_FIELDS.includes(col)) {
        let value = mapped[col];
        // Convert comma-separated strings to arrays
        if (typeof value === "string") {
          value = value.split(",").map((s) => s.trim()).filter(Boolean);
        }
        prepared[col] = JSON.stringify(value || []);
      } else {
        prepared[col] = mapped[col];
      }
    }
  });
  return prepared;
}

const doctorModel = {
  findById(id) {
    const db = getDb();
    const row = db.prepare("SELECT * FROM doctors WHERE id = ?").get(id);
    return transformRow(row);
  },

  findOne(criteria) {
    const db = getDb();
    const entries = Object.entries(criteria);
    if (entries.length === 0) return null;
    const where = entries
      .map(([key]) => (key === "_id" ? "id = ?" : `${key} = ?`))
      .join(" AND ");
    const values = entries.map(([, val]) => val);
    const row = db.prepare(`SELECT * FROM doctors WHERE ${where}`).get(...values);
    return transformRow(row);
  },

  find(criteria = {}) {
    const db = getDb();
    const entries = Object.entries(criteria);
    if (entries.length === 0) {
      const rows = db.prepare("SELECT * FROM doctors").all();
      return rows.map(transformRow);
    }
    const where = entries
      .map(([key]) => (key === "_id" ? "id = ?" : `${key} = ?`))
      .join(" AND ");
    const values = entries.map(([, val]) => val);
    const rows = db
      .prepare(`SELECT * FROM doctors WHERE ${where}`)
      .all(...values);
    return rows.map(transformRow);
  },

  create(data) {
    const db = getDb();
    const prepared = prepareData(data);
    const columns = Object.keys(prepared);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(prepared);
    const result = db
      .prepare(`INSERT INTO doctors (${columns.join(", ")}) VALUES (${placeholders})`)
      .run(...values);
    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const db = getDb();
    const prepared = prepareData(data);
    const setClause = Object.keys(prepared)
      .map((col) => `${col} = ?`)
      .join(", ");
    const values = [...Object.values(prepared), id];
    db.prepare(`UPDATE doctors SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`).run(
      ...values
    );
    return this.findById(id);
  },

  findByIdAndUpdate(id, data, options = {}) {
    return this.update(id, data);
  },
};

module.exports = doctorModel;
