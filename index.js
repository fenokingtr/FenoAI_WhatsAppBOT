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

// Hafıza sistemi - her numara için sohbet geçmişi
const conversationMemory = new Map();

// Log dosyasından geçmiş sohbetleri oku
function loadConversationHistory(phoneNumber) {
    const logFile = path.join(logsDirectory, `${phoneNumber}.txt`);
    
    if (!fs.existsSync(logFile)) {
        return [];
    }
    
    try {
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        const history = [];
        
        lines.forEach(line => {
            // Log formatını parse et: "DD-MM-YYYY HH.MM.SS <Gönderen>:"mesaj""
            const match = line.match(/^\d{2}-\d{2}-\d{4} \d{2}\.\d{2}\.\d{2} <(.+?)>:"(.+)"$/);
            if (match) {
                const sender = match[1];
                const message = match[2];
                
                if (sender === 'FenoAI') {
                    history.push({ role: 'assistant', content: message });
                } else if (sender.startsWith('+')) {
                    // @FenoAI etiketini kaldır
                    const cleanMessage = message.replace(/^@FenoAI\s*/i, '').trim();
                    if (cleanMessage && cleanMessage !== '@FenoAI etiketi yok') {
                        history.push({ role: 'user', content: cleanMessage });
                    }
                }
            }
        });
        
        // Son 20 mesajı al (hafızayı çok büyütmemek için)
        return history.slice(-20);
    } catch (error) {
        console.error(`Geçmiş sohbet yüklenirken hata (${phoneNumber}):`, error);
        return [];
    }
}

// Hafızayı güncelle
function updateConversationMemory(phoneNumber, userMessage, aiResponse) {
    if (!conversationMemory.has(phoneNumber)) {
        conversationMemory.set(phoneNumber, loadConversationHistory(phoneNumber));
    }
    
    const history = conversationMemory.get(phoneNumber);
    
    // Kullanıcı mesajını ekle
    if (userMessage && userMessage.trim()) {
        history.push({ role: 'user', content: userMessage });
    }
    
    // AI yanıtını ekle
    if (aiResponse && aiResponse.trim()) {
        history.push({ role: 'assistant', content: aiResponse });
    }
    
    // Son 20 mesajı tut (performans için)
    if (history.length > 20) {
        history.splice(0, history.length - 20);
    }
    
    conversationMemory.set(phoneNumber, history);
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
            
            // Get response from AI with conversation history
            const response = await getGeminiResponse(userMessage, phoneNumber);
            
            // Hafızayı güncelle
            updateConversationMemory(phoneNumber, userMessage, response);
            
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

// Function to get a response from Gemini AI with conversation memory
async function getGeminiResponse(userMessage, phoneNumber) {
    try {
        // Gemini-1.5-pro modelini kullanıyoruz
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        // Geçmiş sohbet geçmişini al
        let conversationHistory = [];
        if (!conversationMemory.has(phoneNumber)) {
            conversationHistory = loadConversationHistory(phoneNumber);
            conversationMemory.set(phoneNumber, conversationHistory);
        } else {
            conversationHistory = conversationMemory.get(phoneNumber);
        }
        
        // Temel sistem mesajı
        const systemPrompt = `Sen yardımcı bir WhatsApp asistanısın. Soruları sanki askerlik arkadaşı gibi bir samimiyetle cevapla. 
AYRICA SANA KİM OLDUĞUN SORULURSA SEN FenoAI, FenoKingTR | Bedrettin Kökcü'nün WhatsApp asistanıyım diye cevap ver. 
Eğer o Kim Denilirse "Bedrettin Kökcü, internet üzerinde daha çok FenoKingTR adıyla tanınan bir web tasarımcısıdır. 
Elde edilen bilgilere göre Bedrettin Kökcü, Tokat'ın Erbaa ilçesinde "FenoKingTR" adıyla web tasarım hizmetleri sunmaktadır. 
Bu isim, kendisinin veya işletmesinin dijital alandaki markası olarak öne çıkmaktadır." Diyceksin

Önceki konuşmalarımızı da hatırla ve buna göre tutarlı cevaplar ver. Aynı soruyu tekrar sorarsa "Bunu daha önce konuşmuştuk" gibi ifadeler kullanabilirsin.`;
        
        // Sohbet geçmişini dahil ederek prompt oluştur
        let fullPrompt = systemPrompt;
        
        if (conversationHistory.length > 0) {
            fullPrompt += '\n\nGeçmiş konuşmalarımız:\n';
            conversationHistory.forEach(msg => {
                if (msg.role === 'user') {
                    fullPrompt += `Kullanıcı: ${msg.content}\n`;
                } else {
                    fullPrompt += `FenoAI: ${msg.content}\n`;
                }
            });
            fullPrompt += '\nBu geçmiş konuşmaları hatırlayarak şu mesaja cevap ver:\n';
        }
        
        fullPrompt += `\nKullanıcı mesajı: ${userMessage}`;
        
        // Chat'i başlat ve mesajı gönder
        const chat = model.startChat();
        const result = await chat.sendMessage(fullPrompt);
        
        // Yanıt metnini al
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
