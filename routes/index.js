let express = require("express");
let router = express.Router();
let studentHousingDB = require("../db/mySQLiteDB.js");

const listingDB = require("../db/mySqliteDB.js");

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Got request for /");

  const listings = await studentHousingDB.getListings();
  console.log("got listings");
  res.render("index", {
    title: "StudentHousingFinderHome",
    listings: listings,
  });
});

// After user logs in, render page depending on owner/student status
router.post("/user", async function (req, res) {
  console.log("**attempting POST /user");
  const user = await studentHousingDB.getUserByUsername(req.body.username);
  const owner = await studentHousingDB.getOwnerByUsername(user);
  if (owner != undefined) res.redirect("/ownerHome");
  else res.redirect("/studentHome");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.get("/owner", function (req, res) {
  res.render("ownerRegister");
});
router.get("/student", function (req, res) {
  res.render("studentRegister");
});

/* GET ownerHome. */
router.get("/ownerHome", async function (req, res) {
  const listings = await studentHousingDB.getListings();
  console.log("got listings");
  res.render("ownerHome", {
    title: "StudentHousingFinderOwnerHome",
    listings: listings,
  });
});

/* GET studentHome. */
router.get("/studentHome", async function (req, res) {
  const listings = await studentHousingDB.getListings();
  console.log("got listings");
  res.render("studentHome", {
    title: "StudentHousingFinderStudentHome",
    listings: listings,
  });
});

/* POST create listing. */
router.post("/listings/create", async function (req, res) {
  console.log("POST listings/create");
  const listing = req.body;

  await listingDB.createListing(listing);
  console.log("Listing created");

  res.redirect("/ownerHome");
});

/* POST send message. */
router.post("/message/send", async function (req, res) {
  console.log("Got post message/send");

  const msg = req.body;
  console.log("Got create message", msg);

  await listingDB.createMessage(msg);
  console.log("Message created");

  res.redirect("/");
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

  res.redirect("/ownerHome");
});

/* GET listing details. */
router.get("/listings/:listingID", async function (req, res) {
  console.log("Got listing details");

  const listingID = req.params.listingID;

  console.log("Got listing details ", listingID);

  const listing = await listingDB.getListingByID(listingID);
  console.log("get listing details page");

  res.render("listingDetails", { listing: listing });
});

/* Update listing details page. */
router.get("/listings/update/:listingID", async function (req, res) {
  console.log("Got listing details");

  const listingID = req.params.listingID;
  console.log("Got listing details edit page", listingID);

  const listing = await listingDB.getListingByID(listingID);

  res.render("listingEdit", { listing: listing });
});

/* POST update listing. */
router.post("/listings/update", async function (req, res) {
  console.log("**attempting POST listings/update");

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
  console.log("POST delete listing");

  const listing = req.body;

  console.log("delete listing", listing);
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

  const listing = req.body;

  await listingDB.deleteListing(listing);
  console.log("Listing deleted");

  res.redirect("/studentHome");
});

module.exports = router;
