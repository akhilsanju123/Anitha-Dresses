# 🌺 ANITHA DRESSES (వెంకటసాయి అనిత డ్రెస్సెస్) - Premium Fashion E-Commerce Platform

A production-ready luxury fashion e-commerce web platform built for **ANITHA DRESSES** (వెంకటసాయి అనిత డ్రెస్సెస్ - ఫ్యామిలీ షాపింగ్ మాల్) featuring rich Telugu vector typography, deep maroon and royal gold aesthetics, Framer Motion animations, comprehensive product catalog with size/color variant stock, dynamic payment engine (COD, UPI Direct, QR Code Scanner with screenshot upload), dynamic homepage section toggles, printable GST PDF invoices, SEO schema markup, CSV import/export, and complete VPS deployment scripts.

---

## 🌟 Key Features

1. **Telugu Vector Branding**: Scalable SVG vector typography for Telugu text (**వెంకటసాయి**, **అనిత డ్రెస్సెస్**, **ఫ్యామిలీ షాపింగ్ మాల్**) used natively across Navbar, Footer, Mobile Menu, Loader, and Favicon.
2. **Luxury Aesthetics & Animations**: Deep Maroon (`#4A0E17`), Royal Gold (`#D4AF37`), Soft Cream (`#FDFBF7`), dark charcoal accents, Framer Motion transitions, sticky glassmorphic navbar, and smooth scrolling.
3. **Comprehensive Catalog & Multi-Variant Stock**:
   - Categories: *Kids Wear, Ladies Wear, Dress Materials, Nighties, Leggings, Tops, Readymade Long Dresses, Family Collections, Festival Collections*.
   - Brands: *Jockey, Prisma, Daisy Dee, Milton, Fly Birds, Anitha Exclusive, Venkatasai Luxury*.
   - Granular variant stock matrix (`Size` x `Color` x `Stock`) with auto "Out of Stock" triggers, SKU, Barcode, and HSN Code.
4. **Dynamic Payment Engine**:
   - Dynamic Admin Payment Settings saved in database (UPI ID, QR Scanner Image URL, Bank Name, Account Holder, Account Number, IFSC, Branch).
   - QR Scanner Order Flow: Customer scans dynamic QR code, uploads payment receipt screenshot, order placed as `Payment Verification Pending` $\rightarrow$ Admin verifies receipt and upgrades status to `Paid`.
5. **Printable GST PDF Invoices**: Client-side & Admin PDF invoice generator formatted with GST breakdown and billing details.
6. **Full Admin Control Suite**: Sales analytics, order management with QR screenshot reviewer modal, product CRUD, category CRUD, brand manager, pincode delivery manager, low stock alerts, homepage CMS, and database JSON backup/restore.
7. **Pincode Delivery Checker**: Admin can configure serviceable pincodes, estimated delivery days, and area shipping charges.
8. **Pre-filled WhatsApp Enquiries**: "Enquire on WhatsApp" button on product detail pages pre-populating Product Name, Price, and Link.

---

## 🚀 Quick Setup Guide

### 1. Installation
```bash
# Clone or navigate to project directory
cd "c:/Users/sjdig/OneDrive/Desktop/anitha dresses"

# Install all Node.js dependencies
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Initial Admin Credentials

- **Admin Login Page**: [http://localhost:3000/login](http://localhost:3000/login)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email**: `admin@anithadresses.com`
- **Password**: `AdminPass@2026`

---

## 🛠️ Production VPS Deployment (PM2 & Nginx)

### 1. Production Build
```bash
npm run build
```

### 2. PM2 Process Execution
```bash
pm2 start ecosystem.config.js
pm2 save
```

### 3. Nginx Reverse Proxy Setup
Copy `nginx.conf.example` to `/etc/nginx/sites-available/anitha-dresses` and enable:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/anitha-dresses
sudo ln -s /etc/nginx/sites-available/anitha-dresses /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📄 License
© 2026 **వెంకటసాయి అనిత డ్రెస్సెస్ (ANITHA DRESSES)**. All Rights Reserved.
