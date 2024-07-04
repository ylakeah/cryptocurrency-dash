# Cryptocurrency Dashboard

This is a cryptocurrency dashboard web application built with Vue.js, TypeScript and vuetify. It displays near real-time cryptocurrency data from CoinCap, allows users to add cryptocurrencies to a favorites list, and provides detailed information about each cryptocurrency.

## Features

- **Real-Time Data**: Fetches and displays real-time cryptocurrency prices from the CoinCap API.
- **Pagination**: Shows 10 items per page and allows users to navigate between pages.
- **Sorting**: Enables sorting by symbol or name.
- **Favorites**: Allows users to add/remove cryptocurrencies from a favorites list, which is stored in local storage.
- **Details Page**: Provides detailed information about each cryptocurrency.
- **Search crypto**: Allows user to search cryptocurrency by name, user will be promt with autocomplete suggestion as well.


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Unit test

```sh
npm run test:unit
```

## Usage

1. Navigate to the home page to see a list of cryptocurrencies.
2. Use the pagination controls to navigate through the list.
3. Click on a cryptocurrency name to view detailed information.
4. Click the star icon to add/remove a cryptocurrency from the favorites list.
5. search a cryptocurrency name with autocomplete