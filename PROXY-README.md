# OpenAI Proxy Server

Simple proxy to forward requests to OpenAI API.

## Setup on AWS Server

1. Copy files to your AWS server:
```bash
scp proxy-server.js proxy-package.json user@your-aws-server:~/
```

2. On AWS server, install and run:
```bash
npm install --package-lock-only
npm install
PORT=8080 node proxy-server.js
```

Or with PM2 for production:
```bash
npm install -g pm2
pm2 start proxy-server.js --name openai-proxy
pm2 save
```

3. Make sure port 8080 is open in your AWS security group.

4. Test it works:
```bash
curl http://your-aws-server:8080/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

## Update Gateway to Use Proxy

Once the proxy is running, update your gateway's nginx config to point to:
`http://your-aws-server:8080` instead of `https://api.openai.com`
