# OneFlix

**OneFlix** is a modern web application for discovering, searching, and managing anime collections. Built with Next.js, TypeScript, Redux, and SASS, it offers a smooth user experience for anime fans to browse

---

## Features

- **Anime Catalog**: Browse a large collection of anime with detailed information.
- **Advanced Search & Filters**: Search by title, genre, type (TV, movie, OVA, etc.), period, status, and more.
- **Personal Library**: Authenticated users can manage their own anime collection and purchase history.
- **Responsive UI**: Clean, modern interface styled with SASS and enhanced by Tailwind CSS utilities.
- **Pagination**: Easily navigate through large lists of anime.
- **Authentication**: Secure login and registration system.
- **Redux State Management**: Efficient global state handling for user data, genres, and more.
- **Loading Skeletons**: Smooth loading experience with animated placeholders.
- **React Icons**: Beautiful icons for actions and navigation.

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Redux Toolkit**
- **SASS** (with modular structure)
- **React Icons**
- **Jikan API** (for anime data)

---

## Project Structure

```
src/
  app/           # Next.js pages and routes (including authentication, anime pages, library, etc.)
  components/    # Reusable React components (cards, buttons, nav, etc.)
  features/      # Redux slices and async logic
  lib/           # Utility functions and API calls
  store/         # Redux store configuration
  styles/        # SASS stylesheets and variables
  types/         # TypeScript type definitions
  assets/        # Static assets (images, icons)
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/oneflix.git
cd oneflix
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Or click on this link <a href="https://projet-oneflix.vercel.app/" style="display:inline-block;padding:0.75rem 2rem;background:#e53e3e;color:#fff;border-radius:5px;font-weight:600;text-decoration:none;margin-top:1rem;">Launch OneFlix</a>

---

## Customization

- **Styling**: Edit SASS files in `src/styles/` and component-level styles as needed.
- **API**: The app uses the Jikan API for anime data. You can swap or extend this in `src/lib/fetchAnime.ts`.
- **Authentication**: NextAuth is used for authentication. Configure providers in `src/app/api/auth/[...nextauth]/route.ts`.

---

## Scripts

- `dev` – Start the development server
- `build` – Build the app for production
- `start` – Start the production server

---

## Credits

- Anime data provided by [Jikan API](https://jikan.moe/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- **UI/UX inspired by [Crunchyroll](https://www.crunchyroll.com/)**
