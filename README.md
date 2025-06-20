# QR Code Generator & Redirect Service

A complete Next.js application that generates dynamic QR codes and provides detailed analytics. Built with Next.js 14+, Prisma ORM, and MySQL.

## Features

- **Multiple QR Code Types**: URLs, PDFs, vCards, messages, and app downloads
- **Dynamic Redirects**: Update destinations without regenerating QR codes
- **Comprehensive Analytics**: Track scans, locations, devices, and usage patterns
- **Smart App Downloads**: Automatic OS detection for app store redirects
- **Production Ready**: Built with modern technologies for scalability

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, React, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **UI**: Tailwind CSS, shadcn/ui components
- **QR Generation**: qrcode npm package

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd qr-redirect-service
```

2. Install dependencies:

```
npm install
```

3. Set up environment variables:

```
cp .env.example .env
```

Edit `.env` with your database connection string:

```
DATABASE_URL="mysql://username:password@localhost:3306/qr_redirect_db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Set up the database:

# Generate Prisma client

```
npm run db:generate
```

# Push schema to database

```
npm run db:push
```

# Or run migrations (for production)

```
npm run db:migrate
```

5. Start the development server:

```
npm run dev
```

Visit `http://localhost:3000` to see the application.

## API Endpoints

### Create Link

```
curl -X POST http://localhost:3000/api/links \
-H "Content-Type: application/json" \
-d '{
"type": "URL",
"destination": "https://example.com"
}'
```

### Create vCard

```
curl -X POST http://localhost:3000/api/links \
-H "Content-Type: application/json" \
-d '{
"type": "VCARD",
"vcard": {
"firstName": "John",
"lastName": "Doe",
"email": "john@example.com",
"phone": "+1234567890"
}
}'
```

### Create App Download

```bash
curl -X POST http://localhost:3000/api/links \
-H "Content-Type: application/json" \
-d '{
"type": "APP_DOWNLOAD",
"appDownload": {
"iosUrl": "https://apps.apple.com/app/example",
"androidUrl": "https://play.google.com/store/apps/details?id=com.example"
}
}'
```

### Get Analytics

```bash
curl http://localhost:3000/api/links/{code}/stats
```

## Database Schema

### Link Model

- `id`: Unique identifier
- `code`: Short URL code (8 characters)
- `type`: Link type (URL, PDF, VCARD, MESSAGE, APP_DOWNLOAD)
- `payload`: Serialized data based on type
- `iosUrl`, `androidUrl`: Optional app store URLs
- `createdAt`, `updatedAt`: Timestamps

### Scan Model

- `id`: Unique identifier
- `linkId`: Reference to Link
- `timestamp`: Scan time
- `ipAddress`: Client IP
- `userAgent`: Browser/device info
- `deviceType`: mobile, tablet, desktop
- `os`: Operating system
- `city`, `country`: Geolocation data

## Deployment

### Production Setup

1. Set up a production MySQL database
2. Update environment variables:

   ```
   DATABASE_URL="mysql://user:pass@host:port/database"
   NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
   ```

3. Run database migrations:

   ```bash
   npm run db:migrate
   ```

4. Build and start:
   ```bash
   npm run build
   npm start
   ```

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

## Usage Examples

### URL Redirect

Create a QR code that redirects to any website. Perfect for marketing campaigns, business cards, or sharing links.

### PDF Downloads

Generate QR codes for direct PDF access. Great for menus, brochures, or document sharing.

### Contact Cards (vCard)

Share contact information that automatically imports into address books when scanned.

### Text Messages

Display custom messages or instructions when the QR code is scanned.

### App Downloads

Smart redirects that detect the user's device and redirect to the appropriate app store.

## Analytics Features

- **Total Scans**: Track overall engagement
- **Geographic Data**: See where your QR codes are being scanned
- **Device Breakdown**: Understand your audience's devices
- **Time Patterns**: Analyze scan activity over time
- **Real-time Tracking**: Monitor scans as they happen

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
