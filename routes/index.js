let express = require("express");
let router = express.Router();
let studentHousingDB = require("../db/mySQLiteDB.js");

// save a session for app
let session;

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Attempting GET /");
  // console.log("Attempting searches for GET /");

  const listings = await studentHousingDB.getListings();
  console.log("got listings");
  //This session feature is pretty cool! So it looks like it stores data from the client side?
  session = req.session;

  if (session.userid) {
    // console.log("got session " + session.userid);

    let user = await studentHousingDB.getUserByUsername(session.userid);
    console.log("got user", user);
    let owner = await studentHousingDB.getOwnerByUsername(user.username);
    console.log("got owner", owner);

    if (owner != undefined) {
      const authorID = owner.authorID;
      // console.log("owner session: ", req.session);
      const ownerListings = await studentHousingDB.getListingByAuthorID(
        authorID
      );
      console.log("render ownerHome ");
      res.render("ownerHome", {
        title: "StudentHousingFinderOwnerHome",
        listings: ownerListings,
        username: owner.username,
        authorID: authorID,
      });
    } else {
      const student = await studentHousingDB.getStudentByUsername(
        user.username
      );
      console.log("got student", student);

      // console.log("student session: ", req.session);
      console.log("render studentHome ");
      res.render("studentHome", {
        title: "StudentHousingFinderStudentHome",
        listings: listings,
        username: user.username,
        student: student.username,
      });
    }
  } else {
    console.log("render index ");
    res.render("index", {
      title: "StudentHousingFinderHome",
      listings: listings,
    });
  }
});

// After user logs in, render page depending on owner/student status
router.post("/user", async function (req, res) {
  console.log("**attempting POST /user");

  // const listings = await studentHousingDB.getListings();
  // console.log("got listings");
  session = req.session;
  session.userid = req.body.username;

  const user = await studentHousingDB.getUserByUsername(session.userid);
  console.log("got user", user);
  // const username = user.username;
  // const owner = await studentHousingDB.getOwnerByUsername(username);
  // console.log("got owner", owner);
  // const student = await studentHousingDB.getOwnerByUsername(user);

  if (req.body.password == user.password) {
    res.redirect("/");
  }
});

/* GET search page. */
router.post("/search/Listing", async function (req, res) {
  // console.log("Attempting GET /");
  console.log("Attempting searches for POST /search/Listing");

  const search = {
    location: req.body.location,
    openingDate: req.body.openingDate,
    size: req.body.size,
    unitType: req.body.unitType,
    offer: req.body.offer,
    description: req.body.description,
    leaseInMonths: req.body.leaseInMonths,
  };
  console.log(search);
  const listings = await studentHousingDB.searchListings(search);
  console.log("got listings");

  session = req.session;

  if (session.userid) {
    console.log("got session " + session.userid);

    let user = await studentHousingDB.getUserByUsername(session.userid);
    // console.log("got user", user);
    let owner = await studentHousingDB.getOwnerByUsername(user.username);
    // console.log("got owner", owner);

    if (owner != undefined) {
      let authorID = owner.authorID;
      console.log("owner session: ", req.session);
      let ownerListings = await studentHousingDB.getListingByAuthorID(authorID);

      // console.log("render ownerHome ");
      res.render("ownerHome", {
        title: "StudentHousingFinderOwnerHome",
        listings: ownerListings,
        username: owner.username,
        authorID: authorID,
      });
    } else {
      const student = await studentHousingDB.getStudentByUsername(
        user.username
      );
      // console.log("got student", student);

      console.log("render studentHome ");
      try {
        res.render("studentHome", {
          title: "StudentHousingFinderStudentHome",
          listings: listings,
          username: user.username,
          student: student.firstName,
        });
      } catch (err) {
        console.log("failed to render");
      }
    }
  } else {
    // console.log("render index ");
    res.render("index", {
      title: "StudentHousingFinderHome",
      listings: listings,
    });
  }
});

// After user logs in, render page depending on owner/student status
router.post("/user", async function (req, res) {
  // console.log("**attempting POST /user");

  // const listings = await studentHousingDB.getListings();
  console.log("got listings");
  session = req.session;
  session.userid = req.body.username;

  const user = await studentHousingDB.getUserByUsername(session.userid);
  // console.log("got user", user);
  const username = user.username;
  const owner = await studentHousingDB.getOwnerByUsername(username);
  // console.log("got owner", owner);
  // const student = await studentHousingDB.getOwnerByUsername(user);

  if (req.body.password == user.password) {
    res.redirect("/");
  }
});

/* GET logout. */
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

/* GET register. */
router.get("/register", function (req, res) {
  res.render("register");
});

/* GET ownerRegister. */
router.get("/owner", function (req, res) {
  res.render("ownerRegister");
});

/* GET studentRegister. */
router.get("/student", function (req, res) {
  res.render("studentRegister");
});

/* POST create listing. */
router.post("/listings/create", async function (req, res) {
  console.log("**attempting POST listings/create");
  session = req.session;

  const listing = req.body;
  // console.log("create listing", listing);
  const user = await studentHousingDB.getUserByUsername(session.userid);
  // console.log("got user", user);
  const owner = await studentHousingDB.getOwnerByUsername(user.username);
  // console.log("got owner", owner);
  const authorID = owner.authorID;
  session.authorID = authorID;
  // console.log("got authorID", session.authorID);

  try {
    await studentHousingDB.createListing(listing, authorID);
    // console.log("Listing created");
  } catch (err) {
    // console.log("Listing not created");
  }

  session = req.session;

  res.redirect("/");
});

