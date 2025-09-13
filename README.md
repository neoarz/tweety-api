# Tweety API

Generate tweet-like images from JSON data.

## Setup

```bash
git clone <repository-url>
cd tweety
npm install
npm run dev
```

## Usage

```bash
curl -X POST http://localhost:3000/api/render \
  -H "Content-Type: application/json" \
  --data '{
    "name": "neo",
    "handle": "@nnneoarz",
    "text": "Hello world!",
    "verified": true
  }' --output tweet.png
```

The API will return a PNG image of the tweet.
