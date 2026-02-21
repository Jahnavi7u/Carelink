const { getDb } = require("../db");

const VALID_COLUMNS = [
  "doctorId", "userId", "doctorName", "userName", "userEmail",
  "docEmail", "appointmentDate", "timeSlot", "status",
];

function transformRow(row) {
  if (!row) return null;
  return { ...row, _id: row.id };
}

function prepareData(data) {
  const prepared = {};
  VALID_COLUMNS.forEach((col) => {
    if (data[col] !== undefined) {
      prepared[col] = data[col];
    }
  });
  return prepared;
}

const appointmentModel = {
  findById(id) {
    const db = getDb();
    const row = db.prepare("SELECT * FROM appointments WHERE id = ?").get(id);
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
    const row = db.prepare(`SELECT * FROM appointments WHERE ${where}`).get(...values);
    return transformRow(row);
  },

  find(criteria = {}, options = {}) {
    const db = getDb();
    let sql = "SELECT * FROM appointments";
    const values = [];

    const entries = Object.entries(criteria);
    if (entries.length > 0) {
      const whereClauses = [];
      entries.forEach(([key, val]) => {
        if (key === "_id") {
          whereClauses.push("id = ?");
          values.push(val);
        } else if (typeof val === "object" && val !== null) {
          // Handle operators like $lt, $gte
          if (val.$lt) {
            whereClauses.push(`${key} < ?`);
            values.push(val.$lt);
          }
          if (val.$gte) {
            whereClauses.push(`${key} >= ?`);
            values.push(val.$gte);
          }
        } else {
          whereClauses.push(`${key} = ?`);
          values.push(val);
        }
      });
      sql += " WHERE " + whereClauses.join(" AND ");
    }

    // Handle sorting
    if (options.sort) {
      const sortEntries = Object.entries(options.sort);
      const orderClauses = sortEntries.map(
        ([key, dir]) => `${key} ${dir === 1 ? "ASC" : "DESC"}`
      );
      sql += " ORDER BY " + orderClauses.join(", ");
    }

    const rows = db.prepare(sql).all(...values);
    return rows.map(transformRow);
  },

  create(data) {
    const db = getDb();
    const prepared = prepareData(data);
    const columns = Object.keys(prepared);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(prepared);
    const result = db
      .prepare(`INSERT INTO appointments (${columns.join(", ")}) VALUES (${placeholders})`)
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
    db.prepare(`UPDATE appointments SET ${setClause} WHERE id = ?`).run(...values);
    return this.findById(id);
  },
};

module.exports = appointmentModel;
