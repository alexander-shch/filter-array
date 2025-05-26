# Filter Array React App

A modern, type-safe, and modular filter system for React applications. This project demonstrates a flexible filter list renderer with type inference, custom filter support, and a beautiful UI using React Router and Vite.

## Features

- 🚀 Modular filter components (select, checkbox, text, custom)
- 🧑‍💻 Type-safe state inferred from filter config
- 🧩 Custom filter support with type inference
- 💎 Modern UI: filter chips, popovers, and code modals
- ⚡️ Vite, React Router, and TypeScript
- 🐳 Docker support
- 🌐 Ready for GitHub Pages deployment

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Building for Production

Create a production build:

```bash
npm run build
```

### Docker

To build and run using Docker:

```bash
docker build -t filter-array .

# Run the container
docker run -p 3000:3000 filter-array
```

## Usage Example

```tsx
import { FilterList } from "./filters/FilterList";
import { createCustomFilter } from "./filters/types";
import type { FilterStateFromConfig } from "./filters/types";

const filterConfig = [
  { type: "select", label: "Gender", name: "gender", properties: { options: [ { text: "Female", value: "female" }, { text: "Male", value: "male" } ] } },
  { type: "checkbox", label: "Active", name: "active" },
  { type: "text", label: "Name", name: "name" },
  createCustomFilter<number>({
    label: "Custom Age",
    name: "age",
    render: (value, onChange) => (
      <input type="number" value={value ?? ''} onChange={e => onChange(Number(e.target.value))} placeholder="Age" />
    ),
  }),
] as const;

const [filters, setFilters] = useState<FilterStateFromConfig<typeof filterConfig>>({});

<FilterList config={filterConfig} value={filters} onChange={setFilters} />
```

## GitHub Pages

To deploy to GitHub Pages:

1. Add the following to your `vite.config.ts`:

```ts
export default defineConfig({
  base: '/filter-array/', // or your repo name
  // ...other config
});
```

2. Build and deploy:

```bash
npm run build
npx gh-pages -d dist
```

Or use GitHub Actions for CI/CD.

---

Built with ❤️ by [alexander-shch](https://github.com/alexander-shch) and contributors.
