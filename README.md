# TruSense

High precision temperature, humidity and air pressure monitoring immutably stored on Hedera; ensuring full transparency and trust.

Live site: [trusense.africa](https://www.trusense.africa)
Login credentials can be found in the private DoraHacks BUIDL details.

Web server repository: [TruSense Web Server](https://github.com/louweal/trusense-web-server)

Device code: [/sensor](https://github.com/louweal/trusense/tree/master/sensor)

### Installation

1. **Clone and install dependencies**

```bash
npm i
```

2. **Set environment variables**

```
HEDERA_NETWORK="testnet"
NODE_ENV="development"
DATABASE_URL="postgresql://..."
JWT_SECRET="<just put a random string here>"
SENDGRID_AP_KEY="..."
```

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
