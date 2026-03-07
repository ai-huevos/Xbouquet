import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

async function download(url, dest) {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);

    const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

    const fileStream = fs.createWriteStream(dest, { flags: 'w' });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
    console.log(`Successfully downloaded ${dest}`);
}

async function main() {
    await download('https://upload.wikimedia.org/wikipedia/commons/e/e6/Rosa_rubiginosa_1.jpg', 'public/seeds/red-roses.jpg');
    await download('https://upload.wikimedia.org/wikipedia/commons/b/b5/Dianthus_caryophyllus_-_16.jpg', 'public/seeds/carnations.jpg');
    await download('https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg', 'public/seeds/sunflowers.jpg');
}

main().catch(console.error);
