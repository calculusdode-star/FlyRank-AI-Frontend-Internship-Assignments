# Game Discovery App — AI Development Prompts

## Project Overview

This document records the AI development prompts used during the development of the **Game Discovery App**.

The project was developed using:

* React
* Vite
* JavaScript
* JSX
* React Router
* RAWG Video Games Database API
* Node.js server/API boundary
* Firebase Authentication
* Firebase Realtime Database
* Vitest
* React Testing Library
* Plain CSS
* MVVM-inspired architecture

### Application Flow

```text
Home
  ↓
Search / Browse Games
  ↓
Game Cards
  ↓
Game Details
  ↓
Add to Favourites
  ↓
My Favourites
```

---

# Part 1 — 42 Development Stages

Each stage below represents a separate development task/prompt used to progressively build the application.

---

## Stage 01 — Create the Vite Application

### Prompt

> Create the initial Game Discovery App using React and Vite.
>
> Set up the project with JavaScript/JSX and establish the basic application structure needed to begin development.
>
> Keep the initial setup clean and minimal. Do not introduce TypeScript or Tailwind.

### Purpose

Establish the React + Vite foundation for the application.

---

## Stage 02 — Clean the Vite Starter

### Prompt

> Clean the default Vite starter application and remove unnecessary starter content.
>
> Keep only the files and structure required for the Game Discovery App.
>
> Establish a clean starting point without introducing unnecessary dependencies or architecture.

### Purpose

Remove the default Vite demonstration code and prepare the project for the actual application.

---

## Stage 03 — Build the Header

### Prompt

> Create the application's Header component.
>
> The Header should provide the primary navigation needed by the Game Discovery App.
>
> Use semantic HTML, accessible navigation, meaningful labels, keyboard accessibility, and the existing plain CSS approach.
>
> Keep the implementation focused on the Header and do not introduce unrelated application features.

### Purpose

Create the application's primary navigation structure.

---

## Stage 04 — Create the Home MVVM Structure

### Prompt

> Create the Home page using the project's MVVM-inspired architecture.
>
> Establish the appropriate Model, ViewModel/hook, View, and CSS files for the Home page.
>
> Keep responsibilities separated and do not place API logic directly inside the View.
>
> Do not introduce unnecessary abstractions.

### Purpose

Establish the Home page architecture before connecting real game data.

---

## Stage 05 — Create the RAWG Game Service

### Prompt

> Create the game service responsible for communicating with the RAWG Video Games Database API.
>
> Keep API communication separate from React components.
>
> Configure the RAWG API key through environment configuration and do not hardcode secrets into source code.
>
> Establish the service methods required for retrieving games.

### Purpose

Create the application's API/service boundary.

---

## Stage 06 — Connect the Home Model to the Game Service

### Prompt

> Connect the Home Model to the existing game service.
>
> The Model should provide the Home feature with the game data required by the ViewModel.
>
> Keep API/service responsibilities outside the React View.
>
> Reuse the existing architecture and avoid unnecessary changes.

### Purpose

Connect the Home feature architecture to the game-data layer.

---

## Stage 07 — Fetch Games Through the Home ViewModel

### Prompt

> Implement game fetching in the Home ViewModel.
>
> Connect the Home ViewModel to the existing Home Model and game service.
>
> Handle the required application states, including loading, successful data retrieval, errors, and empty results.
>
> Keep the ViewModel responsible for presentation-ready state rather than putting API logic inside the View.

### Purpose

Give the Home page controlled access to game data.

---

## Stage 08 — Display Games on the Home View

### Prompt

> Update the Home View to display games retrieved through the Home ViewModel.
>
> Implement the appropriate loading, error, empty, and successful states.
>
> Keep the View focused on rendering state and data provided by the ViewModel.
>
> Use semantic and accessible markup.

### Purpose

Render the first real game-discovery experience.

---

## Stage 09 — Create GameCard

### Prompt

> Create a reusable GameCard component for displaying game information.
>
> Include the appropriate game artwork and key information available from RAWG.
>
> Use accessible markup, meaningful image alt text, intentional card proportions, and responsive styling.
>
> Keep the component reusable and focused only on displaying a game.

