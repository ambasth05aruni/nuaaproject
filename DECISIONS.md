# DECISIONS.md

## A decision I spent the most time on

### Context API + useReducer vs. Zustand

One of the imp decisions while building this project was choosing how to manage the cart state.

I considered using **Zustand** because it's lightweight, easy to set up, and helps avoid unnecessary component re-renders.

In the end, I chose **Context API with useReducer**.

The main reason was that this project is fairly small. Since there aren't many products or complex state updates, the performance difference would be very small. I preferred keeping the project simple instead of adding another library too early.

Another reason was testing. Since the reducer is just a normal JavaScript function, I could test the cart logic easily without rendering React components.

If this project becomes much larger with many components using different parts of the cart state, I would consider switching to Zustand.


## Things I would improve with more time

### 1. Better URL parameters

Right now, the selected colour is stored as its index (for example, `?color=0`).

A better approach would be to store the actual colour name (like `?color=Black`). This would make shared links more reliable even if the order of colours changes later.

### 2. Better handling of category names

While working on the project, I found a mismatch between the category names returned by the API and the names used in my code. This caused one category to show no products.

I fixed the issue, but using stronger type checking or better validation would help prevent this kind of bug in the future.

### 3. Better SCSS organization

At the beginning, many spacing and size values were written directly in different SCSS files.

Later, I moved them into a shared variables file. If I were starting again, I would create all the design variables first to keep the styling more consistent.

### 4. Smoother search

Initially, the search updated on every key press, which caused filtering to happen repeatedly while typing.

I later added a small debounce (300ms), so the search updates only after the user pauses typing. This makes the app feel smoother and more responsive.