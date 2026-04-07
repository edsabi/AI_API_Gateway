const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://localhost:3001';

app.all('/v1/*', async (req, res) => {
  const username = req.headers['x-username'] || 'unknown';
  const requestData = req.body;
  
  try {
    const config = {
      method: req.method,
      url: `https://api.openai.com${req.path}`,
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      }
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      config.data = req.body;
    }
    
    const response = await axios(config);
    const responseData = response.data;
    
    // Log to auth service
    axios.post(`${AUTH_SERVICE}/log`, {
      username,
      request: requestData,
      response: responseData
    }).catch(() => {});
    
    res.status(response.status).json(responseData);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: { message: 'Proxy error' } };
    res.status(status).json(data);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Proxy running on port ${PORT}`));
