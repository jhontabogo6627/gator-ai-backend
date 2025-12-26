# Gator AI Backend (Render)
1) Sube esta carpeta a GitHub (como repo nuevo).
2) En Render: New > Web Service > conecta el repo.
3) Build Command: `npm install`
4) Start Command: `npm start`
5) Environment variables:
   - OPENAI_API_KEY = tu clave
   - OPENAI_MODEL = gpt-4.1-mini (opcional)

Cuando Render te dé la URL (ej: https://gator-ai.onrender.com), tu endpoint será:
https://gator-ai.onrender.com/api/chat
