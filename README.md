# Bank of #brobots API

![GitHub release (latest by date)](https://img.shields.io/github/v/release/andrew4ever/bank-of-brobots-api)

# Note

API has been planned to use email/password registration but during development we decided to use Telegram bot as only way to use bank. This opened a major flaw in API. Full refactoring is planned

## Description

API for first #brobots bank. Bank's currency is **Brobocoin**.

## Stack

We use these technologies:

- NodeJS
- Express
- GraphQL
- MongoDB

For dev-only part:

- Jest for automated testing
- CircleCI for CI
- Babel
- Yarn (but you still can use npm)

## Warning

This API should not be public. Anybody with direct access to it can provide fake or other user's Telegram ID and get their information.
