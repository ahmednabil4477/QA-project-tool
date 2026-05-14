# RTM Traceability Mapping Reference

This document provides the precise mappings for the **ClassID**, **FrontendFunction**, and **BackendFunction** columns of the Requirement Traceability Matrix (`RTM.csv`). These mappings are derived from the updated Class Diagram and the implementation in the codebase.

## Formatting Standards
- **ClassID**: Format as `ClassID(Method1(), Method2())`.
- **FrontendFunction**: `Filename.js: Action/Function`
- **BackendFunction**: `RouteFile.js: HTTP Method /Endpoint`

---

## Mapping Tables by Functional Requirement

### 1. User Authentication (Login)
**SRS Refs**: UL-01 to UL-06
*   **ClassID**: `C1(login()); C2(login())`
*   **FrontendFunction**: `login.js: loginBtn click handler`
*   **BackendFunction**: `auth.js: POST /auth/login`

### 2. User Registration
**SRS Refs**: UR-01 to UR-10
*   **ClassID**: `C2(register())`
*   **FrontendFunction**: `create-account.js: registerBtn click handler`
*   **BackendFunction**: `auth.js: POST /auth/register`

### 3. Home Page & Gallery
**SRS Refs**: HP-01 to HP-11
*   **ClassID**: `C6(getDestinations(), renderDestinations(country)); C4(getReviews())`
*   **FrontendFunction**: `gallery.js: fetchDestinations() | renderDestinations()`
*   **BackendFunction**: `destinations.js: GET / | reviews.js: GET /`
*   **Note for HP-04 (Logout)**: Use `C2(login(), logout())`
*   **Note for HP-02 (My Bookings Link)**: Use `C2(login()); C3(getMyBookings())`

### 4. Destination Details
**SRS Refs**: DD-01
*   **ClassID**: `C6(getDestinationDetails(destinationId)); C7(getTopPlaces(destinationId))`
*   **FrontendFunction**: `destination.js: loadDestinationDetails()`
*   **BackendFunction**: `destinations.js: GET /:id (includes topPlaces)`

### 5. Flight Search & Results
**SRS Refs**: FS-01 to FS-08
*   **ClassID**: `C5(searchFlights(departureCity, arrivalCity, date), renderFlights(flights))`
*   **FrontendFunction**: `flights.js: searchFlights() | renderFlights()`
*   **BackendFunction**: `flights.js: GET /`

### 6. Passenger Details & Payment (Booking Flow)
**SRS Refs**: PD-01 to PD-12, PAY-01 to PAY-10
*   **ClassID**: `C3(createBooking(flightId, passengers, payment))`
*   **FrontendFunction**: `checkout.js: processPayment() | validatePassengerDetails()`
*   **BackendFunction**: `bookings.js: POST /`

### 7. My Bookings & Reviews
**SRS Refs**: MB-01 to MB-04
*   **ClassID**: `C3(getMyBookings()); C4(addReview(comment, rating, destinationId))`
*   **FrontendFunction**: `my-bookings.js: loadBookings() | submitReview()`
*   **BackendFunction**: `bookings.js: GET /my-bookings | reviews.js: POST /`

### 8. User Management (Admin Only)
**SRS Refs**: UM-01 to UM-08
*   **ClassID**: `C1(getAllUsers(), deleteUser(userId))`
*   **FrontendFunction**: `admin-users.js: loadUsers() | deleteUser()`
*   **BackendFunction**: `users.js: GET / | DELETE /:id`

### 9. Booking History (Admin Only)
**SRS Refs**: BH-01 to BH-08
*   **ClassID**: `C1(getAllBookings(), cancelBooking(bookingId))`
*   **FrontendFunction**: `admin-bookings.js: loadAllBookings() | cancelBooking()`
*   **BackendFunction**: `bookings.js: GET / | DELETE /:id`

---

## Mapping Logic for Specific Test Cases

When filling in the `RTM.csv`, use the following logic for these specific Test Cases:

| Test Case ID | ClassID Mapping | Logical Rationale |
| :--- | :--- | :--- |
| **TC_HomePage_05** | `C2(login(), logout())` | Test steps involve logging in and then clicking logout. |
| **TC_HomePage_03** | `C2(login()); C3(getMyBookings())` | Test verifies redirection to login when trying to access bookings. |
| **TC_Registration_002**| `C2(login(), register())` | Involves navigating between registration and login pages. |
| **TC_DestinationDetails_01**| `C6(getDestinationDetails()); C5(searchFlights()); C3(createBooking())` | Covers the full flow from destination view to booking search. |
| **TC_MyBookings_01** | `C3(getMyBookings()); C5(searchFlights())` | Clicking "Book Again" from my bookings redirects to flight search. |
