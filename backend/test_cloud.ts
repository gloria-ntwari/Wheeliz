import { v2 as cloudinary } from 'cloudinary';
import AdmZip from 'adm-zip';

cloudinary.config({
  cloud_name: 'dikq9s0ny',
  api_key: '812499392713856',
  api_secret: '_y3oXUS2XIReU14hXdvTxGYyAdw'
});

async function main() {
  const publicId = 'wheeliz/submissions/q8mhzzi2nr5ikie2gqz0';
  const originalExtension = 'pdf';

  console.log('[Download Proxy] Public ID:', publicId, 'Extension:', originalExtension);

  // Fetch via Cloudinary's generate_archive API
  const archiveUrl = cloudinary.utils.download_zip_url({
    public_ids: [publicId],
    resource_type: 'image',
    target_format: 'zip'
  });

  console.log('[Download Proxy] Fetching archive...', archiveUrl);
  const archiveResponse = await fetch(archiveUrl);

  if (!archiveResponse.ok) {
    console.error(`[Download Proxy] Archive fetch failed: ${archiveResponse.status}`);
    return;
  }

  try {
    console.log("Reading arrayBuffer...");
    const arrayBuffer = await archiveResponse.arrayBuffer();
    console.log("Buffer size:", arrayBuffer.byteLength);
    
    console.log("Creating buffer...");
    const zipBuffer = Buffer.from(arrayBuffer);
    
    console.log("Parsing zip...");
    const zip = new AdmZip(zipBuffer);
    
    console.log("Getting entries...");
    const zipEntries = zip.getEntries();
    console.log(`Found ${zipEntries.length} entries`);

    const pdfEntry = zipEntries.find(entry =>
      entry.entryName.toLowerCase().endsWith('.pdf')
    ) || zipEntries[0];

    if (!pdfEntry) {
      console.error('No file found in archive');
      return;
    }

    const pdfBuffer = pdfEntry.getData();
    console.log(`[Download Proxy] Extracted "${pdfEntry.entryName}" (${pdfBuffer.length} bytes)`);

  } catch (err: any) {
    console.error("ZIP Error:", err.message);
  }
}

main();
