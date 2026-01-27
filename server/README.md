Express backend for Natah Genesis — minimal endpoints for Cloudinary signing and Projects CRUD (local JSON storage)

Quick start

1. Copy `.env.example` to `.env` and fill with your values (important: put `ADMIN_API_KEY` in `server/.env`).
2. Install:
   - cd server
   - npm install
3. Run in dev:
   - npm run dev
   Or: `ADMIN_API_KEY=your_key npm run dev` to provide the key inline.
   If you want ADMIN disabled for quick testing, you can set `PUBLIC_ADMIN=true` (not recommended for production):
   - `PUBLIC_ADMIN=true npm run dev`
4. Deploy to Replit: set secrets in Replit 'Secrets' (CLOUDINARY_*, ADMIN_API_KEY, etc.)

Endpoints

- GET  /api/health
- POST /api/cloudinary/sign  (header: x-admin-key) body: { folder?, public_id? } -> returns { signature, timestamp, api_key, cloud_name }
- GET  /api/projects
- POST /api/projects  (admin) body: project payload saved to `server/data/projects.json`
- PUT  /api/projects/:id (admin)
- DELETE /api/projects/:id (admin) - deletes JSON row and Cloudinary resource if `cloudinary_public_id` exists

Notes & security

- Keep `CLOUDINARY_API_SECRET` and `ADMIN_API_KEY` secret. Use Replit Secrets / environment variables.
- Current admin guard is a simple shared secret via `x-admin-key`. For production, use proper auth (JWT/session) and a real database.
- This template uses Cloudinary's server-side signature generation so client can do signed uploads without exposing API secret.

Important: Before attempting signed uploads, make sure your Cloudinary credentials are set in `server/.env` (or environment) and the server restarted. Example `server/.env` values:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Quick test for signing endpoint (returns signature, timestamp, api_key, cloud_name):

curl -i -X POST http://localhost:3000/api/cloudinary/sign -H 'Content-Type: application/json' -d '{"folder":"projects","resource_type":"video"}'

If you see `cloud_name: undefined` in the sign response, the server did not read your Cloudinary env vars. Restart the server after updating `server/.env`.

If you prefer to test uploads without server signing, create an unsigned upload preset in Cloudinary and upload directly from the client using `upload_preset` (not recommended for production).

Need a sample admin React page next (upload + use the `/api/cloudinary/sign` endpoint)?