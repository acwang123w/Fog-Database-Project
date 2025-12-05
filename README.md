This is the application setup for our 412 semester project.
For this project, we have decided to create a game library application, which stores and manipulates game and user information using a PostgreSQL database.
It contains a login page, a register page, an admin view page, and a user view page.

For the database design, our database we designed and used for phases 1 and 2 of the project worked nearly flawlessly. There were only 1-2 minor adjustments to the structural constraints.

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
