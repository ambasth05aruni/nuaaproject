# E-Commerce Web App
A mini e-commerce application built with React, Vite, and SCSS using the Fake Store API.

## Features
1. Responsive product listing
2. Product detail page with image options
3. Colour and size selection
4. Available, Low Stock, and Sold Out states is managed
5. Add to Cart
6. lazy-loaded images
7. Responsive screen mobile and laptop
8. Selected colour and size stored in the URL
9. Cart data saved in localStorage
10. Cart drawer with quantity update and remove item



## Tech Stack
React
Vite
React Router
Context API
SCSS
Fake Store API



## Installation
npm install

### Run the project:
npm run dev


### Build the project:
npm run build


### Preview the build:
npm run preview



## Assumptions

1. Mocked product variants (colour, size, and stock) because the Fake Store API does not provide them.
2. Added extra gallery images since the API only returns one image per product.
3. Used Context API for cart management.
4. Stored cart data in localStorage.
5. Synced selected variants with the URL.
6. Used lazy loading and debounced search for better performance.




## Live Demo
link: 
