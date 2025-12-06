# README.md
## Overview
This is the application setup for our 412 semester project.
For this project, we have decided to create a Steam-inspired game library application, which stores and manipulates game and user information using a PostgreSQL database.
It contains a login page, a register page, an admin view page, and a user view page.

For the database design, our database we designed and used for phases 1 and 2 of the project worked nearly flawlessly. There were only 1-2 minor adjustments to the structural constraints.

### Login Page and User View
The login page checks user accounts to see if they exist in the database. Once logged in, the user is presented with their library page, consisting of all the games they have purchased. From here, 
they can click on the games to view the game details. User info is additionally stored client side using cookies, so if the page is refreshed, it will keep the user logged in instead of bringing them
back to the login screen.

The next tab is the store page, which includes a search bar that performs a search query operation on the database. Clicking on the games also
brings the user to view the game details. From the game details page, users can purchase the game, see reviews, and leave reviews. 

The next tab is the Friends tab. From this tab, you can see your unique friend code and add other users by inputting their friend code. Pending and Incoming friend requests have their own sections,
and users can cancel outgoing friend requests and reject incoming friend requests. Friends are able to see status messages of other friends, and view Achievements for games that their friend has earned.

This brings us to the Achievements page. This page shows all possible achievements for games in the user's store library (games that the user owns). This makes it easy to check and track game achievements.

After this tab is the Awards tab. Here, you can see games that have won awards. Clicking these games will bring up their respective game store page. 

The next tab is the profile tab. From here, users can view their account info and update their status. Additionally, users can change their passwords from this page. For this demo, we have a simple button 
to add funds to the user's balance. The user's balance is displayed here in addition to the right part of the navbar.

The rightmost and final element of the navbar is the logout button. This button logs the user out.

### Register Page
Users are able to create accounts through this Register page. Users are asked to input their username, email, Country/Region, and password twice for confirmation. After registering, an account for the 
user is created in the database. Each user has a unique ID within the database, as well as a unique friendcode through which they can use to add other users.

### Admin Page
The primary use of this page is to provide functionality for viewing user info (in case if demo account information is lost/forgotten), making achievements for games, and granting achievements to
players (this is currently the only way for users to "earn" achievements). The two main tabs list all users and all games within the database. Clicking on a an account will bring up all relevant 
information for that account. The library tab allows deletion of games from a user's account (to make testing easier), as well as granting achievements from each game to the user.

The games tab lists all games, and opening up a game will allow the admin to create and remove achievements for each game.

### Running the project
1. Ensure navigate into the directories for server and client and run npm install in each
2. Create local PostGreSQL database by running:
   ```bash
   createdb fog_db
4. (Optional) You can verify the db existence by running:
   ```bash
   psql -d fog_db
6. Modify the .env file to include the following content
   ```bash
   PGHOST=localhost
   PGPORT=YOUR_PORT
   PGDATABASE=fog_db
   PGUSER=YOUR_USER_HERE
   PGPASSWORD=YOUR_PASSWORD
   PORT=5174
   ```
8. You can initialize the database by running the following commands:
   ```bash
   cd server/sql
   psql -h localhost -p YOUR_PORT -U YOUR_USER_HERE -d fog_db -f 001_schema.sql
   psql -h localhost -p YOUR_PORT -U YOUR_USER_HERE -d fog_db -f 002_seed.sql
   psql -h localhost -p YOUR_PORT -U YOUR_USER_HERE -d fog_db -f 003_extra_seed.sql
   ```
10. Now run the frontend and backend:

    Navigate to the server folder and run:

    ```bash
    npm run dev
    ```

    Navigate to the client folder and run:

    ```bash
    npm run dev
    ```

12. Now, you can access the application through here!
    
    [http://localhost:5173/](http://localhost:5173/)
   
### Ending
Thank you to Professor Zhou and TA's!