### Purpose

Create the reusable visual representation of a game.

---

## Stage 10 — Create SearchBar

### Prompt

> Create a reusable SearchBar component for the Game Discovery App.
>
> Provide an accessible input and appropriate search interaction.
>
> Use semantic HTML, a meaningful label, keyboard accessibility, and the existing CSS approach.
>
> Keep the component focused on collecting search input rather than performing API requests itself.

### Purpose

Introduce game-search input.

---

## Stage 11 — Connect Search to RAWG

### Prompt

> Connect the SearchBar to the existing game-discovery data flow.
>
> When the user searches for a game, retrieve matching games through the existing game service and display the results.
>
> Keep API communication inside the service layer.
>
> Handle loading, error, empty-result, and successful-search states.

### Purpose

Turn the search interface into a functional RAWG-powered search.

---

## Stage 12 — Create Game Details MVVM Structure

### Prompt

> Create the Game Details feature using the existing MVVM-inspired architecture.
>
> Establish the Model, ViewModel/hook, View, and CSS structure.
>
> The feature should be prepared to retrieve and display information for an individual game.
>
> Keep the architecture consistent with the Home feature.

### Purpose

Create the architecture for individual game pages.

---

## Stage 13 — Add React Router

### Prompt

> Add React Router to the application.
>
> Establish the routes required for the Game Discovery App, including Home, Game Details, authentication pages, and Favourites as appropriate for the current application structure.
>
> Keep routing centralized and avoid unnecessary routing abstractions.

### Purpose

Introduce application-level navigation.

---

## Stage 14 — Connect GameCard Navigation

### Prompt

> Make each GameCard navigate to the appropriate Game Details page.
>
> Use the existing React Router implementation.
>
> Pass the correct game identifier through the route.
>
> Preserve the existing GameCard presentation and functionality.

### Purpose

Allow users to move from search results to individual games.

---

## Stage 15 — Read the Game Details Route Parameter

### Prompt

> Update the Game Details feature to read the game identifier from the route.
>
> Use the identifier to retrieve the correct game information through the existing service/model architecture.
>
> Handle loading, error, and successful data states.
>
> Do not place API logic directly in the View.

### Purpose

Make individual Game Details pages data-driven.

---

## Stage 16 — Add Favourites Placeholder

### Prompt

> Add the initial Add to Favourites interaction to the Game Details feature.
>
> Establish the UI and application flow needed for favouriting a game without yet implementing Firebase persistence.
>
> Keep the implementation prepared for the later authentication and persistence stages.

### Purpose

Establish the favourites interaction before connecting persistence.

---

## Stage 17 — Add Firebase Service and Configuration

### Prompt

> Add the Firebase service/configuration required for authentication and favourites persistence.
>
> Keep Firebase configuration separate from UI components.
>
> Do not hardcode credentials or secrets.
>
> Establish the service boundary needed by the authentication and favourites features.

### Purpose

Introduce Firebase infrastructure.

---

## Stage 18 — Create AuthContext

### Prompt

> Create an authentication context for the Game Discovery App.
>
> The context should provide the current authentication state to the application.
>
> Use Firebase authentication state listeners appropriately.
>
> Keep authentication logic centralized rather than duplicating it across components.

### Purpose

Create a single source of truth for authentication state.

---

## Stage 19 — Implement Registration

### Prompt

> Implement the user registration flow using Firebase Authentication.
>
> Create the registration UI and connect it to the existing authentication architecture.
>
> Handle loading, successful registration, validation, and authentication errors.
>
> Keep credentials secure and do not expose sensitive information.

### Purpose

Allow users to create accounts.

---

## Stage 20 — Implement Login

### Prompt

> Implement the login flow using Firebase Authentication.
>
> Connect the login form to the existing authentication architecture.
>
> Handle loading, successful authentication, validation, and authentication errors.
>
> Keep the implementation consistent with the registration flow.

### Purpose

Allow existing users to authenticate.

---

## Stage 21 — Add Authentication Routes

### Prompt

