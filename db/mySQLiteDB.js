const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
async function connect() {
  return open({
    filename: "./db/studenthousing.db",
    driver: sqlite3.Database,
  });
}
sqlite3.verbose();
const StudentHousingDBController = function () {
  const studenthousingDB = {};

  /*
   ***************USER CRUD OPERATIONS*********************
   */

  //this function will save a new user to the database

  studenthousingDB.saveNewUser = async function (newUser) {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
      User(username, password)
      VALUES (:username, :password)
    `);
    stmt.bind({
      ":username": newUser.username,
      ":password": newUser.password,
    });
    await stmt.run();
  };

  console.log("insert successful");

  return studenthousingDB;
};
module.exports = StudentHousingDBController();
