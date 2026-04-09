# CITS5505 Individual Project

An interactive front-end web project for learning core web development concepts through tutorial content, a live sandbox, a quiz, an AI reflection page, and a personal CV page.

## Overview

This project is a multi-page static website built with HTML, CSS, JavaScript, and jQuery. It introduces core concepts in HTML5, CSS, and JavaScript, then reinforces them through an interactive quiz and a live DOM sandbox.

## Pages

- `index.html`: tutorial homepage covering HTML, CSS, JavaScript, and a live sandbox
- `quiz.html`: dynamic quiz page with scoring, validation, attempt history, and a reward image
- `reflection.html`: AI reflection log documenting how AI assistance was used and evaluated
- `cv.html`: personal CV page with profile, experience, skills, and references

## Features

- Dynamic quiz rendered from `questions.json`
- Quiz attempt history stored in browser `localStorage`
- Navigation warning if the user tries to leave after starting the quiz but before submitting
- Pass/fail result display with a random Pokemon reward image from PokeAPI
- Interactive HTML/CSS sandbox with live preview
- Responsive layout styled with custom CSS and Bootstrap utilities
- jQuery-based DOM updates, animations, and AJAX requests

## Tech Stack

- HTML5
- CSS3
- JavaScript
- jQuery
- Bootstrap 5
- Bootstrap Icons

## Project Structure

```text
.
|-- index.html
|-- quiz.html
|-- reflection.html
|-- cv.html
|-- questions.json
|-- src/
|   |-- app.js
|   `-- style.css
`-- assets/
    |-- images/
    |   |-- alt_photo.jpg
    |   |-- localstorge_error_photo.png
    |   `-- personal photo.jpg
    `-- pdf/
        `-- Ryan-Gong-CV.pdf
```

## Run Locally

This is a pure static website. No Node.js packages or build step are required.

You can run it in either of these ways:

1. Open the project with a local static server such as VS Code Live Server.
2. Open `index.html` directly in a browser for basic viewing.

For the most reliable behaviour, especially for AJAX loading of `questions.json`, run the project through a local server instead of opening the files directly.

## Notes

- The quiz data is loaded from `questions.json`.
- Attempt history is stored locally in the browser under `localStorage`.
- The reward image on the quiz result page is fetched from PokeAPI.
- External libraries such as jQuery, Bootstrap, Bootstrap Icons, and Google Fonts are loaded dynamically via CDN.
