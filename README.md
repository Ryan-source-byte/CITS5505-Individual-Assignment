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
├── index.html
├── quiz.html
├── reflection.html
├── cv.html
├── questions.json
├── personal photo.jpg
├── src/
│   ├── app.js
│   └── style.css
├── package.json
└── metadata.json
```

## Run Locally

### Prerequisite

- Node.js

### Install dependencies

```bash
npm install
```

### Start the local server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts a local development server on port `3000`.

```bash
npm run build
```

Copies the project files into a `dist/` folder.

```bash
npm run preview
```

Serves the `dist/` folder on port `3000`.

## Notes

- The quiz data is loaded from `questions.json`.
- Attempt history is stored locally in the browser under `localStorage`.
- The reward image on the quiz result page is fetched from PokeAPI.
- For best results, run the project through a local server rather than opening the HTML files directly.
