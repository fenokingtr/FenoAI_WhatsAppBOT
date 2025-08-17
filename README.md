# WhatsApp Gemini AI Bot (FenoAI) v2.0

Gelen WhatsApp mesajlarını yapay zeka ile yanıtlayan, **dosya algılama ve kaydetme sistemi** bulunan, resim oluşturabilen, mesaj loglarını kaydeden ve daha birçok özelliğe sahip gelişmiş WhatsApp botudur.

## 🚀 Özellikler

### 🆕 Yeni Özellikler (v2.0)
- **📁 Akıllı Dosya Algılama**: Gelen tüm dosya türlerini otomatik algılar
- **💾 Otomatik Dosya Kaydetme**: Desteklenen dosyaları uploads klasörüne kaydeder
- **🤖 AI Dosya Analizi**: Gönderilen dosyaları AI ile analiz eder ve açıklar
- **🖼️ Görsel Analizi**: Resimlerin içeriğini detaylı olarak açıklar
- **📋 Geniş Format Desteği**: PNG, JPG, PDF, TXT, DOC, MP4, MP3 ve daha fazlası
- **📅 Akıllı Dosya Adlandırma**: "gün-ay-yıl saat.dakika.saniye +telefon_no.uzantı" formatında
- **🔍 MIME Type Algılama**: Dosya türlerini otomatik tanıma
- **📊 Dosya Bilgi Sistemi**: Boyut, tür ve tarih bilgileriyle birlikte kaydetme

### 🎯 Mevcut Özellikler
- **Çoklu AI Model Desteği**: Google Gemini ailesi modellerini (.env dosyasından seçilebilir)
- **Akıllı Resim Oluşturma**: Gemini 2.0 Flash Preview ile görsel oluşturma
- **Yapay Zeka Yanıtları**: Google Gemini modellerini kullanarak akıllı yanıtlar üretir
- **Akıllı Hafıza Sistemi**: Her telefon numarası için ayrı sohbet geçmişi tutar ve önceki konuşmaları hatırlar
- **Bağlamsal Yanıtlar**: Geçmiş konuşmalara referans vererek tutarlı ve mantıklı cevaplar üretir
- **Seçici Yanıtlama**: Sadece `@FenoAI` etiketi ile başlayan mesajları yanıtlar
- **Mesaj Logları**: Her numaraya özel loglar tutar, tüm konuşma geçmişini saklar
- **Otomatik Log Okuma**: Mevcut log dosyalarından geçmiş sohbetleri okur ve hafızaya yükler
- **Hata Yakalama**: API sorunlarını ve bağlantı hatalarını otomatik olarak yönetir
- **Format Kontrol**: Çok kısa veya boş mesajları filtreleyerek gereksiz yanıt vermez
- **Otomatik Yeniden Bağlanma**: Bağlantı koptuğunda otomatik olarak yeniden bağlanır
- **Performans Optimizasyonu**: Her kişi için son 20 mesajı tutarak hafızayı optimize eder
- **Özelleştirilebilir Prompt**: Bot kişiliği .env dosyasından ayarlanabilir

## 📁 Dosya Sistemi ve Upload Özellikleri

### Desteklenen Dosya Türleri
Bot aşağıdaki dosya türlerini otomatik olarak algılar ve kaydeder:

**🖼️ Resim Formatları:**
- PNG, JPG, JPEG, GIF, WEBP

**📄 Belge Formatları:**
- PDF, TXT, DOC, DOCX

**🎵 Ses Formatları:**
- MP3, WAV, OGG

**🎬 Video Formatları:**
- MP4

### Dosya Adlandırma Sistemi
Gelen dosyalar otomatik olarak şu formatta adlandırılır:
```
gün-ay-yıl saat.dakika.saniye +telefon_numarası.uzantı
```

**Örnek:** `29-07-2025 14.35.22 +905526675397.png`

