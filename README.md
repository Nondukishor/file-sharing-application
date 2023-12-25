# File Sharing Application

**_ This is a simple file-sharing application built with Node.js and Express. Users can upload files, generate keys, download files, and delete files based on their keys _**

## Features

**File Upload:** Users can upload files with validation and key generation.
**File Download:** Users can download files using the public key.
**File Deletion:** Users can delete files using the private key.
**Swagger Documentation:** API endpoints are documented using Swagger.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine.
- MongoDB database for storing file information.
  Getting Started
  To get started with the File Sharing Application, follow these steps:

Clone the repository:

```
git clone https://github.com/Nondukishor/file-sharing-application.git
cd file-sharing-application
```

### Install dependencies:

```
npm install
```

### Set up environment variables:

Create a .env file in the root directory with the following content you can aslo copy .env.example file

```
PORT=3000
FOLDER="uploads"

DAILY_DOWNLOAD_LIMIT=1000
DAILY_UPLOAD_LIMIT=1000

# *    *    *    *    *    *
# ┬    ┬    ┬    ┬    ┬    ┬
# │    │    │    │    │    │
# │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
# │    │    │    │    └───── month (1 - 12)
# │    │    │    └────────── day of month (1 - 31)
# │    │    └─────────────── hour (0 - 23)
# │    └──────────────────── minute (0 - 59)
# └───────────────────────── second (0 - 59, OPTIONAL)
CLEANUP_INTERVAL='0 0 * * *'
KEY_ALGORITHM=rsa
DATABASE_URL=mongodb+srv://pronipu:RpTy6DnRt0ysP00e@cluster1.pxc7w40.mongodb.net/filesharing_db?retryWrites=true&w=majority
```

Replace your_mongodb_connection_string with the actual connection string for your MongoDB database.

### Run the application:

```
npm start
{"level":"info","message":"Server is running on http://localhost:3000"}
{"level":"info","message":"Api docs avilable at http://localhost:3000/docs"}
Database Connected
```

### To run test and see test coverage

```
npm run test
npm run coverage
```

Explore API Documentation:

Visit **http://localhost:3000/api-docs** to explore the Swagger documentation for the API.
![alt text](/api-doc.png)

## API Endpoints

- Health Check:

GET /: Health check endpoint.

- File Upload:

POST /files: Upload a file with validation and key generation.

- File Download:

GET /files/{publicKey}: Download a file using the public key.

- File Deletion:

DELETE /files/{privateKey}: Delete a file using the private key.
Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request.

#### License

No Licence
