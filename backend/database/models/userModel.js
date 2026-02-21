const { getDb } = require("../db");

const JSON_FIELDS = ["allergy", "chronic", "currentmed", "pastsur"];
const BOOLEAN_FIELDS = ["smoking", "drinking"];
const VALID_COLUMNS = [
  "role", "name", "email", "password", "age", "gender", "phone", "ephone",
  "smoking", "ifsmoking", "drinking", "ifdrinking", "blood",
  "allergy", "chronic", "currentmed", "pastsur",
];

function transformRow(row) {
  if (!row) return null;
  const result = { ...row, _id: row.id };
  JSON_FIELDS.forEach((f) => {
    if (result[f]) {
      try { result[f] = JSON.parse(result[f]); } catch { result[f] = []; }
    }
  });
  BOOLEAN_FIELDS.forEach((f) => {
    result[f] = Boolean(result[f]);
  });
  return result;
}

function prepareData(data) {
  const prepared = {};
  VALID_COLUMNS.forEach((col) => {
    if (data[col] !== undefined) {
      if (JSON_FIELDS.includes(col)) {
        prepared[col] = JSON.stringify(data[col] || []);
      } else if (BOOLEAN_FIELDS.includes(col)) {
        prepared[col] = data[col] ? 1 : 0;
      } else {
        prepared[col] = data[col];
      }
    }
  });
  return prepared;
}

const userModel = {
  findById(id) {
    const db = getDb();
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
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
    const row = db.prepare(`SELECT * FROM users WHERE ${where}`).get(...values);
    return transformRow(row);
  },

  find(criteria = {}) {
    const db = getDb();
    const entries = Object.entries(criteria);
    if (entries.length === 0) {
      const rows = db.prepare("SELECT * FROM users").all();
      return rows.map(transformRow);
    }
    const where = entries
      .map(([key]) => (key === "_id" ? "id = ?" : `${key} = ?`))
      .join(" AND ");
    const values = entries.map(([, val]) => val);
    const rows = db
      .prepare(`SELECT * FROM users WHERE ${where}`)
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
      .prepare(`INSERT INTO users (${columns.join(", ")}) VALUES (${placeholders})`)
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
    db.prepare(`UPDATE users SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`).run(
      ...values
    );
    return this.findById(id);
  },
};

module.exports = userModel;
