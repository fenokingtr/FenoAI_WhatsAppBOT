# WhatsApp Gemini AI Bot (FenoAI)

Gelen WhatsApp mesajlarını yapay zeka ile yanıtlayan, mesaj loglarını kaydeden ve daha birçok özelliğe sahip WhatsApp botudur.

## Özellikler

- **Yapay Zeka Yanıtları**: Google Gemini 1.5 Pro modelini kullanarak akıllı yanıtlar üretir
- **Seçici Yanıtlama**: Sadece `@FenoAI` etiketi ile başlayan mesajları yanıtlar
- **Mesaj Logları**: Her numaraya özel loglar tutar, tüm konuşma geçmişini saklar
- **Hata Yakalama**: API sorunlarını ve bağlantı hatalarını otomatik olarak yönetir
- **Format Kontrol**: Çok kısa veya boş mesajları filtreleyerek gereksiz yanıt vermez
- **Otomatik Yeniden Bağlanma**: Bağlantı koptuğunda otomatik olarak yeniden bağlanır

### Log Sistemi

Bot, her telefon numarası için ayrı bir log dosyası oluşturur ve şu formatı kullanır:
```
<gün-ay-yıl> <saat.dakika.saniye> <+90***>:"kullanıcı mesajı"
<gün-ay-yıl> <saat.dakika.saniye> <FenoAI>:"yapay zeka yanıtı" 
```

- "@FenoAI" ile başlamayan mesajlar için: `<FenoAI>:"@FenoAI etiketi yok"`
- Tüm mesajlar `/logs/<telefon_numarası>.txt` dosyalarında saklanır

## Kurulum

1. **Gereksinimler**
   - Node.js (v12 veya üstü): https://nodejs.org/
   - Google Gemini API anahtarı

2. **Projeyi İndirme**
   ```
   git clone [https://github.com/fenoking/whatsapp-ai-bot](https://github.com/fenokingtr/FenoAI_WhatsAppBOT).git
   cd whatsapp-ai-bot
   ```

3. **Gerekli Paketleri Yükleme**
   ```
   npm install
   ```

4. **Yapılandırma**
   - `.env` dosyasını oluşturun veya düzenleyin:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

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
     `@FenoAI merhaba, bugün hava nasıl?`
   - Botun yanıtı otomatik olarak gönderilecektir

## Google Gemini API Anahtarı Alma

1. Google AI Studio'ya gidin: https://aistudio.google.com/
2. Google hesabınızla giriş yapın
3. API bölümüne gidip "Get API key" butonuna tıklayın
4. Yeni bir API anahtarı oluşturun
5. Bu anahtarı .env dosyasına yapıştırın

## Özelleştirme

### Yapay Zeka Rolünü Değiştirme

`index.js` dosyasında aşağıdaki kısmı değiştirerek botun kişiliğini özelleştirebilirsiniz:

```javascript
const prompt = `Sen yardımcı bir WhatsApp asistanısın. Soruları nazik ve bilgilendirici bir şekilde cevaplayabilirsin.
              
              Kullanıcı mesajı: ${userMessage}`;
```

### Log Formatını Değiştirme

`index.js` dosyasında `logMessage` fonksiyonunu düzenleyerek log formatını değiştirebilirsiniz.

## Sorun Giderme

- **QR Kod Görünmüyor**: Chromium bağımlılıklarının doğru yüklendiğinden emin olun
- **API Hatası**: Google Gemini API anahtarınızın doğru ve aktif olduğunu kontrol edin
- **Bağlantı Sorunları**: WhatsApp'ın web sürümüne erişebildiğinizi doğrulayın

## Yakında Eklenecek Özellikler

### Premium Sistem

Premium abonelik sistemi yakında eklenecektir ve şu özellikleri içerecektir:
- **Premium kullanıcı**: Sınırsız erişim
- **Grup Desteği**: Grup sohbetlerinde de yapay zekanın yanıt vermesi
- **Zamanlı Mesajlar**: Belirli zamanlarda otomatik mesaj gönderme
- **Medya Anlama**: Resim ve ses dosyalarını anlayıp yanıt üretme

Premium abonelik ücreti, seçilen paket ve özelliklere bağlı olarak değişecektir.

## İletişim

Botla ilgili sorularınız veya geri bildirimleriniz için:
- GitHub: https://github.com/fenokingtr
- E-posta: bedr60kkc@gmail.com

## Lisans

Detaylar için LICENSE dosyasına bakın. 
