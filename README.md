# Animal Shelter Management System

This project is a full-stack web application for managing an animal shelter. It provides a REST API built with Django REST Framework and a web client built with React and TypeScript using the Mantine UI framework.

This is the [SonarCloud](https://sonarcloud.io/project/overview?id=LucasDavid1_fullstack-technical-test) link for the project.
This is the [Pull request](https://github.com/LucasDavid1/fullstack-technical-test/pull/1) from myself to fix a bug.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Animal Management:**
    - List, create, update, and delete animal records.
    - Track animal details: name, age, breed, type (dog or cat), and status (adopted, for adoption, waiting).
- **Volunteer Management:**
    - List, create, update, and delete volunteer accounts.
    - Manage volunteer details: username, email, password, and status (active, inactive).
- **Adopter Management:**
    - List, create, update, and delete adopter accounts.
    - Manage adopter details: username, email, password, and status (active, inactive).
- **Adoption Management:**
    - Adopter users can apply for adoptions.
    - Volunteer users can review and process adoption applications (accept or reject).
    - Track adoption details: animal, adopter, volunteer, adoption date, and status (completed, in process, rejected).
- **User Roles:**
    - Administrator (superuser): Full access to all features (managed through Django admin).
    - Volunteer: Can view animals, adopters, and adoptions; process adoption applications; update animal statuses.
    - Adopter: Can view available animals, apply for adoptions, and view their adoption history.
- **Authentication:**
    - Secure authentication using JSON Web Tokens (JWT) with Django REST Framework Simple JWT.

## Project Structure

![image](https://github.com/user-attachments/assets/2802dcdb-46ae-4062-8f2b-b8c34753a275)

## Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/LucasDavid1/fullstack-technical-test
```
   
## Set Up the Backend (Django)
This will install requirements.txt and everything needed, including the Database
```bash
make up
```

## Migrations
```bash
make migrate
```

## Admin user
```bash
make createsuperuser
```

# Frontend
```bash
cd animal-shelter-frontend
npm install
npm start
```
## Usage
- Go to `localhost:3000` and login with your admin user.
- You also can register as an `adopter` or a `volunteer`.


## TODOs
- **Code Structure and Organization:**
  - Separate Animal Models and Services (create `animals` app, move related code).
  - Separate `src/api.ts` in more files by topic, like users, animals, etc.
  - Change admin management view (`AdminPage.tsx`) so it uses only one endpoint to retrieve all users and then filter them by role and others fields.
  - Improve user login, like with JWT tokens with silent refresh by storing the access token in memory and the refresh token in httpOnly cookies.

- **Testing:**
  - Unit Tests.
  - Integration Tests (component interactions).
  - Frontend Testing.

- **Frontend Design and User Experience:**
  - Enhanced UI (footer, custom header, background).
  - Loading States (spinners, progress bars).
  - Error Handling and Messages (user-friendly feedback).
  - Responsive Design (adapt to various screen sizes).

- **Additional Features:**
  - Animal Details Page (detailed info about animals).
  - Search and Filtering (search by breed, type, status).
  - User Profiles (manage information, view activity).
  - Email Notifications (adoption updates, new animals).
