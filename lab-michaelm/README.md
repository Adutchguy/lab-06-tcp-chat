# Lab 6

** So I spent way more time on this that I expected. This project entailed creating a chat server. Users will connect to the server, be assigned a unique ID, and can invoke several ' \ ' commands to achieve various results. **

## Setting Up the Project:
1. Fork the Repo.
2. Clone the forked Repo.
3. From the root of the Repo, run the following command: "npm install".

## Starting the Server:
** From the directory conatining your package.json and index.js file, enter the following command: "npm run server". **

## Wack Commands:
* /nick
 * Takes in one argument, the desired username, and changes the users name for the remainder of the session.
 * Example: "/nick mike"

* /dm
 * Takes in two arguments, another connected user's name, and the message. It sends the specified user a direct message.
 * Example: "/dm jeff hey jeff"

* /troll
 * Takes in two arguments, the number of messages to spam, and the message to spam. It then spams all other users with the specified text for the specified number.
 * Example: ""/troll 8 lololol"
 
* /quit
 * Takes in no arguments and ends the user's session.