### Dosya Kaydetme Süreci
1. **Algılama**: Bot gelen mesajda dosya olup olmadığını kontrol eder
2. **İndirme**: Dosya WhatsApp'tan indirilir
3. **Tür Kontrolü**: MIME type ve uzantı kontrol edilir
4. **Kaydetme**: `uploads/` klasörüne kaydedilir
5. **AI Analizi**: Dosya içeriği yapay zeka ile analiz edilir
6. **Akıllı Yanıt**: Kullanıcıya dosya içeriği hakkında detaylı bilgi verilir

### Kullanım Örneği
```
Kullanıcı: [Bir PUBG oyun ekranı gönderir]
FenoAI: �️ **Görsel Analizi**

Bu, PUBG Mobile oyununa ait bir maç sonu ekran görüntüsü. Ekranda "MVP" (Most Valuable Player - En Değerli Oyuncu) yazısı ve oyuncu istatistikleri görülüyor. Oyuncu "FenoKingTRZ" ismiyle MVP seçilmiş. Maçtaki skoru 34 kill, verdiği toplam hasar ise 3379. Oyuncunun rütbesi Platin V. Ekranda, beyaz ve mavi renkli kıyafet giyen kadın karakter avatarı görülüyor.
```

### Klasör Yapısı
```
@FenoAI/
├── uploads/           # Gelen dosyalar burada saklanır
│   ├── <gün-ay-yıl> <saat.dakika.saniye> <Tel NO>.png
│   ├── <gün-ay-yıl> <saat.dakika.saniye> <Tel NO>.pdf
│   └── ...
├── logs/             # Sohbet logları
├── wwebjs_auth/      # WhatsApp oturum verileri
└── index.js          # Ana bot dosyası
```

## 🎨 Resim Oluşturma Sistemi

Bot, aşağıdaki anahtar kelimeleri algıladığında otomatik olarak resim oluşturma moduna geçer:

**Türkçe Komutlar:**
- "resim oluştur", "görsel oluştur", "fotoğraf oluştur"
- "çiz", "çizim yap", "resim yap", "görsel yap"
- "şunu görsele çevir", "bunu çiz", "resim çiz"
- "fotoğraf çek", "görselleştir", "imaj oluştur"

**İngilizce Komutlar:**
- "picture", "image", "draw", "create image"
- "generate image", "make a picture", "visualize", "illustration"

### Kullanım Örnekleri:
```
@FenoAI resim oluştur: güneşli bir deniz manzarası
@FenoAI şunu görsele çevir: uzayda uçan bir ejder
@FenoAI çiz: renkli çiçekler açmış bir bahçe
```

## 💰 Model Fiyatlandırması (1M Token Başına)

### Gemini 2.5 Serisi
- **gemini-2.5-pro**: 
  - ≤200K tokens: Giriş $1.25, Çıkış $10.00
  - >200K tokens: Giriş $2.50, Çıkış $15.00
- **gemini-2.5-flash**: Giriş $0.30, Çıkış $2.50
- **gemini-2.5-flash-lite**: Giriş $0.10, Çıkış $0.40

### Gemini 2.0 Serisi
- **gemini-2.0-flash**: Giriş $0.10, Çıkış $0.40
- **gemini-2.0-flash-preview-image-generation**: 
  - Text: Giriş $0.10, Çıkış $0.40
  - Image: Giriş $0.10, Çıkış $0.039
- **gemini-2.0-flash-lite**: Giriş $0.075, Çıkış $0.30

### Gemini 1.5 Serisi
- **gemini-1.5-pro-latest**: Giriş ~$3.50, Çıkış ~$10.50
- **gemini-1.5-flash-latest**: Giriş ~$0.35, Çıkış ~$1.05
- **gemini-pro**: Giriş ~$0.50, Çıkış ~$1.50

