# 1. Adım: Temel Node.js imajını kullan
# Bu, içinde Node.js ve npm'in hazır olduğu hafif bir Linux imajıdır.
FROM node:18-alpine

# 2. Adım: Uygulama için bir çalışma dizini oluştur
WORKDIR /usr/src/app

# 3. Adım: package.json ve package-lock.json dosyalarını kopyala
# Bu, sadece bağımlılıklar değiştiğinde 'npm install' yapılmasını sağlar (cache optimizasyonu)
COPY package*.json ./

# 4. Adım: Bağımlılıkları kur
RUN npm install

# 5. Adım: Uygulamanın geri kalan kodunu kopyala
COPY . .

# 6. Adım: Uygulamanın dışarıya hizmet vereceği portu belirt
EXPOSE 3000

# 7. Adım: Uygulamayı başlat
CMD [ "node", "server.js" ]
