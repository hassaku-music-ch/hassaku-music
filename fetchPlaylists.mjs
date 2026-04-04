import ytpl from 'ytpl';
import fs from 'fs';

const playlists = {
  singles: 'PLz_VA-wkeqIbmnBRfcxgSfN8YGIk4CKyb',
  albums: 'PLz_VA-wkeqIa-nGiMdQRCa5XZm5YaFSEV',
  specials: 'PLz_VA-wkeqIZnQuU1h8W-eyYG80y72pG2'
};

async function fetchAll() {
  const dataFile = './src/data.json';
  let result = {};
  
  // 既存のデータを読み込むことで、エラー時に内容が消えるのを防ぐ
  if (fs.existsSync(dataFile)) {
    try {
      result = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
      console.error('Failed to parse existing data.json');
    }
  }

  for (const [key, id] of Object.entries(playlists)) {
    try {
      console.log(`Fetching ${key} (${id})...`);
      const list = await ytpl(id, { limit: 100 });
      
      if (list && list.items && list.items.length > 0) {
        result[key] = list.items.map(item => ({
          id: item.id,
          title: item.title,
          url: item.shortUrl,
          thumbnail: item.bestThumbnail.url
        }));
        console.log(`Fetched ${result[key].length} items for ${key}.`);
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
