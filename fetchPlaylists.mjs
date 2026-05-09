import https from 'https';
import fs from 'fs';

const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('ERROR: YOUTUBE_API_KEY environment variable is not set.');
  process.exit(1);
}

const playlists = {
  singles: 'PLz_VA-wkeqIbmnBRfcxgSfN8YGIk4CKyb',
  albums: 'PLz_VA-wkeqIa-nGiMdQRCa5XZm5YaFSEV',
  specials: 'PLz_VA-wkeqIZnQuU1h8W-eyYG80y72pG2'
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse JSON: ' + data.slice(0, 200)));
        }
      });
    }).on('error', reject);
  });
}

async function fetchPlaylistItems(playlistId) {
  const items = [];
  let pageToken = '';

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${pageToken ? '&pageToken=' + pageToken : ''}`;
    const data = await fetchJson(url);

    if (data.error) {
      throw new Error(`YouTube API error: ${data.error.message}`);
    }

    for (const item of (data.items || [])) {
      const snippet = item.snippet;
      const videoId = snippet.resourceId.videoId;
      items.push({
        id: videoId,
        title: snippet.title,
        url: `https://youtu.be/${videoId}`,
        thumbnail: (snippet.thumbnails?.maxres || snippet.thumbnails?.high || snippet.thumbnails?.medium || snippet.thumbnails?.default)?.url || ''
      });
    }

    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return items;
}

async function fetchAll() {
  const dataFile = './src/data.json';
  let result = {};

  if (fs.existsSync(dataFile)) {
    try {
      result = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
      console.error('Failed to parse existing data.json, starting fresh.');
    }
  }

  for (const [key, id] of Object.entries(playlists)) {
    try {
      console.log(`Fetching ${key} (${id})...`);
      const items = await fetchPlaylistItems(id);
      if (items.length > 0) {
        result[key] = items;
        console.log(`Fetched ${items.length} items for ${key}.`);
      } else {
        console.log(`No items found for ${key}. Keeping existing data.`);
      }
    } catch (e) {
      console.error(`Error fetching ${key}: ${e.message}. Keeping existing data.`);
    }
  }

  fs.writeFileSync(dataFile, JSON.stringify(result, null, 2));
  console.log('Done writing src/data.json');
}

fetchAll();
