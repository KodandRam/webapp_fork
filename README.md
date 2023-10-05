# Web Application

This web application is designed to [briefly describe the purpose of your web application].

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: You need to have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

- **Database Setup**: The application uses PostgreSQL as the database. Make sure you have PostgreSQL installed and configured with the necessary tables. Update the database configuration in the `config/database.js` file.

- **CSV Data**: Prepare a CSV file with user account information and save it to `/opt/user.csv`.

## Installation

To install the necessary dependencies, follow these steps:

Clone this repository:

   ```bash
   git clone https://github.com/your-username/webapp.git
   cd webapp

Install Node.js dependencies:
bash
Copy code
npm install

Configure Environment Variables:
Create a .env file in the root directory of the project and set any required environment variables, such as database credentials.

Authentication

The web application uses Token-Based authentication. You must provide a valid authentication token when making API calls to authenticated endpoints. The authentication.js file contains the authentication middleware.

API Endpoints

The web application provides the following API endpoints:

/api/healthz (GET): Health check endpoint to verify the applications status.
/api/v1/assignments (POST): Create a new assignment.
/api/v1/assignments (GET): Get a list of all assignments.
/api/v1/assignments/:id (GET): Get assignment details by ID.
/api/v1/assignments/:id (PUT): Update an assignment (only the creator can update).
/api/v1/assignments/:id (DELETE): Delete an assignment (only the creator can delete).

Assignment Creation
To create a new assignment, make a POST request to /api/v1/assignments with a JSON payload. Ensure that the assignment points are between 1 and 10.

Assignment Update
To update an assignment, make a PUT request to /api/v1/assignments/:id with a JSON payload. Only the user who created the assignment can update it.

Assignment Deletion
To delete an assignment, make a DELETE request to /api/v1/assignments/:id. Only the user who created the assignment can delete it.

Assignment Listing
To get a list of all assignments, make a GET request to /api/v1/assignments. The response will contain a list of assignment objects.

Assignment Details
To get assignment details by ID, make a GET request to /api/v1/assignments/:id. The response will contain the assignment details.

