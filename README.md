# RESTful Lender-Borrower Web Application
A NodeJS application for a borrower-lender scenario.

### Functionalities:
* Creation (SignUp) of a new Borrower User [Name, email, password]
  * The system can have any number of borrower users
  * Every borrower has an initial credit limit of Rs 1,00,000 (set automatically on sign up)
* Creation (SignUp) of a new Lender User [Name, email, password]
  * There is only one lender user in the system 
#### APIs for Borrower
* POST : To create a new credit request,
* GET  : To get a list of all credit cequests

#### APIs for Lender
* PUT : To mark a specific credit request as completed,
* GET : To get all credit requests in the system,
* GET : To get List of All Borrowers.

## To run the applcation,inside the project folder run the commands :
```
node server
```

### For running the Mongo Server,go to path---C:/MongoDB/Server/3.4/bin/--- and run the command :
```
mongod
```

and then  navigate to POSTMAN to check the API's.

