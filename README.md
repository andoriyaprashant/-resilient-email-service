# Resilient Email Sending Service

A robust email sending service built with TypeScript and Express that simulates sending emails using two mock providers. The system includes retry logic with exponential backoff, provider fallback, idempotency, rate limiting, status tracking, and more.

## Features

- Retry mechanism with exponential backoff
- Fallback between providers
- Idempotent request handling (prevents duplicates)
- Rate limiting (per recipient)
- Email status tracking
- Simple console logging
- Circuit breaker pattern (optional)  

## Tech Stack

- TypeScript
- Node.js + Express
- Jest (for testing)
- Minimal external dependencies

## Folder Structure

```bash
resilient-email-service/
├── src/
│ ├── services/ # EmailService logic
│ ├── providers/ # Mock email providers
│ ├── utils/ # Rate limiter, circuit breaker
│ └── index.ts # Entry point with API routes
├── tests/ # Unit tests
├── postman/ # Postman collection
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/andoriyaprashant/resilient-email-service.git
cd resilient-email-service
```

## Install dependencies

```bash
npm install
```
## Run the development server

```bash
npm run start
```
Server will start at: http://localhost:3000

## Run tests

```bash
npm test
```

### Test Result
```bash
$ npm test

> resilient-email-service@1.0.0 test
> jest

  console.log
    Provider A sent email successfully.

      at MockProviderA.<anonymous> (src/providers/ProviderA.ts:6:15)

 PASS  src/tests/EmailService.test.ts
  EmailService
    √ should send email successfully (22 ms)
    √ should return duplicate on same email ID (1 ms)
    √ should track status

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.823 s, estimated 2 s
Ran all test suites.
```

## Mock Email Providers

### MockProviderA

Simulates a primary email provider with a ~70% success rate. On success, it logs:

```bash
Provider A sent email successfully.
```

Otherwise, it throws an error to simulate a failure.

### MockProviderB
Acts as a fallback provider with a ~50% success rate. When used, it logs:

```bash
Provider B sent email successfully.
```
If it fails, it throws:

```bash
Provider B failed to send email.
```

## API Endpoints

### 1. POST /send

Send an email using the service.

Request Body
```json 
{
  "id": "abc",
  "to": "demoemail@gmail.com",
  "subject": "Hello",
  "body": "Test mail"
}
```

Possible Responses:
```json
{ "result": "Sent" }
{ "result": "Failed" }
{ "result": "Duplicate: Already Sent" }
{ "result": "Rate limited" }
```
### 2. GET /status/:id

Retrieve status logs for a previously attempted email.

Response 
```json 
{
  "status": [
    "2025-07-09T12:00:00Z - Success via Provider 1"
  ]
}
```

## Postman Collection
 
You can import the Postman collection file directly from:  
`C:\opensource\resilient-email-service\Postman\Resilient Email Service.postman_collection.json`

### Available Requests
1. Send Email
  - Method: POST
  - URL: http://localhost:3000/send

Body:

```json 
{
  "id": "abc",
  "to": "demoemail@gmail.com",
  "subject": "Hello",
  "body": "Test mail"
}
```
2. Check Status

  - Method: GET
  - URL: http://localhost:3000/status/abc
 - Returns:

 ```json 
 {
    "status": [
        "2025-07-10T21:12:25.501Z - Success via Provider 1"
    ]
}
```
