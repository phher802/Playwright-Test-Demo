# Playwright Test Suite – UI + API Automation Demo

This project is a small, focused test automation suite built with **Playwright** and **TypeScript** to demonstrate:

- End-to-end **UI tests** for a demo web app
- **API tests** against a public REST API
- Basic test organization using helpers and page-level abstractions (function-based “page objects”)

It’s meant as a portfolio-style project to show practical experience with modern test automation tools.

---

## Tech Stack

- **Language:** TypeScript
- **Test Runner:** Playwright Test
- **UI Automation:** Playwright (Chromium by default)
- **API Testing:** Playwright’s built-in `request` fixture
- **Package Manager:** npm

---

## What the Tests Cover

### UI Tests (Sauce Demo)

Target app: [`https://www.saucedemo.com`](https://www.saucedemo.com)

UI scenarios include:

1. **Successful login**
   - Logs in with a valid user (`standard_user / secret_sauce`)
   - Asserts that the inventory page loads correctly

2. **Invalid login**
   - Attempts login with a wrong password
   - Asserts that:
     - An error message is displayed
     - The user is **not** taken to the inventory page

3. **Inventory listing**
   - Logs in successfully
   - Asserts that at least one product is visible on the inventory page

Locators and common flows are encapsulated as helper functions so tests stay readable and easier to maintain.

---

### API Tests

Target API: [`https://jsonplaceholder.typicode.com`](https://jsonplaceholder.typicode.com)

API scenarios include:

1. **List users**
   - Sends `GET /users`
   - Asserts:
     - HTTP status is `200`
     - Response body is a **non-empty array**

2. **Create “user” (post)**
   - Sends `POST /posts` with a JSON payload
   - Asserts:
     - HTTP status is `200` or `201`
     - Response body echoes back the `title` and `body`
     - An `id` is present in the response

These tests use Playwright’s `request` fixture rather than a separate HTTP client library, keeping the stack small.

---

## Project Structure

````text
.
├─ helpers/                # Reusable helper functions for UI flows & locators
├─ tests/                  # All test specs live here
│  ├─ login.spec.ts        # Login-related UI tests
│  ├─ inventory.spec.ts    # Inventory page UI tests
│  ├─ api-users.spec.ts    # API tests for JSONPlaceholder
│  └─ example.spec.ts      # Simple sanity/example test
├─ playwright.config.ts    # Playwright test runner configuration
├─ package.json
├─ package-lock.json
├─ playwright-report/      # HTML report output (generated)
└─ test-results/           # Raw test run output (generated)
```
---

### Getting Started

# 1. Install dependencies

```npm install``

# 2. Install Playwright browsers
This wil download the browser binaries (Chromium, Firefox, WebKit) used by Playwright.

```npx playwright install```


### Running Tests

# Run the full test suite

``` npx playwright test```

# Run a specific test file

```npx playwright test tests/login.spec.ts```

# Run tests by title

```npx playwright test -g "invalid login"

# Run with headed browser (see the UI)

```npx playwright test --headed```

# Show the last HTML report
This opens an interactive report showing passed/failed tests, timings, and traces.

```npx playwright show-report```

### Notes on Design
- Functional page model:
    * Intead of using classes with this, this project uses functions + shared locators in helpers/ to implement page-level behavior. This keeps things simple and explicit while still avoiding duplication.

- Separation of concerns:
    * UI tests focus on user behavior and visible outcomes.
    * API tests focus on HTTP status codes and JSON payloads.

- Extensibility:
   New flows can be added by:
    * Introducing new helper functions in helpers/
    * Adding new *.spec.ts files in tests/ that resuse those helpers

### Possible Future Enhancements
- Add negative API tests (e.g. 404s, validation errors)
- Add more UI scenarios (sorting, cart behavior, etc.)
- Configure GitHub Actions to run npx playwright test on every push
- Capture screenshots and traces only on failure for easier debugging

If you're reviewing this for a QA / SDET / Test Automation role and would like more context on any design decisions or test cases, feel free to reach out!
````
