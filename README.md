# AI Gateway for OpenAI

A production-ready API gateway that provides user management, token-based authentication, cost tracking, and custom guardrails for OpenAI API access.

## Features

- **User Management**: Create and manage multiple users with individual access controls
- **Token System**: Each user can create multiple API tokens with custom names and model restrictions
- **Cost Tracking**: Track API costs per user and per token, with optional spending limits
- **Custom Guardrails**: Define content filters using OpenAI's moderation API to block inappropriate requests
- **Vendor Management**: Enable/disable different AI vendors (OpenAI, Anthropic, etc.)
- **Admin Dashboard**: Web-based interface for managing users, viewing logs, and monitoring costs
- **Swagger UI**: Interactive API documentation with request testing
- **Proxy Support**: Route requests through an EC2 proxy for additional control

## Architecture

```
User Request → Nginx (Port 42066) → Auth Service (Node.js) → OpenAI API
                                    ↓
                              Guardrails Check
                              Cost Tracking
                              Token Validation
```

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/edsabi/AI_API_Gateway.git
cd AI_API_Gateway
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
OPENAI_API_KEY=sk-your-openai-key-here
ADMIN_PASSWORD=your-secure-admin-password
PROXY_URL=http://your-ec2-ip:8080  # Optional
```

3. **Build and start**
```bash
docker-compose up -d
```

4. **Access the gateway**
- Admin Panel: `http://localhost:42066/admin.html`
- User Login: `http://localhost:42066`
- API Docs: `http://localhost:42066/swagger.html`

## Admin Panel

Access at `http://localhost:42066/admin.html`

**Features:**
- Create/delete users
- Set cost limits per user
- View all tokens and their usage
- Monitor API costs (API + Guardrail costs)
- Configure custom guardrails
- Manage vendor availability
- View request logs and alerts
- Change admin password

**Hamburger Menu:**
- Create User
- Change Admin Password
- Vendor Limits
- Custom Guardrails
- Logout

## User Workflow

1. **Login**: Users login at `http://localhost:42066` with credentials
2. **Create Token**: Generate API tokens with optional model restrictions
3. **Use Token**: Make API requests using the token
4. **Monitor Usage**: View token usage and costs in the user dashboard

## API Usage

Users make requests to your gateway instead of directly to OpenAI:

```bash
curl http://your-server:42066/v1/chat/completions \
  -H "Authorization: Bearer <user-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Supported Endpoints:**
- `/v1/chat/completions` - Chat completions (streaming supported)
- `/v1/models` - List available models

## Custom Guardrails

Create content filters to block inappropriate requests:

1. Go to Admin Panel → Custom Guardrails
2. Add a new guardrail with:
   - Name (e.g., "No Violence")
   - Category (e.g., "violence")
   - Threshold (0.0 - 1.0)
3. Requests exceeding the threshold are blocked

**Available Categories:**
- hate
- hate/threatening
- harassment
- harassment/threatening
- self-harm
- self-harm/intent
- self-harm/instructions
- sexual
- sexual/minors
- violence
- violence/graphic

## Cost Tracking

The gateway tracks two types of costs:

1. **API Cost**: Actual OpenAI API usage
2. **Guardrail Cost**: Cost of running moderation checks

**Cost Limits:**
- Set per-user spending limits
- Set per-token spending limits
- Automatic blocking when limits are reached
- Real-time cost monitoring in admin panel

## Vendor Management

Enable/disable different AI vendors:

- OpenAI (default)
- Anthropic (coming soon)
- Other vendors can be added

## Token Management

Users can create multiple tokens with:
- Custom names for identification
- Model restrictions (e.g., only allow gpt-4o-mini)
- Individual cost limits
- Usage tracking

## Security Features

- Password-based authentication
- Token-based API access
- Admin password protection
- Environment variable configuration
- No hardcoded credentials
- Request logging and monitoring

## Deployment

**Using Docker Compose:**
```bash
docker-compose up -d
```

**Using Podman:**
```bash
# Create network
podman network create ai-gateway

# Start auth service
podman run -d --name auth --network ai-gateway --env-file .env localhost/ai-gateway-auth:latest

# Start nginx
podman run -d --name nginx --network ai-gateway -p 42066:42066 -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine
```

## Proxy Setup (Optional)

If using an EC2 proxy for additional control:

1. Deploy `proxy-server.js` on an EC2 instance
2. Set `PROXY_URL` in `.env` to your EC2 IP
3. The gateway will route all OpenAI requests through your proxy

See `PROXY-README.md` for detailed proxy setup instructions.

## File Structure

```
AI_API_Gateway/
├── auth-service.js       # Main authentication and proxy service
├── nginx.conf            # Nginx configuration
├── docker-compose.yml    # Docker Compose setup
├── Dockerfile            # Auth service container
├── package.json          # Node.js dependencies
├── .env.example          # Environment template
├── public/
│   ├── admin.html        # Admin dashboard
│   ├── index.html        # User login page
│   ├── tokens.html       # Token management page
│   ├── swagger.html      # API documentation
│   └── guardrails.html   # Guardrails configuration
├── proxy-server.js       # Optional EC2 proxy
└── proxy-package.json    # Proxy dependencies
```

## Troubleshooting

**502 Bad Gateway:**
- Check if both containers are running: `docker ps`
- Restart nginx: `docker restart nginx`

**Authentication Failed:**
- Verify `.env` file has correct credentials
- Check admin password is set

**API Requests Failing:**
- Verify `OPENAI_API_KEY` is valid
- Check `PROXY_URL` if using proxy
- View logs: `docker logs auth`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use and modify for your needs.
