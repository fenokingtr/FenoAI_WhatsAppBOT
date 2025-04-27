const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// API key kontrolü
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY çevre değişkeni bulunamadı. Lütfen .env dosyasını kontrol edin.');
    process.exit(1);
}

// Log dosyası için dizin oluştur
const logsDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

// Log fonksiyonu - numaraya göre sınıflandır
function logMessage(phoneNumber, message, aiResponse = null, isAIMessage = false) {
    // Telefon numarasına göre log dosyası
    const logFile = path.join(logsDirectory, `${phoneNumber}.txt`);
    
    // Şimdiki zamanı al ve formatla
    const now = new Date();
    const dateFormat = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
    const timeFormat = `${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}.${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Log kaydı oluştur
    let logEntry;
    if (isAIMessage) {
        // AI yanıtı ise
        logEntry = `${dateFormat} ${timeFormat} <FenoAI>:"${aiResponse}"\n`;
    } else {
        // Kullanıcı mesajı ise
        logEntry = `${dateFormat} ${timeFormat} <+${phoneNumber}>:"${message}"\n`;
        
        // Eğer AI yanıtı varsa, AI yanıtını da ekle
        if (aiResponse) {
            const aiLogEntry = `${dateFormat} ${timeFormat} <FenoAI>:"${aiResponse}"\n`;
            fs.appendFileSync(logFile, aiLogEntry);
        } else if (!message.trim().startsWith('@FenoAI')) {
            // Eğer mesaj @FenoAI ile başlamıyorsa, botun yanıt vermediğini log dosyasına ekle
            const aiNoResponseEntry = `${dateFormat} ${timeFormat} <FenoAI>:"@FenoAI etiketi yok"\n`;
            fs.appendFileSync(logFile, aiNoResponseEntry);
        }
    }
    
    // Log dosyasına yaz
    fs.appendFileSync(logFile, logEntry);
    console.log(`Log kaydedildi: ${phoneNumber} - "${message}"`);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize WhatsApp client with better error handling for Puppeteer
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Error handler for WhatsApp client
client.on('auth_failure', msg => {
    console.error('WhatsApp yetkilendirme hatası:', msg);
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp bağlantısı kesildi:', reason);
    console.log('Yeniden bağlanmaya çalışılıyor...');
    client.initialize();
});

// Generate QR code for WhatsApp Web
client.on('qr', (qr) => {
    console.log('QR kod oluşturuldu. Telefonunuzla tarayın:');
    qrcode.generate(qr, { small: true });
});

// On client ready
client.on('ready', () => {
    console.log('WhatsApp botu hazır! Mesajları yanıtlamaya başlıyor...');
});

// Listen for incoming messages
client.on('message', async (message) => {
    // Only respond to direct messages, not group messages
    if (message.from.endsWith('@c.us')) {
        // Mesajı logla (telefon numarası ve mesaj içeriği)
        const phoneNumber = message.from.split('@')[0];
        
        console.log(`Mesaj alındı (${message.from}): ${message.body}`);
        
        try {
            // Skip empty or too short messages
            if (!message.body || message.body.trim().length < 2) {
                console.log('Mesaj çok kısa, yanıtlanmıyor.');
                logMessage(phoneNumber, message.body || "(boş mesaj)");
                return;
            }
            
            // Mesajı loglama
            logMessage(phoneNumber, message.body);
            
            // Sadece "@FenoAI" ile başlayan mesajlara yanıt ver
            if (!message.body.trim().startsWith('@FenoAI')) {
                console.log('Mesaj "@FenoAI" ile başlamıyor, yanıtlanmıyor.');
                return;
            }
            
            // "@FenoAI" etiketini kaldır
            const userMessage = message.body.trim().replace(/^@FenoAI\s*/i, '').trim();
            
            // Get response from AI
            const response = await getGeminiResponse(userMessage);
            
            // Send the AI response back
            await message.reply(response);
            
            // Yanıtı da logla
            logMessage(phoneNumber, message.body, response, true);
            
            console.log(`AI yanıtı gönderildi.`);
        } catch (error) {
            console.error('Mesaj işlenirken hata:', error);
            message.reply('Üzgünüm, mesajınıza cevap verirken bir hata oluştu.');
        }
    }
});

// Function to get a response from Gemini AI
async function getGeminiResponse(userMessage) {
    try {
        // Gemini-1.5-pro modelini deniyoruz
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        // Prompt metin formatında
        const prompt = `Sen yardımcı bir WhatsApp asistanısın. Soruları nazik ve bilgilendirici bir şekilde cevaplayabilirsin.
                      
                      Kullanıcı mesajı: ${userMessage}`;
        
        // Basit API çağrısı formatı
        const chat = model.startChat();
        const result = await chat.sendMessage(prompt);
        // Yanıt metnini doğru şekilde alıyoruz
        return result.response.text() || 'Üzgünüm, bir cevap oluşturamadım.';
    } catch (error) {
        console.error('Gemini API hatası:', error);
        
        // Check for specific error types and give better messages
        if (error.message.includes('API_KEY_INVALID')) {
            return 'Üzgünüm, AI servisine bağlanırken bir yetkilendirme hatası oluştu. Lütfen API anahtarını kontrol edin.';
        } else if (error.message.includes('PERMISSION_DENIED')) {
            return 'Üzgünüm, AI servisi için gerekli izinler bulunamadı.';
        } else if (error.message.includes('RESOURCE_EXHAUSTED')) {
            return 'Üzgünüm, AI servisi kullanım limitine ulaşıldı.';
        } else if (error.message.includes('not found for API version')) {
            return 'Üzgünüm, AI servisi modeliyle ilgili bir sorun oluştu. Sistem yöneticisine bildirin.';
        }
        
        return 'Üzgünüm, cevap üretirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
    }
}

// Initialize the client with error handling
try {
    console.log('WhatsApp botu başlatılıyor...');
    client.initialize();
} catch (error) {
    console.error('WhatsApp botu başlatılamadı:', error);
} 