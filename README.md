# Farma Tech Store — E-Commerce Web App

A responsive, front-end e-commerce demo built with **HTML, CSS, and vanilla JavaScript**.

## Features
- Responsive premium dark-blue storefront
- Product catalog with search, category filtering, and sorting
- Product detail modal
- Add-to-cart, quantity controls, remove items, and subtotal
- Cart persisted in browser `localStorage`
- Checkout form that creates a pre-filled WhatsApp order
- Rule-based Farma Assistant chatbot
- Recommended / featured products
- FT brand logo and responsive navigation

## Run locally (Windows)
1. Extract `Farma_Tech_Store.zip`.
2. Open the extracted folder.
3. Double-click `index.html` to open in Chrome or Edge.

For a better local development experience, open the folder in VS Code and use the **Live Server** extension.

## IMPORTANT: Configure WhatsApp checkout
Open `app.js` and find:
```js
const WHATSAPP_NUMBER = "252XXXXXXXXX";
```
Replace it with your shop's WhatsApp number in international format, **digits only**.
Example format for Somalia: `25261XXXXXXX` (do not include `+`, spaces, or dashes).

Until you configure the number, checkout will show a reminder instead of opening WhatsApp.

## Customize products
The sample products are defined near the top of `app.js` in the `products` array. Each product has:
- `id` (unique number)
- `name`
- `category` (Laptops, Phones, Accessories, Networking)
- `price` (USD number)
- `tag`
- `description`
- `image` (image URL)
- `recommend` (true/false)

Change names, prices, descriptions, and image URLs to match your real inventory.

## Publish online (GitHub Pages)
1. Create or sign in to GitHub.
2. Create a new repository, for example `farma-tech-store`.
3. Upload `index.html`, `styles.css`, `app.js`, and the `assets` folder (keep the same structure).
4. In the repository, go to **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select `main` and `/ (root)`, then click **Save**.
7. Wait for GitHub Pages to publish. Your site URL will look like:
   `https://YOUR-USERNAME.github.io/farma-tech-store/`

## Notes
- This version is a front-end project. It does not yet have a database, admin dashboard, inventory management, or online payment gateway.
- WhatsApp checkout sends the order details to the store's WhatsApp. The customer and store team must confirm availability and delivery.
- The chatbot is a lightweight rule-based assistant (no paid AI API required). To connect a true AI chatbot, add a backend and an AI API securely; do not place secret API keys in browser JavaScript.
- Product image URLs require internet access.
