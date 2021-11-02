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

  if (owner != undefined) {
    res.redirect("/ownerHome/?owner=" + owner.username);
  } else {
    res.redirect("/studentHome");
  }
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
  console.log("got req", req.query);
  const username = req.query.owner;

  const user = await studentHousingDB.getUserByUsername(username);
  const owner = await studentHousingDB.getOwnerByUsername(user);
  console.log("got owner", owner);

  const listings = await studentHousingDB.getListingsByAuthorID(owner.authorID);
  // console.log("got owner's listings", listings);

  res.render("ownerHome", {
    title: "StudentHousingFinderOwnerHome",
    listings: listings,
    authorID: owner.authorID,
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

/*************** Listing CRUD ****************/

/* POST create listing. */
router.post("/listings/create=:authorID", async function (req, res) {
  console.log("POST listings/create");
  const listing = req.body;
  console.log("got listing create", listing);

  const owner = await studentHousingDB.getOwnerByAuthorID(req.params.authorID);
  console.log("got owner", owner);

  await listingDB.createListing(listing);
  console.log("Listing created");

  res.redirect("/ownerHome/?owner=" + owner.username);
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

  const authorID = req.body.authorID;
  // console.log("got user", authorID);
  const owner = await studentHousingDB.getOwnerByAuthorID(authorID);
  // console.log("got owner", owner);

  try {
    await studentHousingDB.updateListing(listing);
    console.log("Listing updated");
  } catch (err) {
    console.log("Listing not updated: " + err);
  }

  res.redirect("/ownerHome/?owner=" + owner.username);
});

/* POST delete listing. */
router.post("/listings/delete", async function (req, res) {
  console.log("POST delete listing");

  const listing = req.body.listingID;
  console.log("got listing delete", listing);

  const authorID = req.body.authorID;
  // console.log("got user", authorID);
  const owner = await studentHousingDB.getOwnerByAuthorID(authorID);
  // console.log("got owner", owner);

  try {
    await studentHousingDB.deleteListing(listing);
    console.log("Listing deleted");
  } catch (err) {
    console.log("Listing not deleted: " + err);
  }

  res.redirect("/ownerHome/?owner=" + owner.username);
});

/*************** Message CRUD ****************/

/* POST send message. */
router.post("/message/create", async function (req, res) {
  console.log("Got post message/send");

  // const listing = req.body;

  res.redirect("/studentHome");
});

/* POST send message. */
router.post("/message/send", async function (req, res) {
  console.log("Got post message/send");

  // const listing = req.body;

  res.redirect("/studentHome");
});

module.exports = router;
