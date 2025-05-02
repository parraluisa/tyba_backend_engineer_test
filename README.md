# Tyba Backend API Test

## Context

This project is a REST API built with **Node.js** and **Express**, offering the following features:

- User registration
- User login and logout with JWT authentication
- Search for nearby restaurants by city name or geographic coordinates (using Overpass API)
- View the historical list of transactions on the api.


## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MySQL** (via Docker)
- **Sequelize** (ORM)
- **dotenv** (for environment variables)
- **jsonwebtoken** (for authentication)
- **bcryptjs** / `crypto` (for password hashing)
- **axios** (to interact with the Overpass API)
- **Jest + Supertest** (for unit and integration testing)
- **ESLint + Prettier** (code quality and formatting)

## To deploy this project locally



### 1. Clone the repository

```bash
git clone https://github.com/parraluisa/tyba_backend_engineer_test.git
````

### 2. Install dependencies

```bash

npm install express jsonwebtoken dotenv mysql2 sequelize cors axios
npm install --save-dev nodemon eslint prettier jest supertest
```

### 3. Setup .env file

Create a .env file in the project root with the following structure:

```bash
PORT=3000
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION_TIME=3600
OVERPASS_API_URL=https://overpass-api.de/api/interpreter
```

### 4. Setup the MySQL database (using Docker)

Create a docker-compose.yml file in the root:
```bash
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: your_db_name
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:

```
Then run:

```bash
docker-compose up -d
```
### 5. Add scripts to package.json

Ensure your package.json has the following scripts:

```bash
 "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  }
```

### 6. Run the app

```bash 
npm run dev # For development
npm start # For production
```


## Project Structure

```bash 
src/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── utils/
├── middlewares/
├── database/
├── server.js
└── app.js
```

## Endpoints

/auth



## Testing

Run al test using
```bash
npm run test
```