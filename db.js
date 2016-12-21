const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('logs.db');

function initializeDb() {
  return new Promise(function(resolve, reject) {
    const checkTable = 
      `SELECT "name" 
       FROM "sqlite_master" 
       WHERE type="table" AND name=$name;`;
    db.get(checkTable, { $name: "temperature" }, function(err, row) {
      if (err) reject(err); 
      else if (row) resolve(true); // table exists
      else resolve(false); // table doesn't exist
    });
  });
}

function createTables() {
  const p1 = new Promise(function(resolve, reject) {
    console.log('> Creating table temperature.');
    db.run(
      `CREATE TABLE "temperature" (
	      "id"    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	      "value"	REAL,
	      "date"	TEXT);`,
      function(err) {
        if (err) reject(err);
        else resolve();
      });
  });

  const p2 = new Promise(function(resolve, reject) {
    console.log('> Creating table relhumidity.');
    db.run(
      `CREATE TABLE "relhumidity" (
	      "id"	  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	      "value"	REAL,
	      "date"	TEXT);`,
      function(err) {
        if (err) reject(err);
        else resolve();
      });
  });

  return Promise.all([p1, p2]);
}

function initialize() {
  initializeDb()
  .then(exists => {
    if (!exists) {
      console.log('> New DB; creating schema.');
      return createTables();
    } 
    else console.log('> Existing DB with updated schema.')
  })
  .catch(err => console.log(err));
}

function close() {
  db.close();
}

module.exports = { initialize, close }