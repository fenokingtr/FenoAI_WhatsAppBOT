# WhatsApp Gemini AI Bot (FenoAI)

Gelen WhatsApp mesajlarını yapay zeka ile yanıtlayan, resim oluşturabilen, mesaj loglarını kaydeden ve daha birçok özelliğe sahip gelişmiş WhatsApp botudur.

## 🚀 Özellikler

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
   - Node.js (v12 veya üstü): https://nodejs.org/
   - Google Gemini API anahtarı

2. **Projeyi İndirme**
   ```
   git clone https://github.com/fenokingtr/FenoAI_WhatsAppBOT.git
   cd FenoAI_WhatsAppBOT
   ```

3. **Gerekli Paketleri Yükleme**
   ```
   npm install
   # Önce mevcut sürümü kaldırın
   npm uninstall whatsapp-web.js

   # En son kararlı sürümü yükleyin
   npm install whatsapp-web.js@latest
   ```

4. **Yapılandırma**
   - `.env` dosyasını oluşturun veya düzenleyin:
   ```env
   GEMINI_API_KEY=your_api_key_here
   
   # Model seçimi (varsayılan: gemini-1.5-pro)
   GEMINI_MODEL=gemini-2.5-flash
   
   # Resim oluşturma modeli (varsayılan: gemini-2.0-flash-preview-image-generation)
   IMAGE_GENERATION_MODEL=gemini-2.0-flash-preview-image-generation
   
   # Bot kişiliği (isteğe bağlı, varsayılan prompt kullanılır)
   BOT_PROMPT=Sen yardımcı bir WhatsApp asistanısın...
   ```

## 🔧 Yapılandırma Seçenekleri

### Model Seçimi
`.env` dosyasında `GEMINI_MODEL` değişkenini değiştirerek farklı modeller kullanabilirsiniz:

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

### Resim Oluşturma Ayarları
```env
# Resim oluşturma için özel model
IMAGE_GENERATION_MODEL=gemini-2.0-flash-preview-image-generation
```

### Bot Kişiliği Özelleştirme
```env
## 🔑 Google Gemini API Anahtarı Alma

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
   - Bot'a mesaj göndermek için `@FenoAI` etiketini kullanın:
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

- **QR Kod Görünmüyor**: Chromium bağımlılıklarının doğru yüklendiğinden emin olun
- **API Hatası**: Google Gemini API anahtarınızın doğru ve aktif olduğunu kontrol edin
- **Bağlantı Sorunları**: WhatsApp'ın web sürümüne erişebildiğinizi doğrulayın
- **Hafıza Yükleme Hatası**: Log dosyalarının doğru formatta olduğunu kontrol edin
- **Yavaş Yanıt**: Çok uzun geçmiş konuşmalar hafıza boyutunu artırabilir, log dosyalarını temizleyebilirsiniz
- **Tutarsız Cevaplar**: Bot yeniden başlatıldığında geçmiş konuşmalar otomatik olarak yüklenir

## Yakında Eklenecek Özellikler

### Premium Sistem

Premium abonelik sistemi yakında eklenecektir ve şu özellikleri içerecektir:
- **Çoklu Model Desteği**: Farklı yapay zeka modelleri arasında seçim yapabilme
- **Grup Desteği**: Grup sohbetlerinde de yapay zekanın yanıt vermesi
- **Zamanlı Mesajlar**: Belirli zamanlarda otomatik mesaj gönderme
- **Medya Anlama**: Resim ve ses dosyalarını anlayıp yanıt üretme
- **Özelleştirilmiş Sesler**: Farklı kişilikler ve dil stilleri

Premium abonelik ücreti, seçilen paket ve özelliklere bağlı olarak değişecektir.

## İletişim

Botla ilgili sorularınız veya geri bildirimleriniz için:
- GitHub: https://github.com/fenoking
- E-posta: iletisim@fenoai.com

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için LICENSE dosyasına bakın. 
