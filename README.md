# Tweety API

Generate tweet-like images from JSON data.

## Setup

```bash
git clone https://github.com/neoarz/tweety-api.git
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
    "verified": true,
    "avatar": "https://pbs.twimg.com/profile_images/1861654281922715648/gjj33VdC_400x400.jpg"
  }' --output tweet.png
```

The API will return a PNG image of the tweet. You can customize the profile image by providing an `avatar` URL.
