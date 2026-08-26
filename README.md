# SmartCart 🛒✨
### Next-Generation MERN E-Commerce Platform with Interactive 3D Product Viewer & AI Recommendation Engine

SmartCart is a full-stack, production-grade e-commerce application designed to solve common limitations of traditional e-commerce platforms. Built on the MERN stack (MongoDB, Express.js, React.js, Node.js), SmartCart introduces interactive 3D product previews powered by Three.js / React Three Fiber, personalized product recommendation algorithms driven by user activity, an admin management dashboard with Recharts sales analytics, and security best practices.

---

## 📌 Problem Statement & Limitations of Existing Systems

Traditional e-commerce platforms often struggle with high return rates and sub-optimal customer engagement due to:
1. **Static 2D Product Presentation**: Static product photos fail to provide complete spatial visualization, leading to customer hesitation and unmet product expectations upon delivery.
2. **Generic Product Recommendations**: Static recommendation feeds disregard real-time user browsing habits, search history, cart items, and price preferences.
3. **Lack of Telemetry & Research Analytics**: Store administrators lack empirical telemetry on recommendation click-through rates (CTR) and conversion funnels required for evaluation and strategic optimization.

---

## 💡 Proposed Solution

SmartCart addresses these challenges by combining:
1. **Interactive 3D Product Viewing**: Allows users to rotate, zoom, drag, adjust lighting, and inspect parametric 3D models in real-time right in their browser.
2. **Personalized Recommendation System**: An algorithmic scoring engine in Express.js that analyzes user activities (`view`, `search`, `wishlist`, `cart`, `purchase`) and matches item categories, brands, price tiers, and popularity scores.
3. **Admin Dashboard & System Evaluation Analytics**: Provides administrators with real-time sales overview charts, KPI cards, product CRUD, order lifecycle management, review moderation, and telemetry analytics (CTR, view-to-purchase ratios, search term frequency).

---

## ✨ Features Overview

### 🛍️ Customer Features
- **Hero & Landing Page**: Modern dark/light UI with interactive 3D hero canvas, category grids, featured products, trending items, and promotional banners.
- **Product Catalog**: Multi-attribute filtering (category, price range, brand, minimum rating), instant sorting (price low/high, rating, newest, popularity), search, and pagination.
- **Product Detail Page**: Interactive 3D WebGL viewer toggle, photo gallery, technical specifications, real-time stock status, quantity adjustment, add-to-cart, buy-now, and wishlist toggle.
- **Interactive 3D Viewer**: Built with Three.js & React Three Fiber featuring smooth OrbitControls (rotate, zoom, drag), camera reset, color customization, lighting control, and full-screen mode.
- **Persistent Shopping Cart**: Backend MongoDB persistence for logged-in users and localStorage fallback for guest visitors. Calculates subtotal, discounts, estimated tax, and shipping fees.
- **Wishlist & Cart Transfer**: Save favorite items and transfer items directly from wishlist to shopping cart in one click.
- **Mock Checkout & Payment**: Address form, payment method selection (Credit Card, PayPal, Cash on Delivery), and mock payment gateway processing animation.
- **Order Lifecycle & Tracking**: Track orders through real-time status steps (`Pending` -> `Confirmed` -> `Packed` -> `Shipped` -> `Delivered` -> `Cancelled`).
- **Product Reviews & Ratings**: 1-5 star ratings, review headline, description, rating distribution progress bars, user review edit/delete capabilities, and automatic average rating recalculation.
- **Personalized Recommendations**: "Recommended for You", "You May Also Like", "Similar Products", and "Recently Viewed" sections driven by backend scoring APIs.