### Gemma Serisi (ÜCRETSIZ)
- **gemma-3n-e2b-it**, **gemma-3n-e4b-it**
- **gemma-3-1b-it**, **gemma-3-4b-it** 
- **gemma-3-12b-it**, **gemma-3-27b-it**

### Deneysel
- **learnlm-2.0-flash-experimental**: Ücretsiz

### Log Sistemi

Bot, her telefon numarası için ayrı bir log dosyası oluşturur ve şu formatı kullanır:
```
<gün-ay-yıl> <saat.dakika.saniye> <+90***>:"kullanıcı mesajı"
<gün-ay-yıl> <saat.dakika.saniye> <FenoAI>:"yapay zeka yanıtı" 
```

- "@FenoAI" ile başlamayan mesajlar için: `<FenoAI>:"@FenoAI etiketi yok"`
- Tüm mesajlar `/logs/<telefon_numarası>.txt` dosyalarında saklanır

### Hafıza Sistemi

Bot artık gelişmiş bir hafıza sistemine sahiptir:

- **Kişisel Hafıza**: Her telefon numarası için ayrı sohbet geçmişi tutulur
- **Otomatik Yükleme**: Bot başlatıldığında mevcut log dosyalarından geçmiş konuşmalar okunur
- **Bağlamsal Yanıtlar**: AI, önceki konuşmaları hatırlayarak daha tutarlı cevaplar verir
- **Akıllı Referanslar**: "Bunu daha önce konuşmuştuk" gibi ifadeler kullanabilir
- **Performans Optimizasyonu**: Her kişi için son 20 mesaj tutularak hafıza optimize edilir

Bu sayede bot:
- Aynı kişiyle yapılan önceki sohbetleri hatırlar
- Tekrar edilen sorulara "Bunu daha önce söylemiştim" diyebilir  
- Daha kişiselleştirilmiş ve tutarlı sohbet deneyimi sunar
- Saçma salak cevaplar vermez, bağlama uygun yanıtlar üretir

## Kurulum

1. **Gereksinimler**
   - Node.js (v14 veya üstü): https://nodejs.org/
   - Google Gemini API anahtarı

2. **Projeyi İndirme**
   ```bash
   git clone https://github.com/fenokingtr/FenoAI_WhatsAppBOT.git
   cd FenoAI_WhatsAppBOT
   ```

3. **Gerekli Paketleri Yükleme**
   ```bash
   # Tüm bağımlılıkları yükle
   npm install
   
   # Veya paketleri manuel olarak yükle
   npm install whatsapp-web.js@latest @google/generative-ai@latest dotenv@latest mime-types@latest qrcode-terminal@latest
   
   # En son sürümlere güncelle
   npm run update-deps
   ```

4. **Yapılandırma**
   - `.env` dosyasını oluşturun veya düzenleyin:
   ```env
   GEMINI_API_KEY=your_api_key_here
   
   # Model seçimi (varsayılan: gemini-1.5-pro)
   GEMINI_MODEL=gemini-2.5-flash
   
   # Resim oluşturma modeli (varsayılan: gemini-2.0-flash-preview-image-generation)
   IMAGE_GENERATION_MODEL=gemini-2.0-flash-preview-image-generation
   
   # Dosya analizi modeli (resim/dosya analizi için)
   # Önerilen: gemini-1.5-flash (hızlı ve ekonomik)
   FILE_ANALYSIS_MODEL=gemini-1.5-flash
   
   # Bot etiketi (mesajların nasıl başlaması gerektiği, varsayılan: @FenoAI)
   BOT_TAG=@FenoAI
   
   # Bot kişiliği (isteğe bağlı, varsayılan prompt kullanılır)
   BOT_PROMPT=Sen yardımcı bir WhatsApp asistanısın...
   ```

