let sqlite3 = require("sqlite3");
let { open } = require("sqlite");

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

let StudentHousingDBController = function () {
  let studentHousingDB = {};

  //this function will save a new user to the database
  studentHousingDB.createNewUser = async newUser => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
        return 1;
      } catch (err) {
        console.log("sign up unsuccessful");
      }
    } finally {
      //   stmt.finalize();
      //   db.close();
    }
  };

  // this function will query the database for a user object by using an username string
  studentHousingDB.getUserByUsername = async query => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
    FROM USER
    WHERE
      username = :username
    `);

      stmt.bind({
        ":username": query,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // this function will query the database for a user object by using an username string and password
  studentHousingDB.getUserCred = async user => {
    let db, stmt;
    try {
      db = await connect();

      console.log(user);
      stmt = await db.prepare(`SELECT *
      FROM USER
      WHERE
        username = :username 
      and
        password = :password
        
    `);
      //Daniel: You did a great job on this project! One thing, for future reference, you can encrypt your passwords using Bcrypt! Super easy tool to use.
      stmt.bind({
        ":username": user.username,
        ":password": user.password,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  /*
   ***************Student and Owner CRUD OPERATIONS*********************
   */

  studentHousingDB.createNewStudent = async function (newStudent) {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
        return 1;
      } catch (err) {
        console.log("sign up unsuccessful");
      }
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.createNewOwner = async function (newOwner) {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
        return 1;
      } catch (err) {
        console.log("owner sign up unsuccessful");
      }
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getOwnerByUsername = async username => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Owner
      WHERE
        username = :username
      `);
      stmt.bind({
        ":username": username,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getOwnerByAuthorID = async authorID => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Owner
      WHERE
        authorID = :authorID
      `);

      stmt.bind({
        ":authorID": authorID,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getStudentByUsername = async username => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Student
      WHERE
        username = :username
      `);
      stmt.bind({
        ":username": username,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  /*
   ***************Listing CRUD OPERATIONS*********************
   */
  // create new Listing
  studentHousingDB.createListing = async (newListing, authorID) => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
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
        ":authorID": authorID,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // get all Listings , may implement pagination later
  studentHousingDB.getListings = async () => {
    let db;
    db = await connect();

    try {
      return await db.all(
        "SELECT Round(Avg(rating),1) AS avgRating,Listing.* FROM Rating JOIN Listing ON Listing.listingID = Rating.listingID GROUP BY Listing.listingID UNION SELECT 0 AS avgRating, Listing.* FROM Listing WHERE Listing.listingID NOT IN (SELECT Rating.listingID FROM Rating)ORDER BY Listing.listingID DESC LIMIT 20;"
      );
    } finally {
      db.close();
    }
  };

  studentHousingDB.getRatingByIDS = async (listingID, user) => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(
        `SELECT rating FROM Rating 
         WHERE listingID = :listingID AND raterID = :raterID
      `
      );

      stmt.bind({
        ":listingID": listingID,
        ":raterID": user,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // get all Listings , may implement pagination later
  studentHousingDB.searchListings = async searches => {
    let db, stmt;
    db = await connect();
    if (searches != undefined) {
      try {
        stmt = await db.prepare(
          `SELECT Round(Avg(rating),1) AS avgRating, Listing.*
          FROM Rating JOIN Listing ON Listing.listingID = Rating.listingID 
          WHERE (Listing.description LIKE :description AND Listing.leaseInMonths = :leaseInMonths 
          AND Listing.offer <= offer AND Listing.openingDate = :openingDate AND Listing.size = :size AND Listing.unitType = :unitType) 
          GROUP BY Listing.listingID UNION SELECT 0 AS avgRating, Listing.* FROM Listing 
          WHERE Listing.listingID NOT IN (SELECT Rating.listingID FROM Rating) ORDER BY Listing.listingID DESC LIMIT 20; 
          `
        );
        stmt.bind({
          ":location": searches.location,
          ":openingDate": searches.openingDate,
          ":size": searches.size,
          ":unitType": searches.unitType,
          ":offer": searches.offer,
          ":description": searches.description,
          ":leaseInMonths": searches.leaseInMonths,
        });
        return await stmt.all();
      } catch (err) {
        console.log(err);
      } finally {
        stmt.finalize();
        db.close();
      }
    } else {
      try {
        return await db.all(
          "SELECT Round(Avg(rating),1) AS avgRating,Listing.* FROM Rating JOIN Listing ON Listing.listingID = Rating.listingID GROUP BY Listing.listingID UNION SELECT 0 AS avgRating, Listing.* FROM Listing WHERE Listing.listingID NOT IN (SELECT Rating.listingID FROM Rating)ORDER BY Listing.listingID DESC LIMIT 20;"
        );
      } finally {
        db.close();
      }
    }
  };

  studentHousingDB.getRatingByIDS = async (listingID, user) => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(
        `SELECT rating FROM Rating 
         WHERE listingID = :listingID AND raterID = :raterID
      `
      );

      stmt.bind({
        ":listingID": listingID,
        ":raterID": user,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // read selected Listing info
  studentHousingDB.getListingByID = async listingID => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Listing
      WHERE
        listingID = :listingID
    `);

      stmt.bind({
        ":listingID": listingID,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // read selected Listing info
  studentHousingDB.getListingByAuthorID = async authorID => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT *
      FROM Listing
      WHERE
        authorID = :authorID
    `);

      stmt.bind({
        ":authorID": authorID,
      });

      return await stmt.all();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.createRating = async newRating => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
        Rating(raterID, rating, listingID)
        VALUES (:raterID, :rating, :listingID)
      `);

      stmt.bind({
        ":raterID": newRating.user,
        ":rating": newRating.rating,
        ":listingID": newRating.listingID,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // update Listing info
  studentHousingDB.updateRating = async ratingToUpdate => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`UPDATE Rating
      SET rating = :rating
      WHERE listingID = :theIDToUpdate AND raterID = :raterID
    `);

      stmt.bind({
        ":raterID": ratingToUpdate.raterID,
        ":rating": ratingToUpdate.rating,
        ":theIDToUpdate": ratingToUpdate.listingID,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // update Listing info
  studentHousingDB.updateListing = async listingToUpdate => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`UPDATE Listing
      SET location = :location, openingDate = :openingDate, size = :size, unitType = :unitType, offer = :offer, description = :description, leaseInMonths = :leaseInMonths, available = :available
      WHERE listingID = :theIDToUpdate
    `);

      stmt.bind({
        ":location": listingToUpdate.location,
        ":openingDate": listingToUpdate.openingDate,
        ":size": listingToUpdate.size,
        ":unitType": listingToUpdate.unitType,
        ":offer": listingToUpdate.offer,
        ":description": listingToUpdate.description,
        ":leaseInMonths": listingToUpdate.leaseInMonths,
        ":available": listingToUpdate.available,
        ":theIDToUpdate": listingToUpdate.listingID,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // delete Listing
  studentHousingDB.deleteListing = async listingToDelete => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`DELETE FROM
      Listing
      WHERE listingID = :theIDToDelete
    `);

      stmt.bind({
        ":theIDToDelete": listingToDelete,
      });

      // console.log(await stmt.run());
      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  /*
   ***************MESSAGE CRUD OPERATIONS*********************
   */

  studentHousingDB.createMessage = async newMessage => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`INSERT INTO
        Message (sender, receiver, time, message)
        VALUES (:sender, :receiver, :time, :message)
      `);

      stmt.bind({
        ":sender": newMessage.sender,
        ":receiver": newMessage.receiver,
        ":time": newMessage.time,
        ":message": newMessage.message,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getMessages = async (sender, receiver) => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT * 
        FROM Message
        WHERE (sender IS :sender AND receiver IS :receiver) OR (sender IS :receiver AND receiver IS :sender)
        ORDER BY time DESC
      `);

      stmt.bind({
        ":sender": sender,
        ":receiver": receiver,
      });

      return await stmt.all();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getAllMessages = async owner => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT * 
        FROM Message
        WHERE sender IS :sender OR receiver IS :sender
        ORDER BY time DESC
      `);

      stmt.bind({
        ":sender": owner,
      });

      // console.log(await stmt.all());
      return await stmt.all();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  studentHousingDB.getMessageByID = async messageID => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`SELECT * 
        FROM Message
        WHERE messageID = :messageID
      `);

      stmt.bind({
        ":messageID": messageID,
      });

      return await stmt.get();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  // delete Message
  studentHousingDB.deleteMessage = async messageToDelete => {
    let db, stmt;
    try {
      db = await connect();

      stmt = await db.prepare(`DELETE FROM
      Message
      WHERE messageID = :messageToDelete
    `);

      stmt.bind({
        ":messageToDelete": messageToDelete,
      });

      return await stmt.run();
    } finally {
      stmt.finalize();
      db.close();
    }
  };

  return studentHousingDB;
};

module.exports = StudentHousingDBController();
