# Football Field Reservation Backend

Backend API for football field reservation system built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication (JWT)
- Field management
- Reservation system
- Role-based access control
- Rate limiting
- Input validation
- Error handling

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/football-field-reservation

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Setup

Make sure MongoDB is installed and running on your machine.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Fields
- `GET /api/fields` - Get all fields (with pagination and search)
- `GET /api/fields/:id` - Get field by ID
- `POST /api/fields` - Create new field (admin only)
- `PUT /api/fields/:id` - Update field (admin only)
- `DELETE /api/fields/:id` - Delete field (admin only)

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/my` - Get user reservations
- `GET /api/reservations/all` - Get all reservations (admin only)
- `GET /api/reservations/:id` - Get reservation by ID
- `PUT /api/reservations/:id/cancel` - Cancel reservation

## Default Admin User

After seeding the database, you can login with:
- Email: `admin@footballreservation.com`
- Password: `admin123`

## Database Seeding

To seed the database with sample data:

```bash
npm run seed
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── fieldController.ts
│   │   ├── reservationController.ts
│   │   └── userController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── models/
│   │   ├── Field.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── fields.ts
│   │   ├── reservations.ts
│   │   └── users.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── seedData.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The API uses a consistent error handling format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- Helmet for security headers