### 📦 Güncellenmiş Dependencies (v2.0)
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.3.0",
    "dotenv": "^16.3.1", 
    "mime-types": "^3.0.1",
    "qrcode-terminal": "^0.12.0",
    "whatsapp-web.js": "^1.31.0"
  }
}
```

## 🔧 Yapılandırma Seçenekleri

### Model Seçimi
`.env` dosyasında farklı modeller kullanabilirsiniz:

#### Ana Sohbet Modeli
```env
# Performans odaklı (hızlı ve ekonomik)
GEMINI_MODEL=gemini-2.5-flash-lite

# Kalite odaklı (yavaş ama güçlü)
GEMINI_MODEL=gemini-2.5-pro

# Resim oluşturma destekli
GEMINI_MODEL=gemini-2.0-flash-preview-image-generation

# Ücretsiz seçenekler
GEMINI_MODEL=gemma-3-4b-it
```

#### Dosya Analizi Modeli
```env
# Önerilen (hızlı ve ekonomik)
FILE_ANALYSIS_MODEL=gemini-1.5-flash

# Daha kaliteli analiz (pahalı)
FILE_ANALYSIS_MODEL=gemini-1.5-pro

# En yeni teknoloji (en pahalı)
FILE_ANALYSIS_MODEL=gemini-2.5-flash
```

### Resim Oluşturma Ayarları
```env
# Resim oluşturma için özel model
IMAGE_GENERATION_MODEL=gemini-2.0-flash-preview-image-generation
```

### Bot Kişiliği Özelleştirme
```env
BOT_PROMPT=Senin özel prompt'un buraya gelir...
```

### Bot Etiketi Özelleştirme
```env
# Farklı etiketler kullanabilirsiniz
BOT_TAG=@AI
BOT_TAG=@Asistan
BOT_TAG=@Yardımcı
BOT_TAG=!bot
```

1. Google AI Studio'ya gidin: https://aistudio.google.com/
2. Google hesabınızla giriş yapın
3. API bölümüne gidip "Get API key" butonuna tıklayın
4. Yeni bir API anahtarı oluşturun
5. Bu anahtarı .env dosyasına yapıştırın

## 🎨 Resim Oluşturma Özellikleri

### Desteklenen Komutlar
- **Türkçe**: "resim oluştur", "çiz", "görselleştir", "şunu görsele çevir"
- **İngilizce**: "create image", "draw", "generate picture", "visualize"

### Örnek Kullanımlar
```
@FenoAI resim oluştur: Kırmızı gül bahçesi
@FenoAI çiz: Uzayda yüzen balina
@FenoAI şunu görsele çevir: Neon ışıklı cyberpunk şehir
@FenoAI generate image: Mountain landscape at sunset
```

### Teknik Detaylar
- Resim oluşturma için `gemini-2.0-flash-preview-image-generation` modeli kullanılır
- Türkçe komutlar otomatik olarak İngilizce'ye çevrilir
- Yüksek kaliteli, detaylı görseller oluşturulur

## Kullanım

1. **Botu Başlatma**
   ```
   npm start
   ```

2. **WhatsApp'a Bağlanma**
   - Terminalde görünen QR kodu WhatsApp uygulamanızda "Bağlantılı Cihazlar" bölümünden tarayın
   - Bağlantı kurulduktan sonra bot hazır duruma geçecektir

3. **Mesajlaşma**
   - Bot'a mesaj göndermek için ayarlanan etiketi kullanın (varsayılan: `@FenoAI`):
   ```
   @FenoAI Merhaba, nasılsın?
   @FenoAI Python hakkında bilgi ver
   @FenoAI resim oluştur: güzel bir doğa manzarası
   @FenoAI şunu görsele çevir: uzayda dans eden astronot
   ```
   - Botun yanıtı otomatik olarak gönderilecektir

## 🎯 Kullanım Senaryoları

### Normal Sohbet
```
Kullanıcı: @FenoAI Bugün hava nasıl?
FenoAI: Hava durumu bilgisi veremem ama sana başka konularda yardım edebilirim! 😊
```

### Dosya Gönderme ve AI Analizi
```
Kullanıcı: [Bir PDF dosyası gönderir]
FenoAI: � **PDF Dosyası Alındı**

