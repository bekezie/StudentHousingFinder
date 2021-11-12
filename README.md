//Loved how you you created to seperate users and I really like that student could send a message a renter actuslly receives that message! 

# StudentHousingFinder

![Logo](screenshots/SH.png)

## Original Project Proposal:

An application that lets users explore a list of student housing.

It will support:

- CRUD dorm/apartment listings
- Sort alphabetically and filter by location/building, cost, or by user input \*
- Owner/renter (user) sign-up/login
- CRUD user information
- Users can rate dorm/apartment listings
- Monthly/annual statistics for owners/renters\*
- Favorites for users\*
- \*We were not able to finish implementing these items in full.

## Installation and Execution

1. Clone the repository
2. In terminal: `npm install`
3. In terminal: `npm start`
4. In browser, go to http://localhost:3000

> _Register and Sign In Note:
> Because owners and students have different permissions for listings, page will look different depending on whether you sign up as an owner or a student._

## Authors:

Bernard Ekezie (https://github.com/bekezie) & Ely (Esther) Lam (https://github.com/ely-lam)

@Ely Lam implemented:

- Registering the owners and updating their listings as they post new housing listings.
- CRUD operations on the listings.
- Making sure owners have permissions to CRUD listings, but students can only view them.
- CRUD operations on the messages between users and ensuring each message has one distinct sender and one distinct receiver.
- Making sure users can only delete messages they sent.
- Create warning if users try to register with non-unique username.

@Bernard Ekezie implemented:

- Registering the students and updating their ratings per listing.
- CRUD operations on the students and schools
- CRUD operations on the ratings
- CRUD operations on the user and ensuring users have a unique username.

# Project 1 (Part 1: Design):

Link to Business Requirements: https://docs.google.com/document/d/1HfzjBWUDes1UxDi9yob0D4R6YMiWGgLErjpFZMa3-3s/edit
Link to Relational Schema with Functional Dependencies: https://docs.google.com/document/d/1NBktMtUlr1iGigkE8cz2e_R3NzSCWksHU_thtI5k96I/edit

UML Diagram
![Logo](screenshots/Project1_UML.png)

ER Diagram
![Logo](screenshots/Project1_ERD.png)