> Add the required routes for registration and login.
>
> Integrate them with the existing React Router configuration.
>
> Keep authentication pages separate from protected application pages.

### Purpose

Make authentication pages accessible through application routing.

---

## Stage 22 — Implement Logout

### Prompt

> Implement logout using Firebase Authentication.
>
> Connect the logout action to the existing authentication context.
>
> Ensure the application authentication state updates correctly after logout.
>
> Preserve the existing navigation and UI behavior.

### Purpose

Allow authenticated users to safely sign out.

---

## Stage 23 — Create ProtectedRoute

### Prompt

> Create a reusable ProtectedRoute component for authenticated-only routes.
>
> Use the existing AuthContext state.
>
> Unauthenticated users should not be able to access protected pages.
>
> Handle the authentication-loading state correctly so that the application does not redirect prematurely.

### Purpose

Protect authenticated application areas.

---

## Stage 24 — Create Favourites MVVM Structure

### Prompt

> Create the Favourites feature using the existing MVVM-inspired architecture.
>
> Establish the Favourites Model, ViewModel/hook, View, and CSS structure.
>
> Prepare the feature to retrieve and display the authenticated user's saved games.

### Purpose

Establish the architecture for the user's favourites page.

---

## Stage 25 — Create favouritesService

### Prompt

> Create the service responsible for reading, adding, and removing favourites from Firebase Realtime Database.
>
> Keep Firebase data operations outside the React Views.
>
> Scope favourites to the authenticated user.
>
> Handle the relevant success and failure states.

### Purpose

Create the persistence layer for favourites.

---

## Stage 26 — Connect FavouritesModel

### Prompt

> Connect the Favourites Model to the existing favourites service.
>
> The Model should expose the data operations required by the Favourites ViewModel.
>
> Keep Firebase implementation details inside the service layer.

### Purpose

Connect the Favourites architecture to Firebase persistence.

---

## Stage 27 — Create Favourites ViewModel

### Prompt

> Implement the Favourites ViewModel.
>
> Connect the Model to the Favourites View.
>
> Manage loading, success, empty, and error states.
>
> Ensure favourites are associated with the authenticated user.

### Purpose

Provide presentation-ready favourites state.

---

## Stage 28 — Integrate Add to Favourites

### Prompt

> Connect the existing Add to Favourites interaction to the favourites service.
>
> When an authenticated user adds a game to favourites, persist the game using the existing Firebase service.
>
> Handle success and failure states.
>
> Do not duplicate Firebase logic in the UI.

### Purpose

Make the favourites action persistent.

---

## Stage 29 — Display and Remove Favourites

### Prompt

> Update the Favourites page to display the authenticated user's saved games.
>
> Allow the user to remove a game from favourites.
>
> Update the UI appropriately after removal.
>
> Handle loading, empty, error, and successful states.

### Purpose

Complete the basic Favourites experience.

---

## Stage 30 — Protect the Favourites Route

### Prompt

> Protect the Favourites route using the existing ProtectedRoute implementation.
>
> Unauthenticated users must not be able to access another user's favourites.
>
> Preserve the existing authentication and routing behavior.

### Purpose

Secure the favourites page at the application-routing level.

---

## Stage 31 — Remove Favourite from Game Details

### Prompt

> Update Game Details so the favourite action reflects whether the current game is already saved.
>
> Allow an authenticated user to add or remove the game from favourites directly from Game Details.
>
> Reuse the existing favourites service and authentication state.
>
> Do not duplicate persistence logic.

### Purpose

Complete the favourite interaction from the Game Details page.

---

## Stage 32 — Configure and Verify RAWG API Security

### Prompt

> Review and configure the RAWG API integration so the API key is handled securely.
>
> The RAWG API key must not be exposed through browser-side React code or production JavaScript.
>
> Move the API request behind the server/API boundary where necessary.
>
> Verify that the client communicates with the application API rather than directly exposing the RAWG secret.
>
> Do not expose or print the actual API key.

### Purpose

Correct the API architecture so the RAWG credential remains server-side.

---

## Stage 33 — Improve RAWG Error Handling

### Prompt

