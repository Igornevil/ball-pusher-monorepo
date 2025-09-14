// backend/index.ts
import { startServer } from './server.js';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
startServer(PORT)
  .then(() => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
