# YARP - Back end

## Setup Instructions

For comprehensive setup guidance, please refer to the detailed instructions provided in the main `README.md` file.

## Configuration

### Error in PostgreSQL
While in the development environment, you may encounter PostgreSQL-related errors in the `src/postgres/clean` and `src/postgres/web_api/*.rs` files. These errors are likely due to one of the following reasons:

1. PostgreSQL is not installed on your system.
2. The database is not set up or not running.
3. The required tables are not created or are invalid.

The backend uses the `sqlx` crate, which performs compile-time checking of database queries. This means that during compilation, `sqlx` attempts to connect to the database and verify the correctness of SQL queries against the actual database schema. If PostgreSQL is not installed, not running, or the database schema doesn't match the expected structure, the compilation will fail.

To resolve these issues:

1. Ensure PostgreSQL is installed on your system.
2. Set up the database and start the PostgreSQL service.
3. Create the necessary tables and ensure they match the expected schema.
4. Verify that the database connection details in your `.env` file are correct.

By addressing these points, you should be able to resolve the PostgreSQL-related errors and successfully compile the project.

### Database Setup
1. For each game account section, you may need to create new database tables.
2. Ensure all necessary tables are properly configured and indexed for optimal performance.

### Environment Configuration
1. Rename the `.env.example` file to `.env`.
2. Open the `.env` file and configure all variables with appropriate values for your environment.
3. Double-check that sensitive information is properly secured and not exposed.

### Server Configuration
1. Verify that the correct IP address for your backend server is used in all relevant configuration files.
2. This step is crucial for establishing proper communication between the front-end and back-end components of YARP.

Remember to thoroughly test your configuration before deploying to a production environment.
