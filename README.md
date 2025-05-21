# DMS-Laravel-12-React-Starter-Kit

A web-based Document Management System application was built using the Laravel 12 React Starter Kit. This application allows users to manage documents with versioning, tagging, and document expiration management features.

## Key Features

### Document Management
- Upload various document types (PDF, Word, Excel, PowerPoint)
- Document versioning to track changes
- Tags for document categorization
- Document expiration with expiration notifications
- Preview documents directly in the app
- Document download

### User Management
- User roles (admin & user)
- Admin can create, edit, and delete users
- User status (active/inactive)
- Role-based authentication and authorization

### Technology Used

### Backend
- Laravel 12
- MySQL
- PHP

### Frontend
- React
- TypeScript
- Inertia.js
- Tailwind CSS
- shadcn/ui components

## System Requirements

- PHP 8.1 or higher
- Node.js 16 or higher
- MySQL 5.7 or higher
- Composer
- NPM or Yarn

## Installation

### Installation Steps

1. Clone this repository
   ```bash
   git clone [link-repository]
   cd [folder-name]
   ```

2. Install PHP dependencies
   ```bash
   composer install
   ```

3. Install JavaScript dependencies
   ```bash
   npm install
   ```

4. Copy the .env.example file to .env
   ```bash
   cp .env.example .env
   ```

5. Create an application key
   ```bash
   php artisan key:generate
   ```

6. Configure the database in the .env file

7. Run database migration
   ```bash
   php artisan migrate --seed
   ```

8. Link storage
   ```bash
   php artisan storage:link
   ```

9. Build assets
   ```bash
   npm run build
   ```

10. Run the application
    ```bash
    php artisan serve
    ```

11. Open the application in a browser: http://localhost:8000

## Usage

### Admin Login
- Email: admin@example.com
- Password: password

### User Login
- Email: user@example.com
- Password: password

## Project Structure

- `app/` - Laravel backend code
- `resources/js/` - React/TypeScript frontend code
- `resources/js/pages/` - Application pages
- `resources/js/components/` - Reusable UI components
- `database/migrations/` - Database migrations

## Feature View

### Admin page
- Statistics dashboard
- User management
- Document management

### User Page
- List of available documents
- Document details and previews

## MIT license