> Improve error handling for the RAWG/API integration.
>
> Handle failed API requests, authentication failures, malformed responses, unavailable data, and relevant HTTP errors gracefully.
>
> Provide appropriate user-facing states without exposing internal server details or secrets.
>
> Preserve the existing successful API behavior.

### Purpose

Make API failures safe and understandable to users.

---

## Stage 34 — Add Pagination / Load More

### Prompt

> Add pagination to the game listing.
>
> Use the existing RAWG pagination information where available.
>
> Allow users to move through additional game results without breaking the current search and browsing behavior.
>
> Handle loading and disabled states appropriately.
>
> Keep the implementation consistent with the existing architecture.

### Purpose

Allow users to browse beyond the initial results.

---

## Stage 35 — Add Filtering and Browsing

### Prompt

> Improve game browsing by adding the appropriate filtering/browsing functionality supported by the existing RAWG integration.
>
> Keep filtering logic separate from presentation where appropriate.
>
> Preserve search, pagination, loading, error, and empty states.
>
> Avoid unnecessary UI complexity.

### Purpose

Give users additional ways to discover games.

---

## Stage 36 — Configure Firebase Security Rules

### Prompt

> Review and configure Firebase Realtime Database security rules for the favourites data.
>
> Ensure authenticated users can access only their own favourites.
>
> Prevent unauthenticated users from reading or modifying protected favourites data.
>
> Verify the rules against the application's actual data structure.
>
> Do not weaken security to make the application function.

### Purpose

Enforce authorization at the database level.

---

## Stage 37 — Test Authentication and Favourites

### Prompt

> Add behavior-focused tests for authentication and favourites functionality.
>
> Test relevant successful and failed authentication states, protected access, adding favourites, removing favourites, loading states, empty states, and failure states.
>
> Use the project's existing Vitest and React Testing Library setup.
>
> Avoid implementation-detail tests where behavior can be tested instead.

### Purpose

Establish automated coverage for core authentication and favourites functionality.

---

## Stage 38 — Test Home and Game Details

### Prompt

> Add behavior-focused tests for Home and Game Details.
>
> Cover loading, successful data retrieval, empty results, API failures, search behavior, game selection/navigation, and relevant user interactions.
>
> Use the existing testing architecture and avoid unnecessary mocking complexity.

### Purpose

Test the application's primary game-discovery flow.

---

## Stage 39 — Test Edge Cases and UI States

### Prompt

> Add tests for important edge cases and UI states across the application.
>
> Cover authentication failures, API failures, empty data, unavailable game information, favourite failures, loading transitions, protected routes, and relevant boundary conditions.
>
> Keep tests behavior-focused and maintainable.

### Purpose

Improve reliability beyond the normal happy path.

---

## Stage 40 — Accessibility and Responsive Refinement

### Prompt

> Review and improve the application's accessibility and responsive behavior.
>
> Inspect semantic HTML, accessible names, keyboard navigation, visible focus states, image alt text, contrast, responsive layouts, loading/error/empty states, and mobile/tablet/desktop behavior.
>
> Preserve the existing visual direction and avoid unnecessary redesign.
>
> Do not introduce Tailwind or a UI library.

### Purpose

Refine the application for usability and accessibility across devices.

---

## Stage 41 — Full Application Verification

### Prompt

> Perform a complete verification of the Game Discovery App.
>
> Verify:
>
> * application startup
> * production build
> * linting
> * automated tests
> * Home
> * search
> * Game Details
> * authentication
> * protected routes
> * favourites
> * RAWG API integration
> * Firebase access
> * responsive behavior
> * accessibility
> * browser console/runtime errors
> * production API behavior
> * security-sensitive configuration
>
> Do not claim a check passed unless it was actually performed.
>
> Report failures and remaining issues clearly.

### Purpose

Establish the actual state of the completed application.

---

## Stage 42 — Final Security, Code, Git, and README Review

### Prompt

