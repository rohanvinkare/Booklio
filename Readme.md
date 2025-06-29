# 📚 Booklio

**Booklio** is an all-in-one modern platform where users can **search, explore, and order books** from multiple sellers with ease. It bridges readers and sellers through a fast, reliable, and user-friendly interface.

Visit the live site: 👉 [https://booklio.codenix.space](https://booklio.codenix.space)

---

## 🌐 About Booklio

Booklio simplifies the experience of finding and ordering books:

- 🔍 **Search Books**: Integrated with Google Books API to provide rich metadata.
- 📘 **Detailed Listings**: See complete book info along with seller details and pricing.
- 🛒 **Place Orders**: Add shipping info and place orders with just a few clicks.
- 📦 **Track Orders**: Order status management (Placed, Pending, Cancelled, Completed).
- 🧾 **Order History**: Full view of past purchases.
- ⚡ **Performance Optimized**: Built for speed, with caching and CDN integrations.
- 📱 **Responsive Design**: Fully mobile-optimized for seamless usage on any device.

---

## 🧱 Tech Stack

### **Frontend**
- React.js + Vite
- Tailwind CSS
- ShadCN/UI Components
- Lucide Icons

### **Backend**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Redis (for caching)
- RESTful API design
- Google Books API
- SMTP via Google (GCC) for email communication

### **Deployment**
- Docker / DockerHub
- GitHub Actions (CI/CD)
- EC2 (Backend)
- S3 + Cloudfront 
- Cloudflare DNS
- NGINX (Reverse Proxy)

---

## 🛠️ Setup Instructions

### 📦 Prerequisites

- Node.js (v18+)
- MongoDB (Atlas)
- Git

### 🖥️ Clone the Repository

```bash
git clone https://github.com/rohanvinkare/Booklio.git
cd booklio
````

---

### 🔧 Backend Setup

```bash
cd backend
npm install
```

> ⚠️ **Important**: Create a `.env` file in the `backend/` directory with the following variables:

```env

PORT= # App port
MONGODB_URL= # MongoDB connection string
ACCESS_TOKEN_SECRET= # JWT secret for access tokens
SMTP_MAIL=
SMTP_PASSWORD=
SMTP_HOST=
SMTP_PORT=
APP_CLOUDINARY_CLOUD_NAME=
APP_CLOUDINARY_API_KEY=
APP_CLOUDINARY_SECRET_KEY=
# Email verification & password reset links
MAIL_VERIFICATION=
FORGOT_URL=
googleapis_key= # Google API key (maps, captcha, etc.)
PAY_CUT_PERCENTAGE= # Admin commission percentage on payments
# REDIS_HOST=redis     
REDIS_HOST=             
REDIS_PORT=

```

```bash
# Start backend
node server.js
```

---

### 💻 Frontend Setup

> ⚠️ **Important**: Create a `.env` file in the `frontend/` directory with the following variables:

```env
# Backend Hosted Link 
VITE_BASE_URL= 
```

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173)

---

## 📬 Contact

* Email: [rohanvinkare2022@gmail.com](rohanvinkare2022@gmail.com)
* GitHub: [rohanvinkare](https://github.com/rohanvinkare)

---

Made with ❤️ for book lovers.