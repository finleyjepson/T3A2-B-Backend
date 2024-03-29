# T3A2-B-Backend

## API Documentation

### GET /

- Returns the API documentation in HTML format

## Events

### GET /events

- Returns a list of events based on the query parameters in the link
- Query parameters:
  - title: String, optional
  - category: ObjectId, optional
  - month: Number, optional
  - year: Number, optional

Example:
```
/events?title=Event%20Title&category=5f8a5e3e3f3e3e3e3e3e3e3e
/events?month=10&year=2020
/events?category=5f8a5e3e3f3e3e3e3e3e3e3e&month=10&year=2020
```

### GET /events/all

- Returns a list of all events in JSON format

### GET /events/:id

- Returns a single event in JSON format

### POST /events

#### **This is a protected route, a valid JWT is required in the Bearer header**

User must be an organiser or administrator to create an event

- Creates a new event
- Requires a JSON body with the following fields:
  - title: String, required
  - description: String, required
  - venue: String, optional
  - category: ObjectId, required
  - date: Date, required
  - anime: String, optional
  - organiser: String, required
  - price: Number, optional

Example:
```json
{
  "title": "Event Title",
  "description": "Event Description",
  "category": "5f8a5e3e3f3e3e3e3e3e3e3e",
  "date": "YYYY-MM-DD",
  "anime": "Anime Title",
  "organiser": "Madman Entertainment",
  "price": 20
}
```

### PUT /events/:id

#### **This is a protected route, a valid JWT is required in the Bearer header**

User must be an organiser or administrator to update an event
- For organisers, only events they have created can be updated or deleted

- Updates an event

- Requires a JSON body with the following optional fields:
  - title: String
  - description: String
  - venue: String
  - category: ObjectId
  - date: Date
  - anime: String
  - organiser: String
  - price: Number

Example:
```json
{
  "title": "New Event Title", 
  "category": "5f8a5e3e3f3e3e3e3e3e3e3e"
}
```

### DELETE /events/:id

#### **This is a protected route, a valid JWT is required in the Bearer header**

User must be an organiser or administrator to update an event
- For organisers, only events they have created can be updated or deleted

- Deletes an event

## Categories

### GET /categories

- Returns a list of all categories in JSON format

## Users

### GET /users

Only administrators can access this route

#### **This is a protected route, a valid JWT is required in the Bearer header**

- Searches for a user based on the query parameters in the link
- Query parameters:
  - username: String, optional
  - isOrganiser: Boolean, optional
  - isAdmin: Boolean, optional

Example:
```
/users?username=username&isOrganiser=true
/users?isAdmin=true
```

### GET /users/all

Only administrators can access this route

#### **This is a protected route, a valid JWT is required in the Bearer header**

- Returns a list of all users in JSON format

### GET /users/:id

Only administrators can access this route

#### **This is a protected route, a valid JWT is required in the Bearer header**

- Returns a single user in JSON format

### DELETE /users/:id

Only administrators can access this route

#### **This is a protected route, a valid JWT is required in the Bearer header**

- Deletes a user

### POST /events/:id/rsvp-add

#### **This is a protected route, a valid JWT is required in the Bearer header**

- Adds the user to the RSVP list of an event
- Requires parameters in the link:
  - id: ObjectId, required

### POST /events/:id/rsvp-remove

#### **This is a protected route, a valid JWT is required in the Bearer header**

- Removes the user from the RSVP list of an event
- Requires parameters in the link:
  - id: ObjectId, required

### POST /events/:id/rsvp-count

- Returns the number of users who have RSVP'd to an event in JSON format

```json
{
  "count": 5
}
```

## Auth

### POST /auth/register

- Registers a new user
- Requires a JSON body with the following fields:
  - username: String, required
  - password: String, required
- passwords are hashed and salted before being stored in the database

Example:
```json
{
  "username": "username",
  "password": "password"
}
```

### POST /auth/login

- Signs in a user
- Requires a JSON body with the following fields:
  - username: String, required
  - password: String, required
  - returns if the username and password are correct
- Returns a JSON Web Token (JWT) if the username and password are correct

Example:
```json
{
  "username": "username",
  "password": "password"
}
```

```json
{
  "token": "JWT",
  "refreshToken": "JWT"
}
```
A JWT and a refresh token are returned if the username and password are correct

### POST /auth/logout

- Logs out a user by invalidating the JWT token in the Bearer header

### POST /auth/token

- Returns a new JWT if the refresh token is valid
- Requires a JSON body with the following fields:
  - refreshToken: String, required
  - returns a new JWT if the refresh token is valid

## JWT 

- JWTs are used to authenticate users
- They are passed in the Bearer header to authenticate requests
- JWTs are valid for 15 minutes

### Refresh Token

- A refresh token is returned when a user logs in along with the JWT
- It is used to get a new JWT when the old one expires by sending a POST request to /auth/token with the refresh token in the body

## Images

### POST /images/pfp

#### **This is a protected route, a valid JWT is required in the Bearer header**

- Uploads a profile picture for the user
- Requires a form-data body with the following fields:
  - pfp: File, required
  - Puts the images link in the user's profile picture field in the database