# WhatsApp Gemini AI Bot (FenoAI)

Gelen WhatsApp mesajlarını yapay zeka ile yanıtlayan, mesaj loglarını kaydeden ve daha birçok özelliğe sahip WhatsApp botudur.

## Özellikler

- **Yapay Zeka Yanıtları**: Google Gemini 1.5 Pro modelini kullanarak akıllı yanıtlar üretir
- **Akıllı Hafıza Sistemi**: Her telefon numarası için ayrı sohbet geçmişi tutar ve önceki konuşmaları hatırlar
- **Bağlamsal Yanıtlar**: Geçmiş konuşmalara referans vererek tutarlı ve mantıklı cevaplar üretir
- **Seçici Yanıtlama**: Sadece `@FenoAI` etiketi ile başlayan mesajları yanıtlar
- **Mesaj Logları**: Her numaraya özel loglar tutar, tüm konuşma geçmişini saklar
- **Otomatik Log Okuma**: Mevcut log dosyalarından geçmiş sohbetleri okur ve hafızaya yükler
- **Hata Yakalama**: API sorunlarını ve bağlantı hatalarını otomatik olarak yönetir
- **Format Kontrol**: Çok kısa veya boş mesajları filtreleyerek gereksiz yanıt vermez
- **Otomatik Yeniden Bağlanma**: Bağlantı koptuğunda otomatik olarak yeniden bağlanır
- **Performans Optimizasyonu**: Her kişi için son 20 mesajı tutarak hafızayı optimize eder

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
const systemPrompt = `Sen yardımcı bir WhatsApp asistanısın. Soruları sanki askerlik arkadaşı gibi bir samimiyetle cevapla. 
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
