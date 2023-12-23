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

Set up environment variables:

Create a .env file in the root directory with the following content:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

Replace your_mongodb_connection_string with the actual connection string for your MongoDB database.

Run the application:

```
npm start
The application will be running at http://localhost:3000.
```

Explore API Documentation:

Visit **http://localhost:3000/api-docs** to explore the Swagger documentation for the API.

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
