const express = require('express');
const Minio = require('minio');

const app = express();
app.use(express.json()); // Gelen JSON body'leri okumak için

const PORT = 3000; // Coolify genellikle bu porta bakar

// 1. MinIO İstemcisini Ayarla
const minioClient = new Minio.Client({
  endPoint: 'api.min.synqbrand.com',
  port: 443,
  useSSL: true,
  accessKey: 'tmrnvz',
  secretKey: 'ygmR_7531*.',
  pathStyle: true,
});

// 2. YENİ EKLENEN SAĞLIK KONTROLÜ (HEALTH CHECK) ENDPOINT'İ
// Coolify'ın uygulamanın çalışıp çalışmadığını anlaması için.
// Bu, '/generate-presigned-url' endpoint'inden ÖNCE olmalı.
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// 3. Presigned URL üretecek olan asıl API endpoint'i
app.post('/generate-presigned-url', async (req, res) => {
  const { fileName } = req.body;
  const bucketName = 'sosyal-medya';
  const expiry = 60 * 10; // 10 dakika

  if (!fileName) {
    return res.status(400).json({ success: false, message: 'fileName is required.' });
  }

  try {
    const presignedUrl = await minioClient.presignedPutObject(bucketName, fileName, expiry);
    res.status(200).json({
      success: true,
      fileName: fileName,
      uploadUrl: presignedUrl,
    });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    res.status(500).json({ success: false, message: 'Failed to generate presigned URL.', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Presigner service listening on port ${PORT}`);
});
