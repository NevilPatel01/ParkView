# Park View Mobile Application

Welcome to the **Park View Mobile Application**! This project is designed to help users discover nearby parks, explore their details, and enjoy enhanced mapping features.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Screens](#screens)
  - [HomeScreen](#homescreen)
  - [ParksScreen](#parksscreen)
  - [ParkDetailsScreen](#parkdetailsscreen)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Theming](#theming)

## Features
- Toggle between light and dark themes.
- Discover nearby parks using **Google Places API**.
- Search for parks based on location or city names.
- Interactive map with zoom controls and park markers.
- Park details page with images, descriptions, and favorites support.
- Persistent state for user preferences using AsyncStorage.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/park-view-app.git
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure you have Expo CLI installed:
    ```bash
    npm install -g expo-cli
    ```
4.  Add a .env file with your Google Places API key:
    ```bash
    GOOGLE_PLACES_API_KEY=your_google_api_key
    ```
5.  Start the application:
    ```bash
    expo start
    ```
## Usage
- Home Screen: Toggle themes, navigate to the parks list, or visit the wishlist.
- Parks Screen: View nearby parks on an interactive map or search for specific locations.
- Park Details Screen: Explore park details, view images, and add to favorites.

## Screens
### HomeScreen
The landing screen features:

- A background image that changes based on the theme.
- Buttons to toggle light/dark mode and navigate to the wishlist.
- Navigation to the ParksScreen to explore parks.

### ParksScreen
Features:

- A dynamic map centered on the user's current location.
- A search bar to look up parks by city or location.
- List of nearby parks with details like name, address, and ratings.
- Zoom controls for the map.

### ParkDetailsScreen
Details about individual parks:

- Name, address, rating, and additional information.
- Image carousel with zoom functionality.
- Add/remove from favorites.

## API Integration
- Google Places API: Retrieves park details, locations, and ratings.
- Geocoding API: Used to fetch coordinates from location queries.
- Ensure you have a valid Google API key in your environment variables.

## Environment Variables
Add a .env file to the project root with:
```bash
GOOGLE_PLACES_API_KEY=your_google_api_key
```

## Theming
- The application supports light and dark modes using a custom ThemeContext.
- Easily toggle themes with the sun/moon button on the HomeScreen.
