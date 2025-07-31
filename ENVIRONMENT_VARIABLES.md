# Environment Variables Documentation

## Required Environment Variables

### Backend Variables (Node.js)
- `DB_HOST` - Database host (from Render database service)
- `DB_PORT` - Database port (from Render database service)
- `DB_NAME` - Database name (from Render database service)
- `DB_USER` - Database username (from Render database service)
- `DB_PASS` - Database password (from Render database service)
- `JWT_SECRET` - Secret key for JWT token generation (auto-generated on Render)
- `PORT` - Server port (set to 10000 on Render)
- `NODE_ENV` - Environment (set to 'production' on Render)

### Frontend Variables (React)
- `REACT_APP_API_URL` - API base URL (set to Render service URL)

## Local Development Setup

Create a `.env` file in the backend directory with:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_app
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

Create a `.env` file in the frontend directory with:

```
REACT_APP_API_URL=http://localhost:5000
```

## Render Deployment

The `render.yaml` file automatically configures all required environment variables for production deployment. 