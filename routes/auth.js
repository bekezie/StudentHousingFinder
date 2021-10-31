let express = require("express");
let router = express.Router();
let studenthousingDB = require("../db/mySQLiteDB.js");

router.post("/registerUser", async (req, res) => {
  // this route will handle registering a user to the database

  //we will first check if the username already exists
  // let duplicateUsername = await studenthousingDB.getUserByUsername(
  //   req.body.username
  // );
  // if (duplicateUsername) {
  //   res.send({ registered: false });
  // } else {
  let newUserObj = {
    username: req.body.username,
    password: req.body.password,
  };
  console.log(newUserObj);
  const registered = await studenthousingDB.saveNewUser(newUserObj);
  // if the register was successful, we send a true resposne
  // if (registered === 1) {
  //   res.send({ registered: true });
  // } else {
  //   // send a false response to the frontend if something went wrong with the registration
  //   res.send({ registered: false });
  // }
  //}
});

module.exports = router;