> Perform the final review of the Game Discovery App.
>
> Review:
>
> * application functionality
> * architecture
> * code quality
> * security
> * API configuration
> * Firebase authorization
> * authentication
> * accessibility
> * responsive UI
> * tests
> * dependencies
> * Git status
> * repository hygiene
> * README documentation
>
> Check for exposed secrets, unnecessary files, debugging code, console errors, incomplete functionality, and inconsistencies between documentation and the actual application.
>
> Make only necessary corrections.
>
> Verify the final state rather than assuming previous checks remain valid.

### Purpose

Complete the final engineering and documentation review.

---

# Part 2 — Debugging Prompts

The following section is intentionally separate from the **42 planned development stages**.

These prompts were used to diagnose and correct problems encountered during development rather than to represent new planned application-building stages.

---

## Debugging 01 — RAWG API Authentication Failure

### Problem

The application was returning a RAWG authentication error even though the API integration appeared to be configured correctly.

### Prompt

> Debug the RAWG API authentication failure.
>
> Inspect the server-side API integration, environment loading, API request construction, and RAWG response.
>
> Verify that the application is using the correct server-side `RAWG_API_KEY`.
>
> Do not expose the actual API key in output, source code, logs, or documentation.
>
> Determine whether the failure is caused by application code, environment configuration, or the RAWG account/key itself.
>
> Make the smallest necessary correction and verify the result with an actual request.

### Outcome

The application code and server-side API boundary were verified. The API request itself returned a RAWG authentication failure. A different RAWG account/key was subsequently used and the integration worked.

---

## Debugging 02 — Production `/api/games` Returned 404

### Problem

The production preview server was serving the application but the `/api/games` endpoint returned `404`.

### Prompt

> Debug the production `/api/games` 404.
>
> Inspect the server routing, preview server configuration, static-file handling, and API route registration.
>
> Ensure `/api/games` is handled by the server API route while normal application routes and static assets continue to work.
>
> Do not change the API contract or expose the RAWG API key.
>
> Verify the production preview server with an actual HTTP request.

---

## Debugging 03 — Static Asset MIME Type Problem

### Problem

Static assets were initially being served with an incorrect MIME type.

### Prompt

> Debug the production static asset MIME-type issue.
>
> Inspect how the preview server serves JavaScript, CSS, images, and other static files.
>
> Correct the server behavior without changing the application's frontend architecture.
>
> Verify that the production application loads its assets with the correct content types.

---

## Debugging 04 — RAWG Secret Exposed in Production Bundle

### Problem

A production bundle scan showed that the RAWG API key was present in client-side JavaScript.

### Prompt

> Audit and correct the RAWG API-key exposure in the production bundle.
>
> Remove the client-side dependency on `VITE_RAWG_API_KEY`.
>
> Move RAWG API authentication behind the server/API boundary.
>
> Ensure the browser communicates with `/api/games` rather than directly sending the RAWG credential.
>
> Scan the production bundle after the change and confirm the RAWG key is no longer exposed.
>
> Do not print or reveal the actual key.

---

## Debugging 05 — Server Environment Verification

### Problem

The server-side RAWG integration needed to be verified without exposing the secret.

### Prompt

> Verify the server-side RAWG environment configuration without exposing the API key.
>
> Confirm:
>
> * the server receives `RAWG_API_KEY`
> * the environment file is loaded correctly
> * the application uses the exact `RAWG_API_KEY` variable
> * `VITE_RAWG_API_KEY` is not used
> * the RAWG request is made server-side
>
> Never print the actual API key or include it in the debugging output.

---

## Debugging 06 — Firebase Unauthenticated Access

### Problem

The application needed verification that unauthenticated users could not access protected favourites data.

### Prompt

> Verify Firebase favourites authorization.
>
> Test unauthenticated access to the protected favourites data.
>
> Confirm that unauthenticated access is rejected and that authenticated users can access only their own favourites.
>
> Do not weaken Firebase security rules to make the test pass.
>
> Report the actual HTTP/authentication result.

---

## Debugging 07 — Login Redirect Failure

### Problem

A successfully authenticated user remained on the login form instead of reaching Home.

### Prompt

> Debug the successful-login redirect.
>
> Inspect the login component, login ViewModel/hook, AuthContext, Firebase authentication state, and React Router navigation.
>
> Determine why successful authentication does not transition the user to Home.
>
> Check for timing/race conditions between Firebase authentication state updates and navigation.
>
> Correct the underlying implementation rather than hiding the login form.
>
> Verify both successful and failed login behavior.

