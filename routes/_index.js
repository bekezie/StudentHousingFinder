let express = require("express");
let router = express.Router();
let studentHousingDB = require("../db/mySQLiteDB.js");

// save a session for app
let session = require("express-session");
router.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "564653456fsd3fd76f3",
    cookie: {
      expires: 10000000,
    },
  })
);

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Attempting GET /");

  const listings = await studentHousingDB.getListings();
  console.log("got listings");

  session = req.session;

  if (session.userid) {
    console.log("got session " + session.userid);

    const username = await studentHousingDB.getUserByUsername(session.userid);
    console.log("got user", username);
    const owner = await studentHousingDB.getOwnerByUsername(username);
    console.log("got owner", owner);
    const authorID = owner.authorID;

    if (owner != undefined) {
      console.log("owner session: ", req.session);
      res.redirect("/ownerHome");
      // res.render("ownerHome", {
      //   title: "StudentHousingFinderOwnerHome",
      //   listings: listings,
      //   username: username,
      //   authorID: authorID,
      // });
    } else {
      // res.render("studentHome", {
      //   title: "StudentHousingFinderStudentHome",
      //   listings: listings,
      //   username: username,
      // });
      console.log("student session: ", req.session);
    }
  } else {
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

  const username = await studentHousingDB.getUserByUsername(req.body.username);
  console.log("got user", username);
  const owner = await studentHousingDB.getOwnerByUsername(username);
  console.log("got owner", owner);
  // const student = await studentHousingDB.getOwnerByUsername(user);

  if (req.body.password == username.password) {
    if (owner != undefined) {
      console.log("owner session: ", req.session);
      res.redirect("/ownerHome");
      // res.render("ownerHome", {
      //   title: "StudentHousingFinderOwnerHome",
      //   listings: listings,
      //   username: username,
      //   authorID: authorID,
      // });
    } else {
      // res.render("studentHome", {
      //   title: "StudentHousingFinderStudentHome",
      //   listings: listings,
      //   username: username,
      // });
      console.log("student session: ", req.session);
    }
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

/* GET ownerHome. */
router.get("/ownerHome", async function (req, res) {
  const listings = await studentHousingDB.getListings();
  console.log("got listings");
  session = req.session;
  session.userid = req.session.userid;

  const username = await studentHousingDB.getUserByUsername(session.userid);
  console.log("got user", username);
  const owner = await studentHousingDB.getOwnerByUsername(username);
  console.log("got owner", owner);
  const authorID = owner.authorID;
  // const student = await studentHousingDB.getOwnerByUsername(user);

  res.render("ownerHome", {
    title: "StudentHousingFinderOwnerHome",
    listings: listings,
    username: username,
    authorID: authorID,
  });
});

/* GET studentHome. */
router.get("/studentHome", function (req, res) {
  res.render("studentHome");
});

/* POST create listing. */
router.post("/listings/create", async function (req, res) {
  console.log("**attempting POST listings/create");

  const listing = req.body;
  // console.log("create listing", listing);
  // const username = await studentHousingDB.getUserByUsername(session.userid);
  // // console.log("got user", username);
  // const owner = await studentHousingDB.getOwnerByUsername(username);
  // // console.log("got owner", owner);
  // const authorID = owner.authorID;

  try {
    await studentHousingDB.createListing(listing);
    console.log("Listing created");
  } catch (err) {
    console.log("Listing not created: " + err);
  }

  session = req.session;
  session.userid = req.session.userid;

  res.redirect("/ownerHome");
});

/* GET listing details. */
router.get("/listings/:listingID", async function (req, res) {
  console.log("**attempting GET listing details");

  const listingID = req.params.listingID;

  console.log("Got listing details ", listingID);

  const listing = await studentHousingDB.getListingByID(listingID);

  console.log("Got isting details");

  res.render("listingDetails", { listing: listing });
});

/* GET Update listing details. */
router.get("/listings/update/:listingID", async function (req, res) {
  console.log("**attempting POST listings/update/ID");

  const listingID = req.params.listingID;
  console.log("Got listing details ", listingID);

  const listing = await studentHousingDB.getListingByID(listingID);
  console.log("Listing updated");

  session = req.session;
  session.userid = req.session.userid;

  res.render("listingEdit", { listing: listing });
});

/* POST update listing. */
router.post("/listings/update", async function (req, res) {
  console.log("**attempting POST listings/update");
  session = req.session;
  session.userid = req.session.userid;
  console.log("update listing session", session);

  const listing = req.body;
  // console.log("POST update listing", listing);
  try {
    await studentHousingDB.updateListing(listing);
    console.log("Listing updated");
  } catch (err) {
    console.log("Listing not updated: " + err);
  }

  res.redirect("/ownerHome");
});

/* POST delete listing. */
router.post("/listings/delete", async function (req, res) {
  console.log("**attempting POST delete listing");

  const listing = req.body;
  console.log("delete listing", listing);
  session = req.session;
  session.userid = req.session.userid;

  try {
    await studentHousingDB.deleteListing(listing);
    console.log("Listing deleted");
  } catch (err) {
    console.log("Listing not deleted: " + err);
  }

  res.redirect("/ownerHome");
});

/* POST send message. */
router.post("/message/send", async function (req, res) {
  console.log("Got post message/send");

  const msg = req.body;
  console.log("Got create message", msg);

  await studentHousingDB.createMessage(msg);
  console.log("Message created");

  res.redirect("/");
});

module.exports = router;
