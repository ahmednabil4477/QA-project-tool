# Class Diagram Compliance README

This document outlines how the updated Class Diagram (`Class Diagram_Updated.puml`) complies with the project's backend and frontend codebases, as well as the Software Requirements Specification (SRS).

## 1. Compliance with the Database Schema (Backend)
The class models and relationships were directly derived from the Prisma schema (`src/backend/prisma/schema.prisma`):

- **Admin (`C1`)**: Matches the `Admin` model with fields `admin_id`, `email`, and `password`. Maintains a one-to-many relationship with `User` (for deleted users) and `Booking` (for cancelled bookings).
- **User (`C2`)**: Matches the `User` model, specifically replacing `full_name` with `first_name` and `last_name` as implemented in the database.
- **Booking (`C3`)**: Links directly to `Flight` rather than redundantly storing destination strings. Maps to the `Booking` schema model containing `booking_id`, `date`, and `total_price`.
- **Review (`C4`)**: Relates directly to `Destination` instead of `Booking` based on the Prisma schema (`destinationId` foreign key). Uses the `rating` attribute as implemented.
- **Flight (`C5`)**: Expanded to include the actual search fields stored in the DB, such as `airline_name`, `departure_city`, `arrival_city`, `departure_time`, and `arrival_time`.
- **Destination (`C6`)**: Mapped to the actual DB fields, including `image_url`, `cost`, and `rating`, with a composition relationship to `TopPlace`.
- **TopPlace (`C7`)**: Included the `id` primary key and maps perfectly to the `TopPlace` model fields.

## 2. Compliance with the API and Express Routes (Backend)
The methods injected into the class diagram correspond to the REST API route controllers:

- **Admin & User Methods**: Map to the endpoints in `src/backend/src/routes/auth.js` (`POST /register`, `POST /login`), and `users.js` (`GET /`, `DELETE /:id`).
- **Booking Methods**: Reflect `src/backend/src/routes/bookings.js` operations, including `createBooking()` mapped to `POST /`, and `getMyBookings()` mapped to `GET /my-bookings`.
- **Flight & Destination Methods**: Capture the search and retrieval endpoints in `flights.js` and `destinations.js`.
- **Review Methods**: Align with the operations in `reviews.js`.

## 3. Compliance with the Frontend Code
The diagram aligns with the UI behaviors driven by the vanilla Javascript files in `src/front/src/js/`:

- **Flight Search & Result (`flights.js`)**: Matches the `searchFlights()` and UI rendering logic.
- **Booking Process & Payment (`checkout.js`)**: The frontend interacts heavily with the `Booking` class during the checkout process (`processPayment()`, `validatePassengerDetails()`).
- **My Bookings (`my-bookings.js`)**: Maps to the fetching and display of a user's `Booking` array.
- **Admin Interfaces (`admin-users.js`, `admin-bookings.js`)**: Corresponds directly to the `Admin` methods for fetching and updating system state.

## 4. Compliance with the Requirements (SRS)
The Class IDs and methods satisfy the features specified in `SRS.txt`:
- **Flight Search (SRS 4.5) & Destination Details (SRS 4.4)**: Managed by the `Flight`, `Destination`, and `TopPlace` classes via their search/fetch methods.
- **Passenger Details (SRS 4.7) & Payment (SRS 4.8)**: Captured under the `Booking` domain operations (`createBooking`).
- **My Bookings (SRS 4.9)**: Uses `Booking` (`getMyBookings`) and `Review` (`addReview`).
- **User Management (SRS 4.10) & Booking History (SRS 4.11)**: Facilitated by the `Admin` class methods handling deletion and cancellation across `User` and `Booking` instances.

The Requirement Traceability Matrix (`RTM.csv`) has been updated to explicitly link each feature row to these **ClassIDs**, the involved **Frontend Functions**, and the handling **Backend Route endpoints**.
