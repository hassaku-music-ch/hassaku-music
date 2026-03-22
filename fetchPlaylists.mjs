import ytpl from 'ytpl';
import fs from 'fs';

const playlists = {
  singles: 'PLz_VA-wkeqIbmnBRfcxgSfN8YGIk4CKyb',
  albums: 'PLz_VA-wkeqIa-nGiMdQRCa5XZm5YaFSEV',
  specials: 'PLz_VA-wkeqIZnQuU1h8W-eyYG80y72pG2'
};

async function fetchAll() {
  const result = {};
  for (const [key, id] of Object.entries(playlists)) {
    try {
      console.log(`Fetching ${key} (${id})...`);
      const list = await ytpl(id, { limit: 100 });
      // Map it to minimal items
      result[key] = list.items.map(item => ({
        id: item.id,
        title: item.title,
        url: item.shortUrl,
        thumbnail: item.bestThumbnail.url
      }));
      console.log(`Fetched ${result[key].length} items for ${key}.`);
    } catch (e) {
      console.error(`Error fetching ${key}: ${e.message}`);
      result[key] = [];
    }
  }
  
  fs.writeFileSync('./src/data.json', JSON.stringify(result, null, 2));
  console.log('Done writing src/data.json');
}

fetchAll();