Dosya başarıyla kaydedildi ve analiz için hazır.
```

### Görsel Analizi
```
Kullanıcı: [Bir oyun ekranı gönderir]
FenoAI: �️ **Görsel Analizi**

Bu, PUBG Mobile oyununa ait bir maç sonu ekran görüntüsü. Ekranda "MVP" (Most Valuable Player - En Değerli Oyuncu) yazısı ve oyuncu istatistikleri görülüyor. Oyuncu "FenoKingTRZ" ismiyle MVP seçilmiş. Maçtaki skoru 34 kill, verdiği toplam hasar ise 3379. Oyuncunun rütbesi Platin V.
```

### Resim Oluşturma
```
Kullanıcı: @FenoAI resim oluştur: sunset over mountains
FenoAI: 🎨 Resim oluşturma isteğiniz işleniyor! [Resim oluşturma süreci...]
```

### Hafıza Sistemi
```
Kullanıcı: @FenoAI Adım ne?
FenoAI: Bunu daha önce söylememiştin, adını öğrenebilir miyim?

(Daha sonra)
Kullanıcı: @FenoAI Adımı hatırlıyor musun?
FenoAI: Tabii ki! Sen [isim], bunu daha önce konuşmuştuk 😊
```

### Desteklenmeyen Dosya Türü
```
Kullanıcı: [.exe dosyası gönderir]
FenoAI: ❌ Üzgünüm, bu dosya türünü desteklemiyorum veya dosya kaydedilirken bir hata oluştu.

📋 **Desteklenen formatlar:**
🖼️ Resimler: PNG, JPG, JPEG, GIF, WEBP
📄 Belgeler: PDF, TXT, DOC, DOCX
🎵 Ses: MP3, WAV, OGG
🎬 Video: MP4
```
     `@FenoAI merhaba, bugün hava nasıl?`
   - Botun yanıtı otomatik olarak gönderilecektir

## ⚡ Performans Optimizasyonu

### Model Seçim Rehberi

**Hız Odaklı (Düşük Maliyet):**
- `gemini-2.5-flash-lite` - En hızlı ve ekonomik
- `gemini-2.0-flash-lite` - Hızlı ve güvenilir
- `gemma-3-1b-it` - Ücretsiz, temel görevler için

**Denge (Orta Seviye):**
- `gemini-2.5-flash` - İyi performans/maliyet dengesi
- `gemini-2.0-flash` - Çok amaçlı kullanım
- `gemma-3-4b-it` - Ücretsiz, gelişmiş özellikler

**Kalite Odaklı (Yüksek Performans):**
- `gemini-2.5-pro` - En gelişmiş model
- `gemini-1.5-pro-latest` - Güvenilir, yüksek kalite

**Resim Oluşturma:**
- `gemini-2.0-flash-preview-image-generation` - Özel resim oluşturma

### Hafıza Optimizasyonu
- Her kullanıcı için son 20 mesaj saklanır
- Log dosyaları otomatik olarak okunur ve hafızaya yüklenir
- Performans için gereksiz veriler temizlenir

## 🛠️ Gelişmiş Özellikler

### Akıllı Resim Algılama
Bot, mesajlardaki şu ifadeleri otomatik algılar:
- Resim/görsel oluşturma istekleri
- Çizim ve görselleştirme komutları  
- Türkçe ve İngilizce resim oluşturma kelimeleri

### Dinamik Model Değiştirme
```env
# Ana sohbet için ekonomik model
GEMINI_MODEL=gemini-2.5-flash-lite

