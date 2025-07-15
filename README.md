# 📦 myjobb-backend – AI-Powered Product Recommendation API

This is the backend for the **MyJobb** platform. It powers the AI-enhanced product recommendation system, handles user authentication, and serves product data via RESTful APIs.

---

## 🚀 Features

- 🔐 **Secure authentication** using HTTP-only cookies(Email-verification)
- 🧠 **AI-powered product recommendations** using:
  - Vector embeddings
  - Cosine similarity
  - LLMs (Gemini/OpenAI) for reasoning
- 🧾 **RESTful API** with Express.js
- 🌐 **CORS-enabled** for frontend integration
- 📦 **MongoDB** for persistent data
- ⚙️ **TypeScript** for type safety

---

## 🧠 AI-Powered Smart Search

When a user enters a natural language query like:

> _"long-lasting lipstick under $20"_

The backend:

1. Embeds the query using a text embedding model
2. Performs **vector similarity search** against pre-embedded product vectors
3. Uses **LLM (Gemini/OpenAI)** to refine the top matches and generate human-like reasons
4. Returns full product objects with **AI-generated explanations**

---

## 🛠️ Tech Stack

| Technology        | Purpose                             |
|-------------------|-------------------------------------|
| Node.js + Express | Web server & routing                |
| TypeScript        | Type safety                         |
| MongoDB + Mongoose| Database                            |
| LangChain / Gemini| AI & embeddings                     |
| dotenv            | Environment config                  |
| cookie-parser     | Secure cookie handling              |
| CORS              | Cross-origin support                |
| ts-node-dev       | Dev server                          |

---

## 📁 Project Structure


/src
/routes
/middlewares
/models
/controllers
recommend.ts # AI logic
server.ts # Entry point
.env
package.json
tsconfig.json


## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-org/myjobb-backend.git
cd myjobb-backend
npm install


## Create a .env file in the root directory and add the following:
PORT=5000
MONGODB_URI=mongodb+srv://shrerity&appName=Cluster0

SMTP_HOST=smtp.gmail.com
SMTP_USER=shreya@gmail.com
SMTP_PASS="kadywamh"
SMTP_PORT=587

JWT_SECRET=bib3iybwhnn
GOOGLE_API_KEY=AIzaSyAaUj_WSphRCvg5KuhHw

#Development: npm run dev
#Production: npm run build
             npm start
