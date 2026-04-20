const { getDb } = require("../db");

const reviewModel = {
    createTable() {
        const db = getDb();
        db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctorId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        userName TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        createdAt TEXT DEFAULT (datetime('now')),
        UNIQUE(doctorId, userId)
      );
    `);
    },

    create({ doctorId, userId, userName, rating, comment }) {
        const db = getDb();
        const result = db.prepare(
            `INSERT INTO reviews (doctorId, userId, userName, rating, comment)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(doctorId, userId) DO UPDATE SET rating = excluded.rating, comment = excluded.comment, createdAt = datetime('now')`
        ).run(doctorId, userId, userName, rating, comment || "");
        return this.findById(result.lastInsertRowid || this.findOne(doctorId, userId)?.id);
    },

    findById(id) {
        const db = getDb();
        return db.prepare("SELECT *, id as _id FROM reviews WHERE id = ?").get(id);
    },

    findOne(doctorId, userId) {
        const db = getDb();
        return db.prepare("SELECT *, id as _id FROM reviews WHERE doctorId = ? AND userId = ?").get(doctorId, userId);
    },

    findByDoctor(doctorId) {
        const db = getDb();
        return db.prepare("SELECT *, id as _id FROM reviews WHERE doctorId = ? ORDER BY createdAt DESC").all(doctorId);
    },

    getAverageRating(doctorId) {
        const db = getDb();
        const result = db.prepare("SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE doctorId = ?").get(doctorId);
        return {
            average: result.avg ? Math.round(result.avg * 10) / 10 : 0,
            count: result.count,
        };
    },

    getAllAverages() {
        const db = getDb();
        const rows = db.prepare(
            "SELECT doctorId, AVG(rating) as avg, COUNT(*) as count FROM reviews GROUP BY doctorId"
        ).all();
        const map = {};
        rows.forEach((r) => {
            map[r.doctorId] = { average: Math.round(r.avg * 10) / 10, count: r.count };
        });
        return map;
    },
};

module.exports = reviewModel;