---

## Debugging 08 — Registration Redirect Failure

### Problem

A newly registered user remained on the registration form after successful registration.

### Prompt

> Debug the successful-registration redirect.
>
> Inspect the registration component, registration ViewModel/hook, Firebase authentication state, AuthContext, and routing.
>
> Determine why successful registration does not take the authenticated user to Home.
>
> Correct the underlying authentication/navigation flow.
>
> Verify that successful registration reaches Home and failed registration remains on the registration page.

---

## Debugging 09 — Login and Registration Redirect Correction

### Problem

The earlier login and registration redirect changes did not successfully resolve the behavior.

### Prompt

> Debug both successful login and successful registration together.
>
> Inspect the current implementation rather than assuming the previous redirect changes are correct.
>
> Determine the actual root cause preventing both authentication flows from reaching Home.
>
> Correct the authentication-state and navigation flow so that:
>
> ```text
> Successful registration → authenticated state → Home
> Successful login        → authenticated state → Home
> ```
>
> Failed authentication must remain on the relevant form.
>
> Verify both flows independently.

---

## Debugging 10 — Pagination Layout

### Problem

The pagination controls at the bottom of the game listing did not have sufficient spacing from the GameCard grid and were not horizontally centered.

### Prompt

> Debug and improve the pagination layout.
>
> Inspect the existing GameCard grid and pagination CSS/layout.
>
> Add appropriate vertical spacing between the GameCards and pagination controls.
>
> Horizontally center the pagination at the bottom of the game listing.
>
> Preserve the existing pagination functionality and GameCard layout.
>
> Ensure the layout works on mobile, tablet, and desktop.
>
> Do not change pagination logic or unrelated application functionality.

---

# Prompt Development Approach

The development process followed a progressive structure rather than asking the AI to construct the entire application in one operation.

```text
Foundation
    ↓
Architecture
    ↓
Components
    ↓
API
    ↓
Search
    ↓
Game Details
    ↓
Routing
    ↓
Authentication
    ↓
Favourites
    ↓
Security
    ↓
Pagination / Browsing
    ↓
Testing
    ↓
Accessibility / Responsive UI
    ↓
Verification
    ↓
Final Review
```

The debugging prompts were kept separate because they addressed **problems discovered during implementation**, while the 42 stages represented the planned development sequence.

---

# Technology and Architecture Principles Used

## Frontend

* React
* Vite
* JavaScript
* JSX
* React Router
* Plain CSS

## Backend / API Boundary

```text
React Browser
      ↓
Application API
      ↓
Server
      ↓
RAWG API
```

The RAWG credential remains server-side rather than being exposed through browser-side `VITE_*` variables.

## GitHub Pages and Render preparation

For a separate GitHub Pages frontend and Render API, set the public frontend
build variable `VITE_API_BASE_URL` to the Render API origin, such as
`https://your-api.onrender.com`. This value is not secret and must not contain
`RAWG_API_KEY`.

On Render, set `FRONTEND_ORIGIN` to the exact GitHub Pages origin, such as
`https://your-user.github.io`. The Node server returns CORS headers only for
that configured origin. Keep `RAWG_API_KEY` as a server-only Render
environment variable.

## Authentication

```text
React
  ↓
AuthContext
  ↓
Firebase Authentication
```

## Favourites

```text
Game Details
     ↓
Favourites Service
     ↓
Firebase Realtime Database
     ↓
Authenticated User
```

## Testing

* Vitest
* React Testing Library
* Behavior-focused testing
* Loading/error/empty/success states
* Authentication and favourites behavior
* Edge cases

---

# Development Principle

The application was developed incrementally.

For each stage:

```text
Explore
   ↓
Understand
   ↓
Plan
   ↓
Implement
   ↓
Test
   ↓
Inspect
   ↓
Review
   ↓
Correct
   ↓
Verify
```

The AI was used as a development assistant, while implementation results were expected to be verified against the actual application rather than assumed from generated code.
