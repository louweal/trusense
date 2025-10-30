# TruSense

Real-time temperature, humidity and air pressure monitoring immutably stored on Hedera; ensuring full transparency and trust.

-   More information: [Pitch Deck](https://drive.google.com/file/d/1Xeaafw1JANi_bfWfCda7GT82E8Q6FznX/view) or [Demo Video](https://youtu.be/dWivTsuG4xc)
-   Website: [trusense.africa](https://www.trusense.africa)
    -   _Login credentials can be found in the private DoraHacks BUIDL details._
-   Web server repository: [TruSense Web Server](https://github.com/louweal/trusense-web-server)
-   Device code: [/sensor](https://github.com/louweal/trusense/tree/master/sensor)

**Team**

-   louweal
    -   Hashgraph Certificate: [hashgraph-certificate.pdf](https://drive.google.com/file/d/1KwdLJ6-B2PKznUdtZz0NDCHuP-4wM9oy/view)

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