/* POST create rating. */
router.post("/createRating", async function (req, res) {
  // console.log("**attempting POST createRating");
  session = req.session;

  const rating = {
    rating: req.body.rating,
    listingID: req.body.listingID,
    user: session.userid,
  };

  // console.log(rating);
  try {
    await studentHousingDB.createRating(rating);
    // console.log("rating created");
  } catch (err) {
    // console.log("rating not created");
  }
  session = req.session;
  // console.log("update listing session", session);
  res.redirect("listings/" + req.body.listingID);
});

/* POST update Rating. */
router.post("/updateRating", async function (req, res) {
  // console.log("**attempting POST ratings/update");
  session = req.session;

  const updatedrating = {
    rating: req.body.rating,
    listingID: req.body.listingID,
    raterID: session.userid,
  };
  // console.log(updatedrating);

  try {
    await studentHousingDB.updateRating(updatedrating);
    // console.log("Listing updated", updatedrating);
  } catch (err) {
    // console.log("Listing not updated");
  }

  session = req.session;
  // console.log("update listing session", session);

  // console.log("POST update listing", listing);
  // console.log("update listing session", session);
  res.redirect("listings/" + req.body.listingID);
});

/* GET listing details page. */
router.get("/listings/:listingID", async function (req, res) {
  // console.log("**attempting GET listing details");

  session = req.session;

  if (session.userid != undefined) {
    const listingID = req.params.listingID;

    console.log("Got listing details ", listingID);

    const listing = await studentHousingDB.getListingByID(listingID);
    console.log("Got listing by ID ", listing);

    // const studObj = {
    //   listingID: listingID,
    //   user: session.userid,
    // };
    // console.log("listingID, user: ", listingID, session.userid);
    const rating = await studentHousingDB.getRatingByIDS(
      listingID,
      session.userid
    );
    // console.log(rating);
    // console.log("Got listing details", listing);
    const owner = await studentHousingDB.getOwnerByAuthorID(listing.authorID);
    // console.log("Got owner " + owner.username);
    const msgs = await studentHousingDB.getMessages(
      session.userid,
      owner.username
    );

    let time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (time.substring(0, 1) == 0) {
      time = time.substring(1);
    }

    res.render("listingDetails", {
      listing,
      user: session.userid,
      rating,
      owner: owner,
      time,
      msgs,
    });
  } else {
    res.redirect("/");
  }
});

/* GET Update listing details. */
router.get("/listings/update/:listingID", async function (req, res) {
  console.log("**attempting POST listings/update/ID");

  const listingID = req.params.listingID;
  console.log("Got listing details ", listingID);

  const listing = await studentHousingDB.getListingByID(listingID);
  console.log("Listing updated");

  session = req.session;
  console.log("session.userid: ", session);

  res.render("listingUpdate", {
    listing,
    username: session.userid,
  });
});

/* POST update listing. */
router.post("/listings/update", async function (req, res) {
  // console.log("**attempting POST listings/update");

  const listing = req.body;
  console.log("POST update listing", listing);

  try {
    await studentHousingDB.updateListing(listing);
    // console.log("Listing updated");
  } catch (err) {
    // console.log("Listing not updated: " + err);
  }

  session = req.session;
  // console.log("update listing session", session);

  res.redirect("/");
});

/* POST delete listing. */
router.post("/listings/delete", async function (req, res) {
  // console.log("**attempting POST delete listing");

  const listingID = req.body.listingID;
  // console.log("delete listing", listingID);
  session = req.session;

  try {
    await studentHousingDB.deleteListing(listingID);
    // console.log("Listing deleted");
  } catch (err) {
    // console.log("Listing not deleted");
  }

  res.redirect("/");
});

/* POST send message. */
router.post("/message/create", async function (req, res) {
  // console.log("Got post message/create");

  const msg = req.body;
  console.log("Got create message", msg);
  try {
    await studentHousingDB.createMessage(msg);
    // console.log("Message created");
  } catch (err) {
    // console.log("Message not created:" + err);
  }

  res.redirect("/listings/" + msg.listingID);
});

/* POST send message. */
router.post("/message/delete", async function (req, res) {
  // console.log("Got post message/delete");

  const msg = req.body;
  console.log("Got delete message", msg);
  try {
    await studentHousingDB.deleteMessage(msg.message);
    // console.log("Message deleted");
  } catch (err) {
    // console.log("Message not deleted:" + err);
  }

  res.redirect("/listings/" + msg.listingID);
});

/* POST view message. */
router.post("/message/view", async function (req, res) {
  // console.log("**attempting POST message/view");

  res.redirect("/message/" + req.body.username);
});

/* GET owner's messages page. */
router.get("/message/:username", async function (req, res) {
  // console.log("**attempting GET owner's messages page");

  const username = req.params.username;
  // console.log("Got username", username);

  const msgs = await studentHousingDB.getAllMessages(username);
  // console.log("Got messages");

  let time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (time.substring(0, 1) == 0) {
    time = time.substring(1);
  }

  res.render("ownerMessages", {
    username: username,
    msgs,
    time,
  });
});

/* POST reply message. */
router.post("/message/reply", async function (req, res) {
  // console.log("**attempting POST message/view");

  const msg = req.body;
  // console.log("create message", msg);
  try {
    await studentHousingDB.createMessage(msg);
    // console.log("Message replied");
  } catch (err) {
    // console.log("Message not replied:" + err);
  }

  res.redirect("/message/" + req.body.sender);
});

module.exports = router;
