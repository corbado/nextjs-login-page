<img width="1070" alt="GitHub Repo Cover" src="https://github.com/corbado/corbado-php/assets/18458907/aa4f9df6-980b-4b24-bb2f-d71c0f480971">

# Next.js Login Page and Authentication

This repository contains various authentication methods for a Next.js login page with TypeScript. It demonstrates how to integrate different authentication methods such as password-based login, OTP (one-time passcode) via email and SMS, Google OAuth, and TOTP (time-based one-time passcode) via authenticator app.

## Table of Contents
- [Important Directories and Files](#important-directories-and-files)
  - [src/app/](#srcapp)
  - [src/components/](#srccomponents)
  - [src/lib/](#srclib)
  - [src/models/](#srcmodels)
  - [src/pages/api/auth/](#srcpagesapiauth)
  - [Configuration Files](#configuration-files)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Setting Up MongoDB](#setting-up-mongodb)
  - [Configure Environment Variables](#configure-environment-variables)
- [Usage](#usage)
  - [Run the project locally](#run-the-project-locally)
- [Authentication Methods](#authentication-methods)
  - [Password-Based Authentication](#password-based-authentication)
  - [OTP (One-Time Password)](#otp-one-time-password)
  - [Google OAuth](#google-oauth)
  - [TOTP (Time-based One-Time Password)](#totp-time-based-one-time-password)
- [Conclusion](#conclusion)

## Important Directories and Files

### `src/app/`
This directory contains the main application pages and their components.

- `googleLogin/page.tsx`: The main page for Google OAuth login.
- `otp/page.tsx`: The main page for OTP (One-Time Password) authentication.
- `password/login/page.tsx`: The login page for password-based authentication.
- `password/signup/page.tsx`: The signup page for password-based authentication.
- `totp/page.tsx`: The main page for TOTP (Time-based One-Time Password) authentication.

### `src/components/`
Contains reusable React components used across different authentication methods.

### `src/lib/`
Contains utility functions and configurations.

- `mongodb.ts`: Sets up the MongoDB connection.

### `src/models/`
Contains Mongoose models for MongoDB collections.

- `Otp.ts`: Defines the schema for storing OTPs.
- `Totp.ts`: Defines the schema for storing TOTP-related data.
- `User.ts`: Defines the schema for storing user data for password-based authentication.

### `src/pages/api/auth/`
Contains API route handlers for authentication.

- `otp/generate.ts`: API route to generate and send OTP.
- `otp/verify.ts`: API route to verify the OTP.
- `password/login.ts`: API route to handle user login.
- `password/register.ts`: API route to handle user registration.
- `totp/generate.ts`: API route to generate TOTP secrets and QR codes.
- `totp/status.ts`: API route to check TOTP status.
- `totp/verify.ts`: API route to verify TOTP.
- `[...nextauth].ts`: Configuration for NextAuth.js to handle Google OAuth.

### Configuration Files
- `.env.local`: Environment variables for local development.

## Setup

### Prerequisites

Before running this project, ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- MongoDB

### Setting Up MongoDB

#### Install MongoDB

1. **Download MongoDB:**
   - Go to the [MongoDB Download Center](https://www.mongodb.com/try/download/community) and download the Community Server version suitable for your operating system.

2. **Install MongoDB:**
   - Follow the installation instructions for your operating system:
     - **Windows:** Run the downloaded `.msi` file and follow the setup wizard.
     - **macOS:** Run the downloaded `.tgz` file and follow the installation steps using Homebrew:
       ```sh
       brew tap mongodb/brew
       brew install mongodb-community@4.4
       ```
     - **Linux:** Follow the specific instructions for your distribution from the [MongoDB installation documentation](https://docs.mongodb.com/manual/administration/install-on-linux/).

#### Start MongoDB

1. **Start the MongoDB server:**
   - **Windows:** Run `mongod` from the Command Prompt.
   - **macOS:** Use Homebrew to start the MongoDB service:
     ```sh
     brew services start mongodb/brew/mongodb-community
     ```
   - **Linux:** Run `mongod` from the terminal.

2. **Verify MongoDB is running:**
   - Open another terminal window and run:
     ```sh
     mongo
     ```
   - This command starts the MongoDB shell and connects to the running MongoDB instance. You should see the MongoDB shell prompt if the server is running correctly.

### Configure Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```plaintext
MONGODB_URI=your_database_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Usage

### Run the project locally
1. Clone the repository
   ```sh
   git clone https://github.com/corbado/nextjs-login-page.git
   cd nextjs-auth-methods
   
2. Install all the dependencies
   ```sh
   npm install

3. Run the project locally
   ```sh
   npm run dev

## Authentication Methods

### Password-Based Authentication
This method allows users to register and log in using an email and password.

- Signup Page: `src/app/password/signup/page.tsx`
- Login Page: `src/app/password/login/page.tsx`
- API Routes:
  - Register: `src/pages/api/auth/password/register.ts`
  - Login: `src/pages/api/auth/password/login.ts`
- Database Model: `src/models/User.ts`

### OTP (One-Time Passcode)
This method uses a one-time password sent to the user's email or phone for authentication.

- OTP Page: `src/app/otp/page.tsx`
- API Routes:
  - Generate OTP: `src/pages/api/auth/otp/generate.ts`
  - Verify OTP: `src/pages/api/auth/otp/verify.ts`
- Database Model: `src/models/Otp.ts`

### Google Social Login (OAuth)
This method allows users to log in using their Google account.

- Google Login Page: `src/app/googleLogin/page.tsx`
- NextAuth.js Configuration: `src/pages/api/auth/[...nextauth].ts`

### TOTP (Time-based One-Time Passcode) via Authenticator App
This method uses TOTP for user authentication.

- TOTP Page: `src/app/totp/page.tsx`
- API Routes:
  - Generate TOTP: `src/pages/api/auth/totp/generate.ts`
  - Verify TOTP: `src/pages/api/auth/totp/verify.ts`
  - Check TOTP Status: `src/pages/api/auth/totp/status.ts`
- Database Model: `src/models/Totp.ts`
