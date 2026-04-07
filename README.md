# AI Gateway for OpenAI (Nginx)

Nginx-based API gateway that allows users to access OpenAI with their own auth tokens.

## Setup

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Configure `.env`:
   - Add your OpenAI API key to `OPENAI_API_KEY`
   - Set a secure admin password in `ADMIN_PASSWORD`

3. Start the gateway:
```bash
docker-compose up
```

## Admin Panel

Access the admin panel at `http://localhost:42066/admin.html` to:
- Create user accounts
- Enable/disable user access
- View user tokens
- Delete users

## User Login

Users can login at `http://localhost:42066` to retrieve their API token.

## API Usage

Users make requests to your gateway with their token:

```bash
curl http://localhost:42066/v1/chat/completions \
  -H "Authorization: Bearer <user-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```
