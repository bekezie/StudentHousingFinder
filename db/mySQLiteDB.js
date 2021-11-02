const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

sqlite3.verbose();

// Connect to housing.db with sqlite3
async function connect() {
  return open({
    filename: "./db/housing.db",
    driver: sqlite3.Database,
  });
}

/*
 ***************USER CRUD OPERATIONS*********************
 */

const StudentHousingDBController = function () {
  const studenthousingDB = {};

  //this function will save a new user to the database
  studenthousingDB.createNewUser = async newUser => {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
      User(username, password)
      VALUES (:username, :password)
    `);
    stmt.bind({
      ":username": newUser.username,
      ":password": newUser.password,
    });

    try {
      await stmt.run();
      console.log("sign up successful");
    } catch (err) {
      console.log("sign up unsuccessful");
    }
  };

  // this function will query the database for a user object by using an username string
  studenthousingDB.getUserByUsername = async query => {
    const db = await connect();

    const stmt = await db.prepare(`SELECT *
    FROM USER
    WHERE
      username = :username
    `);

    stmt.bind({
      ":username": query,
    });

    return await stmt.get();
  };

  // this function will query the database for a user object by using an username string and password
  studenthousingDB.getUserCred = async user => {
    const db = await connect();

    console.log(user);
    const stmt = await db.prepare(`SELECT *
    FROM USER
    WHERE
      username = :username 
    and
      password = :password
      
  `);

    stmt.bind({
      ":username": user.username,
      ":password": user.password,
    });

    return await stmt.get();
  };

  /*
   ***************Student and Owner CRUD OPERATIONS*********************
   */

  studenthousingDB.createNewStudent = async function (newStudent) {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
      Student(username, firstName, lastName, schoolID, semester, year, budget)
      VALUES (:username, :firstName, :lastName, :schoolID, :semester, :year, :budget)
    `);
    stmt.bind({
      ":username": newStudent.username,
      ":firstName": newStudent.firstName,
      ":lastName": newStudent.lastName,
      ":schoolID": newStudent.schoolID,
      ":semester": newStudent.semester,
      ":year": newStudent.year,
      ":budget": newStudent.budget,
    });

    try {
      await stmt.run();
      console.log("sign up successful");
    } catch (err) {
      console.log("sign up unsuccessful");
    }
  };

  studenthousingDB.createNewOwner = async function (newOwner) {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
      Owner(username, firstName, lastName)
      VALUES (:username, :firstName, :lastName)
    `);
    stmt.bind({
      ":username": newOwner.username,
      ":firstName": newOwner.firstName,
      ":lastName": newOwner.lastName,
    });

    try {
      await stmt.run();
      console.log("sign up successful");
    } catch (err) {
      console.log("sign up unsuccessful");
    }
  };

  studenthousingDB.getOwnerByUsername = async ownerID => {
    const db = await connect();

    const stmt = await db.prepare(`SELECT *
    FROM Owner
    WHERE
      username = :username
    `);
    stmt.bind({
      ":username": ownerID.username,
    });

    return await stmt.get();
  };

  studenthousingDB.getStudentByUsername = async studentID => {
    const db = await connect();

    const stmt = await db.prepare(`SELECT *
    FROM Student
    WHERE
      username = :username
    `);
    stmt.bind({
      ":username": studentID.username,
    });

    return await stmt.get();
  };

  /*
   ***************Listing CRUD OPERATIONS*********************
   */
  // create new Listing
  studenthousingDB.createListing = async newListing => {
    const db = await connect();

    const stmt = await db.prepare(`INSERT INTO
    Listing(location, openingDate, size, unitType, offer, description, leaseInMonths, available, authorID)
    VALUES (:location, :openingDate, :size, :unitType, :offer, :description, :leaseInMonths, :available, :authorID)
  `);

    stmt.bind({
      ":location": newListing.location,
      ":openingDate": newListing.openingDate,
      ":size": newListing.size,
      ":unitType": newListing.unitType,
      ":offer": newListing.offer,
      ":description": newListing.description,
      ":leaseInMonths": newListing.leaseInMonths,
      ":available": newListing.available,
      ":authorID": 1,
    });

    return await stmt.run();
  };

  // get all Listings , may implement pagination later
  studenthousingDB.getListings = async () => {
    const db = await connect();

    return await db.all(
      "SELECT * FROM Listing ORDER BY listingId DESC LIMIT 20"
    );
  };

  // read selected Listing info
  studenthousingDB.getListingByID = async listingID => {
    const db = await connect();

    const stmt = await db.prepare(`SELECT *
    FROM Listing
    WHERE
      listingID = :listingID
  `);

    stmt.bind({
      ":listingID": listingID,
    });

    return await stmt.get();
  };

  // update Listing info
  studenthousingDB.updateListing = async listingToUpdate => {
    const db = await connect();

    const stmt = await db.prepare(`UPDATE Listing
    SET location = :location, openingDate = :openingDate, size = :size, unitType = :unitType, offer = :offer, description = :description, leaseInMonths = :leaseInMonths, available = :available
    WHERE listingID = :theIDToUpdate
  `);

    stmt.bind({
      ":theIDToUpdate": listingToUpdate.listingID,
      ":location": listingToUpdate.location,
      ":openingDate": listingToUpdate.openingDate,
      ":size": listingToUpdate.size,
      ":unitType": listingToUpdate.unitType,
      ":offer": listingToUpdate.offer,
      ":description": listingToUpdate.description,
      ":leaseInMonths": listingToUpdate.leaseInMonths,
      ":available": listingToUpdate.available,
    });

    return await stmt.run();
  };

  // delete Listing
  studenthousingDB.deleteListing = async listingToDelete => {
    const db = await connect();

    const stmt = await db.prepare(`DELETE FROM
    Listing
    WHERE listingID = :theIDToDelete
  `);

    stmt.bind({
      ":theIDToDelete": listingToDelete.listingID,
    });

    return await stmt.run();
  };

  /*
   ***************MESSAGE CRUD OPERATIONS*********************
   */

  // async function createMessage(newMessage) {
  //   const db = await connect();

  //   const stmt = await db.prepare(`INSERT INTO
  //     Message (messageID, sender, receiver, time, message)
  //     VALUES (:messageID, :sender, :receiver, :time, :message)
  //   `);

  //   stmt.bind({
  //     ":messageID": newMessage.messageID,
  //     ":sender": newMessage.sender,
  //     ":receiver": newMessage.receiver,
  //     ":time": newMessage.time,
  //     ":message": newMessage.message,
  //   });

  //   return await stmt.run();
  // }

  return studenthousingDB;
};

module.exports = StudentHousingDBController();