# Resim oluşturma için özel model
IMAGE_GENERATION_MODEL=gemini-2.0-flash-preview-image-generation
```

### Özelleştirilebilir Bot Kişiliği
```env
BOT_PROMPT=Sen profesyonel bir asistansın. Cevaplarını formal ve detaylı ver.
```

1. Google AI Studio'ya gidin: https://aistudio.google.com/
2. Google hesabınızla giriş yapın
3. API bölümüne gidip "Get API key" butonuna tıklayın
4. Yeni bir API anahtarı oluşturun
5. Bu anahtarı .env dosyasına yapıştırın

## Özelleştirme

### Yapay Zeka Rolünü Değiştirme

`index.js` dosyasında aşağıdaki kısmı değiştirerek botun kişiliğini özelleştirebilirsiniz:

```javascript
const systemPrompt = `Sen yardımcı bir WhatsApp asistanısın. Soruları sanki günlük arkadaşınmış gibi tatlı ve sade bir dille cevaplayacaksın ayrıca arada kendini pekiştirmek için argo kullanabilirsin. 
AYRICA SANA KİM OLDUĞUN SORULURSA SEN FenoAI, FenoKingTR | Bedrettin Kökcü'nün WhatsApp asistanıyım diye cevap ver. 

Önceki konuşmalarımızı da hatırla ve buna göre tutarlı cevaplar ver. Aynı soruyu tekrar sorarsa "Bunu daha önce konuşmuştuk" gibi ifadeler kullanabilirsin.`;
```

### Hafıza Sistemini Özelleştirme

Hafıza sisteminin davranışını değiştirmek için:

```javascript
// Hafızada tutulacak mesaj sayısını değiştirme (varsayılan: 20)
if (history.length > 30) {  // 30 mesaj tutmak için
    history.splice(0, history.length - 30);
}

// Geçmiş konuşma formatını değiştirme
const historyContext = conversationHistory
    .map(msg => `${msg.role === 'user' ? 'Sen' : 'Ben'}: ${msg.content}`)
    .join('\n');
```

### Log Formatını Değiştirme

`index.js` dosyasında `logMessage` fonksiyonunu düzenleyerek log formatını değiştirebilirsiniz.

## Sorun Giderme

### Genel Sorunlar
- **QR Kod Görünmüyor**: Chromium bağımlılıklarının doğru yüklendiğinden emin olun
- **API Hatası**: Google Gemini API anahtarınızın doğru ve aktif olduğunu kontrol edin
- **Bot Etiketi Hatası**: `.env` dosyasında `BOT_TAG=@FenoAI` ayarlı olduğundan emin olun
- **Bağlantı Sorunları**: WhatsApp'ın web sürümüne erişebildiğinizi doğrulayın

### Dosya Upload Sorunları
- **Dosya Kaydedilmiyor**: 
  - `uploads/` klasörünün yazma izinleri olduğunu kontrol edin
  - Desteklenen dosya türü gönderdiğinizden emin olun
  - Dosya boyutunun WhatsApp limitleri içinde olduğunu kontrol edin

- **MIME Type Hatası**:
  - `mime-types` paketinin doğru yüklendiğini kontrol edin: `npm list mime-types`
  - Gerekirse yeniden yükleyin: `npm install mime-types@latest`

- **Dosya İndirme Hatası**:
  - İnternet bağlantınızı kontrol edin
  - WhatsApp Web bağlantısının stabil olduğundan emin olun

### Puppeteer Sorunları
- **Puppeteer Protocol Error**: 
  - `.env` dosyasında `PUPPETEER_HEADLESS=false` deneyin
  - `PUPPETEER_TIMEOUT=120000` ile timeout süresini artırın
  - Antivirus yazılımının Chromium'u engellemediğinden emin olun
  - Windows Defender'da WhatsApp bot klasörünü istisna listesine ekleyin

- **Execution Context Destroyed**: 
  - Bot otomatik olarak yeniden başlatılacak
  - Sürekli tekrarlanırsa sistem kaynaklarını kontrol edin
  - Chrome/Chromium süreçlerini Task Manager'dan sonlandırıp tekrar deneyin

### API ve Model Sorunları  
- **Quota/Limit Hatası**: 
  - Ücretsiz sınırına ulaştıysanız `.env` dosyasında `GEMINI_MODEL=gemini-1.5-flash` kullanın
  - API kotanızın yenilenmesini bekleyin
  - Daha az token kullanan modelleri tercih edin

### Hafıza ve Log Sorunları
- **Hafıza Yükleme Hatası**: Log dosyalarının doğru formatta olduğunu kontrol edin
- **Yavaş Yanıt**: Çok uzun geçmiş konuşmalar hafıza boyutunu artırabilir, log dosyalarını temizleyebilirsiniz
- **Tutarsız Cevaplar**: Bot yeniden başlatıldığında geçmiş konuşmalar otomatik olarak yüklenir

### Puppeteer Sorunları İçin Özel Çözümler:
```env
# Debug için tarayıcıyı görünür hale getirin
PUPPETEER_HEADLESS=false

