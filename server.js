import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';
import path from 'path';
import ejs from 'ejs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';


config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3367;


// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3367' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting (100 requests/15min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Serve frontend
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Serve the main page with environment variables
app.get('/', (req, res) => {
  res.render('index', {
    process: {
      env: {
        IMG1_PATH: process.env.IMG1_PATH,
        IMG2_PATH: process.env.IMG2_PATH,
        API_URL: process.env.API_URL
      }
    }
  });
});

// API endpoint with validation
app.post(process.env.API_URL, async (req, res) => {
  try {
    // Input validation
    const requiredFields = ['Food', 'Datetime', 'SateBefore', 'SateAfter'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Forward to external API
    const apiResponse = await fetch(process.env.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'xc-token': process.env.API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    // Handle response
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return res.status(apiResponse.status).json(errorData);
    }

    const responseData = await apiResponse.json();
    res.json(responseData);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});