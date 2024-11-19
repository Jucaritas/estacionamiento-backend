# NestJS Backend Application with Prisma and MySql(Mariadb)

This is a backend application built using the NestJS framework, Prisma ORM, and MySQL (MariaDB) database.

## Prerequisites

- Node.js v20.18.0 or higher
- MySQL (MariaDB) database

## Getting Started

1. Install dependencies using npm or yarn:

  ```bash
  npm install
  # or
  yarn install
  ```

2. Copy the `.env.template` file and rename it to `.env`. Update the MySQL connection details in the `.env` file:

  ``` 
  DATABASE_URL=mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>
  ```

3. Run the Prisma migrations to create the initial database tables:

  ```bash
  npx prisma migrate dev --name init
  ```

4. Start the development server:

  ```bash
  npm run start:dev
  # or
  yarn start:dev
  ```

## Key Features

- **NestJS Framework**: The application is built using the NestJS framework, which provides a robust and scalable architecture for building backend applications.
- **Prisma ORM**: Prisma is used as the ORM (Object-Relational Mapping) layer, providing a type-safe and easy-to-use API for interacting with the MySQL database.
- **MySQL Database**: The application uses a MySQL (MariaDB) database to store and retrieve data.

## API Documentation

The Swagger documentation is available at the `http://loccalhost:3000/api/docs` route.