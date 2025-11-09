
### NOTE!!!!!!!!!!!!!!!!!!
- DEPSITE THE NAME DONT USE IT AS A STARTER!
- ONLY COPY THE PARTS THAT YOU WANT TO USE!
- I USE IT TO EXPERIMENT NESTJS CONCEPTS!

# NestJS API Starter

A robust starter template for building REST APIs with NestJS, TypeORM, and MySQL. This template includes authentication, user management, email verification, rate limiting, and best practices for configuration and validation.

## Features

- 🚀 [NestJS](https://nestjs.com/) framework with TypeScript
- 🗄️ MySQL database with [TypeORM](https://typeorm.io/)
- 🔒 Authentication with JWT and Passport
- 📧 Email service with Nodemailer
- ✉️ Email verification flow
- 🛡️ Rate limiting and security headers
- ⚙️ Environment configuration with validation (Zod)
- 🔄 Database migrations and seeding

## Prerequisites

- Node.js (>=18.x)
- MySQL/ psql
- pnpm (recommended) or npm

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/samh7/nestjs-api-starter
cd nestjs-api-starter
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
- Database credentials
- JWT secrets
- Email service configuration
- Frontend/Backend URLs

4. Database setup:
```bash
# Run migrations
pnpm migration:run

# Seed the database (optional)
pnpm db:seed
```

5. Start the development server:
```bash
pnpm start:dev
```

The API will be available at `http://localhost:3333` (or your configured PORT)

## Scripts

- `pnpm start:dev` - Start development server with hot-reload
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server
- `pnpm lint` - Lint code
- `pnpm format` - Format code

### Database Scripts
- `pnpm migration:generate` - Generate a new migration
- `pnpm migration:create` - Create a new empty migration
- `pnpm migration:run` - Run pending migrations
- `pnpm migration:revert` - Revert last migration
- `pnpm db:seed` - Seed the database

## Project Structure

```
src/
├── common/              # Shared utilities, configs
│   ├── database/       # Migrations, seeds
│   ├── types/         # Type definitions
│   └── utils.ts       # Utility functions
├── modules/
│   ├── auth/          # Authentication module
│   ├── email/         # Email service module
│   └── users/         # Users module
└── main.ts            # Application entry point
```

## Environment Variables

See [`.env.example`](.env.example) for all available configuration options
## Security

- JWT authentication
- Request rate limiting
- Helmet security headers
- Password hashing with bcrypt
- Email verification

## License

[`MIT LICENSE`](LICENSE)



