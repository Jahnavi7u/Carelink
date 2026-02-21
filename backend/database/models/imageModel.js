const { getDb } = require("../db");

const VALID_COLUMNS = ["userId", "date", "reason", "imageUrl"];

function transformRow(row) {
  if (!row) return null;
  return { ...row, _id: row.id };
}

const imageModel = {
  findById(id) {
    const db = getDb();
    const row = db.prepare("SELECT * FROM images WHERE id = ?").get(id);
    return transformRow(row);
  },

  find(criteria = {}, options = {}) {
    const db = getDb();
    let sql = "SELECT";

    // Handle field selection
    if (options.select) {
      const fields = options.select.split(" ").filter((f) => !f.startsWith("-"));
      sql += " " + fields.join(", ");
    } else {
      sql += " *";
    }

    sql += " FROM images";
    const values = [];

    const entries = Object.entries(criteria);
    if (entries.length > 0) {
      const where = entries
        .map(([key]) => (key === "_id" ? "id = ?" : `${key} = ?`))
        .join(" AND ");
      values.push(...entries.map(([, val]) => val));
      sql += " WHERE " + where;
    }

    const rows = db.prepare(sql).all(...values);
    return rows.map(transformRow);
  },

  create(data) {
    const db = getDb();
    const prepared = {};
    VALID_COLUMNS.forEach((col) => {
      if (data[col] !== undefined) {
        prepared[col] = data[col];
      }
    });
    const columns = Object.keys(prepared);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(prepared);
    const result = db
      .prepare(`INSERT INTO images (${columns.join(", ")}) VALUES (${placeholders})`)
      .run(...values);
    return this.findById(result.lastInsertRowid);
  },
};

module.exports = imageModel;
