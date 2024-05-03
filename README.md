# Book Now

### Description

---

Book now is a service that connects clients with providers of in-home health services. Both clients and providers can create an account, and clients can book appointments with providers based on the services offered, the date and time, and the availabilities of the providers.

### Usage

---

#### Installing Dependencies

Install all dependencies by running `npm i` in the terminal.

#### Starting the Server and Connecting to Database

To connect to the database, replace the `connectionString` in `server.js` with the connection string from the MongoDB database. Then, start the server by running `node server.js` or `nodemon server.js` from the terminal. 

Different requests for clients, providers, availabilities, services, and bookings are handled respectively at the following routes: 

```
/api/clients
/api/providers
/api/availabilities
/api/services
/api/bookings
```

### Technologies Used

---

* Node.js and express are used to handle the requests and routes.
* MongoDB and mongoose are used to store the data in the database.