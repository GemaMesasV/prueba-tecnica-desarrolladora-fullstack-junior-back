## Technical test for the selection process: Junior fullstack developer Card-Dynamics

**Back-End Technical test**

Create a social banking app. Where you can make transactions with people you are connected with.

**To do:**

● Create a route to create users:
i. Users will provide their first name, last name, age and bank balance.
ii. Create a user in the database with this information and generate a 10 digit random account number.

● Users should only be able to make transactions and/or add connections after being logged in.
● Users should be able to send and approve connection requests.
● Except the create user and login route, all other routes should use authentication; you can use bearer tokens for this, which would be valid for 15 mins maximum.
● Users should have the ability to add connections using someone's bank account number.

● Users should be able to see the name, age and bank account number of all their connections in a list.
● Users can remove a connection from their account.
● Users can send and receive money to accounts which they are connected with. Each transaction should be stored in the database.
● Users should be able to see their past transactions.
● Make sure you handle all the edge cases and error scenarios for example:-
i. What should happen when the user has zero balance and he tries to send money.
ii. User tries to send an amount of money which is greater than their bank balance.
iii. User tries to send money to someone who no longer has them as their connection.

**Note:**

Users should only be able to send money when both users are each other's connection, for example User A should have B as their connection and User B should have User A as their connection. One sided connection won't work.

**Things to keep in mind:**

● Use node and express for APIs.
● Use mongodb atlas as your database and mongoose as your ORM.
● Use Postman to test your routes. We would use the same.
● All API responses should be in JSON format.
● Please lint and format your code.
● You have full autonomy on creating the routes structure and design the database schema, we want to see what you can come up with on your own.
● This test is used to test your Node, Express as well as MongoDB knowledge, so optimize your queries.

● Code should be properly documented and easier to understand.
● You can create a database in mongodb atlas, which is a free service and use
environment variables to store secrets.
● Please add your code on github and make commits so we can review the code.
● Commit your code in the repo with the .env file.
● Make sure when you share the repo with us the database is not completely empty, it should have at least 5 users and 20 transactions so we don't have to start from scratch to verify things.
● Do not spend more than one day on this test, it's fine to not finish it. A few questions are going to come after the code review and that's the important part.


**Boilerplate project**

https://github.com/maitraysuthar/rest-api-nodejs-mongodb

**How to run**

● Clone or download this repository
● Open a terminal in the root folder of the repository
● Install the local dependencies by running in the terminal the command:
-npm install

●Start the project with the command:
-npm run dev