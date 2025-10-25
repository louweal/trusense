# TruSense

### Installation

1. **Clone and install dependencies**

```bash
npm i
```

2. **Set environment variables**

See .env.sample for details.

3. **Push schema to database**

```bash
npx prisma db push

```

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── assets/css/          # Global styles
├── components/          # Vue components
├── composables/         # Vue composables
├── lib/                 # Utilities and services
├── middleware/          # Nuxt middleware
├── pages/               # File-based routing
├── prisma/              # Database schema
├── public/              # Public files
├── sensor/              # Sensor code (for reference)
├── server/api/          # API routes
├── app.vue              # Root component
└── nuxt.config.ts       # Nuxt configuration
```