### 🛡️ Admin Dashboard & Moderation
- **Dashboard Overview**: KPI stat cards (Total Revenue, Orders, Products, Customers), sales trend charts with Recharts, recent orders table, and top-selling products.
- **Product Management (CRUD)**: Create, edit, and delete products, update stock, modify specs, set pricing/discounts, and configure 3D model properties (`type`, `color`, `accentColor`, `gltfUrl`).
- **Order Management**: View customer orders and update status (`Pending`, `Confirmed`, `Packed`, `Shipped`, `Delivered`, `Cancelled`).
- **User & Role Management**: View users, toggle roles between `user` and `admin`, and enable/disable accounts.
- **Review Moderation**: Moderate and remove inappropriate user reviews.
- **Academic Evaluation Analytics**: Research panel tracking product views, search queries, cart additions, wishlist additions, purchases, and recommendation Click-Through Rate (CTR).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js (v18), Vite, Tailwind CSS, Lucide React Icons, Recharts |
| **3D Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ThemeContext`, `ToastProvider`) |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB (with automated `mongodb-memory-server` fallback) |
| **Security & Auth** | JWT (JSON Web Tokens), `bcryptjs` password hashing, CORS, Express Rate Limiting |
| **API Client** | Axios with request & response interceptors |

---

## 🗄️ Database Architecture & Models

SmartCart uses MongoDB collections connected via Mongoose:
- **`User`**: `name`, `email`, `password` (hashed), `role` (`user` \| `admin`), `isEnabled`, `avatar`, `shippingAddress`.
- **`Product`**: `name`, `slug`, `description`, `price`, `discountPercentage`, `category` (ref Category), `brand`, `images`, `specifications`, `stock`, `averageRating`, `numReviews`, `model3D` (`type`, `color`, `accentColor`, `gltfUrl`), `isFeatured`, `isTrending`, `viewsCount`, `salesCount`.
- **`Category`**: `name`, `slug`, `description`, `image`, `isFeatured`.
- **`Cart`**: `user` (ref User), `items: [{ product: ref Product, quantity: Number }]`.
- **`Wishlist`**: `user` (ref User), `products: [ref Product]`.
- **`Order`**: `user`, `orderItems`, `shippingAddress`, `paymentMethod`, `paymentResult`, `itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice`, `orderStatus` (`Pending` \| `Confirmed` \| `Packed` \| `Shipped` \| `Delivered` \| `Cancelled`), `isPaid`, `paidAt`, `isDelivered`, `deliveredAt`.
- **`Review`**: `user` (ref User), `product` (ref Product), `rating` (1-5), `title`, `comment`.
- **`UserActivity`**: `user`, `product`, `activityType` (`view` \| `search` \| `wishlist` \| `cart` \| `purchase` \| `recommendation_click`), `searchQuery`, `categoryName`, `timestamp`.

---

## 📡 REST API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - Authenticate user & get JWT token
- `GET /api/auth/profile` - Fetch current user profile (Protected)
- `PUT /api/auth/profile` - Update profile & shipping details (Protected)

### Products & Categories
- `GET /api/products` - Fetch products (supports search, category, brand, min/max price, rating, sorting, pagination)
- `GET /api/products/:id` - Fetch single product details
- `GET /api/products/featured` - Fetch featured products
- `GET /api/products/trending` - Fetch trending products
- `GET /api/products/brands` - Fetch distinct brands list
- `GET /api/categories` - Fetch all categories

### Cart & Wishlist
- `GET /api/cart` - Fetch user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:productId` - Update item quantity (Protected)
- `DELETE /api/cart/:productId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear user cart (Protected)
- `GET /api/wishlist` - Fetch user wishlist (Protected)
- `POST /api/wishlist` - Toggle product in wishlist (Protected)
- `DELETE /api/wishlist/:productId` - Remove item from wishlist (Protected)

### Orders
- `POST /api/orders` - Place new order (Protected)
- `GET /api/orders/my-orders` - Fetch customer order history (Protected)
- `GET /api/orders/:id` - Fetch order details by ID (Protected)
- `PUT /api/orders/:id/status` - Update order status (Protected)

### Reviews & Recommendations
- `GET /api/reviews/:productId` - Fetch product reviews & rating distribution
- `POST /api/reviews` - Submit product review (Protected)
- `PUT /api/reviews/:id` - Edit review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)
- `GET /api/recommendations` - Get personalized recommendations & recently viewed
- `GET /api/products/:id/similar` - Get similar products by category & price range
- `POST /api/recommendations/click` - Log recommendation click for CTR telemetry

### Admin & Analytics
- `GET /api/admin/dashboard` - Admin dashboard summary & sales chart data (Admin)
- `GET /api/admin/users` - Fetch all users (Admin)
- `PUT /api/admin/users/:id` - Update user role & status (Admin)
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/admin/orders` - Fetch all orders (Admin)
- `GET /api/admin/reviews` - Fetch all reviews for moderation (Admin)
- `GET /api/analytics` - Fetch evaluation metrics (CTR, conversion funnel, search terms) (Admin)

---

## 🔑 Demo Credentials

For testing and evaluation, quick one-click demo login buttons are provided on the Login page (`/login`), or you can use:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer User** | `user@smartcart.com` | `User@123456` |
| **Administrator** | `admin@smartcart.com` | `Admin@123456` |

---

## ⚡ Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Environment Configuration
Create `server/.env` with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartcart
JWT_SECRET=smartcart_super_secret_jwt_key_2026_production_grade
NODE_ENV=development
```
*(Note: If a local MongoDB instance is not running on port 27017, SmartCart automatically connects to an embedded `mongodb-memory-server` out-of-the-box!)*

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Seed Database
Run the seed script to populate 30+ products, categories, sample reviews, orders, and demo accounts:
```bash
cd server
npm run seed
```

### 4. Run Application
Start the backend Express server and frontend Vite development server:

```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm start

# Terminal 2: Frontend Client (Port 5173)
cd client
npm run dev
```

Access the application in your browser at: **`http://localhost:5173`**

---

## 🎨 3D Model Configuration Setup

SmartCart provides parametric 3D models using Three.js primitives for:
- `headphones` (Spatial audio headset)
- `watch` (Titanium smartwatch)
- `phone` (Flagship smartphone)
- `shoe` (Carbon running shoe)
- `chair` (Ergonomic mesh chair)
- `controller` (Wireless gaming controller)

To link external custom `.glb` / `.gltf` 3D model files:
1. Place `.glb` files in `client/public/models/` (e.g., `client/public/models/headphone.glb`).
2. In the Admin Dashboard (`/admin/products`), set **Model Type** to `Custom GLTF / GLB` and provide the URL path (e.g., `/models/headphone.glb`).

---

## 🚀 Future Enhancements
1. Stripe / PayPal real payment gateway SDK integration.
2. WebSockets for real-time order status tracking notifications.
3. AR (Augmented Reality) WebXR preview for smart home furniture placing.
