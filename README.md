Wardrobe Suggestion Project
A personal wardrobe assistant to store your shirts and pants, mark favorites, and get outfit suggestions by dress type or current weather. Includes authentication and password reset, image uploads to Cloudinary, and occasion galleries.

Features

Wardrobe

Add shirts and pants with images, title, dressType (summer/winter)

View your collection and edit or delete items

Mark/unmark favorites and view all favorites

Suggestions

Random outfit pairing by dressType

Weather-based suggestion using OpenWeatherMap (city input)

Occasions

Browse collections for occasions (Interview, Birthday Party, Casual, College Party, etc.)

Auth and Security

Sign up, login, logout (Passport local)

Password reset via email token (Nodemailer)

Session-based flash messages

Tech Stack

Backend: Node.js, Express

Views: EJS with ejs-mate layouts

Database: MongoDB, Mongoose

Auth: Passport, passport-local-mongoose

Sessions/Flash: express-session, connect-flash

Uploads: Multer, Cloudinary (multer-storage-cloudinary)

Email: Nodemailer (Gmail transport)

Weather API: OpenWeatherMap

Getting Started

Prerequisites

Node.js (LTS recommended)

MongoDB (local or Atlas)

Cloudinary account

OpenWeatherMap API key

Gmail (or other SMTP) account for password reset emails

Installation

Clone and install

git clone <repo_url>

cd Wardrobe-Suggestion-Project

npm install

Environment variables
Create .env in the project root with:

CLOUD_NAME=your_cloudinary_cloud_name

CLOUD__API_KEY=your_cloudinary_api_key Note: code uses double underscore after CLOUD

CLOUD_API_SECRET=your_cloudinary_api_secret

OWM_API_KEY=your_openweather_api_key If you update middleware to read from env

SMTP_USER=your_email_address e.g., Gmail

SMTP_PASS=your_app_password Gmail app password
Optional:

SESSION_SECRET=wardrobe_team_work Used inline in code currently

MONGODB_URI=mongodb://127.0.0.1:27017/wardrobeDB Update app.js to read this

Run MongoDB

Local: ensure mongod is running

Atlas: set MONGODB_URI and update app.js accordingly

Start the server

node app.js

App runs at http://localhost:3000

Core Routes

Public

GET / — Home

GET /about — About

Auth

GET /signup — Sign up form

POST /signup — Create account and auto-login

GET /login — Login form

POST /login — Login

GET /logout — Logout

GET /forgot-password — Request password reset

POST /forgot-password — Sends reset link via email

GET /reset-password/:token — Reset form

POST /reset-password/:token — Submit new password

Wardrobe (authenticated)

GET /collection — View your shirts and pants

GET /newcollection — Add item selection page

Shirts:

GET /shirts — View your shirts

GET /addshirt — Form to add a shirt

POST /shirts — Create shirt (file field: shirt[image])

GET /shirts/:id/edit — Edit form

PUT /shirt/:id — Update shirt (optional new image)

DELETE /shirt/:id — Delete shirt

Pants:

GET /pants — View your pants

GET /addpant — Form to add a pant

POST /pants — Create pant (file field: pant[image])

GET /pants/:id/edit — Edit form

PUT /pant/:id — Update pant (optional new image)

DELETE /pant/:id — Delete pant

Favorites:

POST /:id/favorite — Toggle favorite for a shirt or pant by id

GET /favorite — View favorite items

Suggestions

GET /wearThis?dressType=summer|winter — Random pair from your wardrobe (auth required)

GET /weatherInfo — Weather page (auth)

POST /weatherInfo — Submit city, get weather-based suggestion

Occasions

GET /occasion — List all occasions

GET /occasions/:id — Show collection for one occasion

GET /addocas — Upload form for occasion image

POST /ocas — Add image to a specific occasion collection (currently collegeParty model)

Data Models

Shirt

title: String

dressType: String ("summer" | "winter")

image: { url, filename }

favorite: Boolean (default false)

owner: ObjectId → User

Pant

title: String

dressType: String ("summer" | "winter")

image: { url, filename }

favorite: Boolean (default false)

owner: ObjectId → User

Occasion

title: String

occTitle: String

image: { url: String }

theme: [{ name: String, photos: [ObjectId → Photos] }]

Photos

image: String

Occasion Collections (separate models)

Interview, BirthdayParty, casual, collegeParty

image: { url, filename }

Authentication

Passport local strategy with passport-local-mongoose User model

Sessions via express-session

Flash messages via connect-flash

res.locals.currUser, success, error set in app middleware

File Uploads

Cloudinary configured via cloudConfig.js

Multer storage uses folder: wardrobe_DEVELOPMENT

Allowed formats: png, jpg, jpeg

Expected form fields:

shirt[image] for shirts

pant[image] for pants

Security and Environment

Do not commit .env with secrets

Use Gmail App Passwords (not your account password) if using Gmail transport

Prefer reading API keys from process.env rather than hardcoding

Project Structure

app.js — App setup, DB connect, auth, sessions, routes

cloudConfig.js — Cloudinary + Multer storage

middleware.js — weatherInfo (not used in routes), isAuthenticated

routes/mainRoutes.js — All feature routes

models/

shirt.js, pant.js, occasion.js, photos.js

occasions/ (interview.js, BirthdayParty.js, casual.js, collegeParty.js)

user.js — Must define User with passport-local-mongoose

views/ — EJS templates (referenced paths like users/login.ejs, addshirt.ejs, weather.ejs, etc.)

public/ — Static assets

utils/wrapAsync.js — Async error wrapper

uploads/ — If using disk storage (currently using Cloudinary storage)