# Timeout süresini artırın (120 saniye)
PUPPETEER_TIMEOUT=120000
```

**Windows'ta Yaygın Sorun:** Antivirus yazılımı Puppeteer'ı engelleyebilir. WhatsApp bot klasörünü antivirus istisna listesine ekleyin.

### Model Önerileri Quota Sorunları İçin:
```env
# En düşük maliyet (ÜCRETLİ ama ekonomik)
GEMINI_MODEL=gemini-1.5-flash

# Orta performans (ÜCRETLİ)  
GEMINI_MODEL=gemini-2.0-flash-lite

# Yüksek performans (ÜCRETLİ ama pahalı)
GEMINI_MODEL=gemini-2.5-pro
```

## Yakında Eklenecek Özellikler

### v2.1 Güncellemesi
- **🔍 Dosya Analizi**: Gönderilen dosyaların içeriğini AI ile analiz etme
- **🖼️ Resim Analizi**: Gönderilen resimleri açıklama ve yorumlama
- **📊 Dosya İstatistikleri**: Upload edilen dosyalar için detaylı istatistikler
- **🗂️ Klasör Organizasyonu**: Dosyaları türlerine göre alt klasörlere ayırma
- **📸 QR Kod Okuma**: Gönderilen resimlerdeki QR kodları okuma

### v3.0 Premium Sistem
Premium abonelik sistemi yakında eklenecektir ve şu özellikleri içerecektir:
- **Çoklu Model Desteği**: Farklı yapay zeka modelleri arasında seçim yapabilme
- **Grup Desteği**: Grup sohbetlerinde de yapay zekanın yanıt vermesi
- **Zamanlı Mesajlar**: Belirli zamanlarda otomatik mesaj gönderme
- **Gelişmiş Medya Anlama**: Video ve ses dosyalarını anlayıp yanıt üretme
- **Özelleştirilmiş Sesler**: Farklı kişilikler ve dil stilleri
- **Veri Senkronizasyonu**: Bulut tabanlı dosya yedekleme sistemi

### Teknik İyileştirmeler
- **⚡ Performans Optimizasyonu**: Dosya işleme hızının artırılması
- **🔒 Güvenlik Güncellemeleri**: Dosya güvenlik kontrollerinin geliştirilmesi
- **📱 Mobil Optimizasyon**: Mobil cihazlarda daha iyi performans
- **🌐 Çoklu Dil Desteği**: İngilizce ve diğer dillerde arayüz

Premium abonelik ücreti, seçilen paket ve özelliklere bağlı olarak değişecektir.

## İletişim

Botla ilgili sorularınız veya geri bildirimleriniz için:
- GitHub: https://github.com/fenokingtr
- E-posta: bedrettinkokcu@gmail.com
- Telefon:: +90 552 667 53 97

## Lisans

Bu proje  AGPL-3.0 lisansı altında lisanslanmıştır. Detaylar için LICENSE dosyasına bakın. 

