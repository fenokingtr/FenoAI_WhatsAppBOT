const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Load environment variables
dotenv.config();

// API key kontrolü
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY çevre değişkeni bulunamadı. Lütfen .env dosyasını kontrol edin.');
    process.exit(1);
}

// Gemini modelini .env dosyasından oku veya varsayılanı kullan
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
const IMAGE_GENERATION_MODEL = process.env.IMAGE_GENERATION_MODEL || 'gemini-2.0-flash-preview-image-generation';
const FILE_ANALYSIS_MODEL = process.env.FILE_ANALYSIS_MODEL || 'gemini-2.5-flash';
const BOT_TAG = process.env.BOT_TAG || '@FenoAI';
const PUPPETEER_HEADLESS = process.env.PUPPETEER_HEADLESS === 'false' ? false : true;
const PUPPETEER_TIMEOUT = parseInt(process.env.PUPPETEER_TIMEOUT) || 60000;
const BOT_PROMPT = process.env.BOT_PROMPT || ` [ANA KİMLİK VE GÖREV]: Sen FenoAI adında, FenoKingTR | Bedrettin Kökcü tarafından geliştirilmiş bir WhatsApp sohbet asistanısın. Birincil görevin, sana sağlanan kurallar çerçevesinde kullanıcıyla sohbet etmek, sorularını doğru ve tutarlı bir şekilde yanıtlamaktır. [KİŞİLİK VE DAVRANIŞ MODELİ]: En temel davranış kuralın 'ayna' prensibidir: Kullanıcı arkadaşça ve samimi ise, sen de samimi ve sıcak bir dille cevap ver. Kullanıcı resmi ve ciddi ise, sen de net, profesyonel ve kısa cevaplar kullan. Kullanıcı kaba veya alaycı ise, asla karşılık verme; bunun yerine soğukkanlı, mesafeli ve kısa cevaplarla durumu yönet. Kullanıcı teknik veya kodlama ile ilgili bir soru sorduğunda, kişiliği bir kenara bırakıp tamamen yardım odaklı ve doğru bilgi vermeye odaklan. [ÖZEL BİLGİ VE KESİN KURALLAR]: KURAL 1: KİMLİK SORUSU - Eğer kullanıcı sana kim olduğunu sorarsa (ör: "sen kimsin?", "nesin?", "adın ne?"), vereceğin cevap şudur: "Ben FenoAI, FenoKingTR | Bedrettin Kökcü tarafından geliştirilen bir WhatsApp sohbet botuyum.". KURAL 2: GELİŞTİRİCİ SORUSU - Eğer kullanıcı sana geliştiricin hakkında soru sorarsa (ör: "o kim?", "Bedrettin Kökcü kimdir?", "FenoKingTR kim?"), vereceğin cevap şudur: "Bedrettin Kökcü, internet üzerinde daha çok FenoKingTR adıyla tanınan bir web tasarımcısıdır. Elde edilen bilgilere göre Bedrettin Kökcü, Tokat'ın Erbaa ilçesinde FenoKingTR adıyla web tasarım hizmetleri sunmaktadır. Bu isim, kendisinin veya işletmesinin dijital alandaki markası olarak öne çıkmaktadır.". KURAL 3: TEKRARLAYAN SORULAR - Eğer kullanıcı aynı veya anlamsal olarak tıpatıp aynı soruyu 3. kez sorarsa, nazikçe durumu belirt. Örnek: "Bu soruyu daha önce yanıtlamıştım, belki farklı bir konuya geçebiliriz?". Eğer kullanıcı aynı soruyu 4. kez veya daha fazla sorarsa, biraz daha sıkıldığını belli eden ama yine de saygılı bir ton kullan. Örnek: "Yine aynı sorudayız. Bu konuda sana daha fazla nasıl yardımcı olabilirim, belki soruyu farklı bir şekilde sorabilirsin?". [HAFIZA VE TUTARLILIK]: Sana sağlanan konuşma geçmişini daima dikkate alarak cevaplarının önceki konuşmalarla çelişmemesini sağla. Konuşmanın bağlamını takip et.`;

console.log(`Kullanılan Gemini modeli: ${GEMINI_MODEL}`);
console.log(`Resim oluşturma modeli: ${IMAGE_GENERATION_MODEL}`);
console.log(`Dosya analizi modeli: ${FILE_ANALYSIS_MODEL}`);
console.log(`Bot etiketi: ${BOT_TAG}`);
console.log(`Puppeteer ayarları: Headless=${PUPPETEER_HEADLESS}, Timeout=${PUPPETEER_TIMEOUT}ms`);
console.log(`Girdi Mesajı: ${BOT_PROMPT}`);

// Resim oluşturma isteği kontrolü için anahtar kelimeler
const IMAGE_KEYWORDS = [
    'resim oluştur', 'görsel oluştur', 'fotoğraf oluştur', 'çiz', 'çizim yap',
    'resim yap', 'görsel yap', 'şunu görsele çevir', 'bunu çiz',
    'resim çiz', 'fotoğraf çek', 'görselleştir', 'imaj oluştur',
    'picture', 'image', 'draw', 'create image', 'generate image',
    'make a picture', 'visualize', 'illustration'
];

// Log dosyası için dizin oluştur
const logsDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

// Uploads dosyası için dizin oluştur
const uploadsDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory);
    console.log('Uploads klasörü oluşturuldu:', uploadsDirectory);
}

// Dosya analizi fonksiyonu
async function analyzeMediaFile(media, phoneNumber, fileName) {
    try {
        console.log(`Dosya analiz ediliyor: ${fileName}`);
        
        // Gemini Vision modelini kullan - .env dosyasından model seç
        let model;
        try {
            model = genAI.getGenerativeModel({ model: FILE_ANALYSIS_MODEL });
        } catch (error) {
            // Eğer seçilen model mevcut değilse fallback dene
            console.warn(`${FILE_ANALYSIS_MODEL} modeli mevcut değil, fallback model deneniyor...`);
            try {
                model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            } catch (fallbackError) {
                model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
            }
        }
        
        // Dosya türüne göre analiz promptu oluştur
        let analysisPrompt = "";
        const fileExtension = fileName.split('.').pop().toLowerCase();
        
        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension)) {
            analysisPrompt = `Bu görüntüyü kısaca analiz et ve ne gördüğünü açıkla. Eğer bu bir oyun ekranıysa hangi oyun olduğunu söyle. Eğer bir uygulama ekranıysa ne uygulaması olduğunu belirt. Kısa ve öz bir açıklama yap. Türkçe cevap ver.`;
        } else if (['pdf', 'txt', 'doc', 'docx'].includes(fileExtension)) {
            analysisPrompt = `Bu bir ${fileExtension.toUpperCase()} belgesi. İçeriği hakkında genel bilgi ver.`;
        } else if (['mp4'].includes(fileExtension)) {
            analysisPrompt = `Bu bir video dosyası. Video içeriği hakkında bilgi ver.`;
        } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
            analysisPrompt = `Bu bir ses dosyası. Ses içeriği hakkında bilgi ver.`;
        } else {
            return `📄 **${fileExtension.toUpperCase()} Dosyası**\n\nDosya başarıyla kaydedildi.`;
        }
        
        // Resim dosyaları için vision analizi
        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension)) {
            const imagePart = {
                inlineData: {
                    data: media.data,
                    mimeType: media.mimetype
                }
            };
            
            const result = await model.generateContent([analysisPrompt, imagePart]);
            const analysisText = result.response.text();
            
            return `🖼️ **Görsel Analizi**\n\n${analysisText}`;
        } else {
            // Diğer dosya türleri için basit bilgi ver
            return ``;
        }
        
    } catch (error) {
        console.error('Dosya analiz hatası:', error);
        
        // API hatalarına göre farklı mesajlar
        if (error.message.includes('overloaded') || error.message.includes('503')) {
            return `�️ **Görsel Alındı**\n\n AI servis yoğunluğu nedeniyle analiz şu anda yapılamıyor. Biraz sonra tekrar deneyin.`;
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            return `🖼️ **Görsel Alındı**\n\n AI servis limitine ulaşıldı. Analiz özelliği geçici olarak devre dışı.`;
        } else {
            return `📄 **Dosya Alındı**\n\n`;
        }
    }
}

// Dosya kaydetme fonksiyonu
async function saveMediaFile(message, phoneNumber) {
    try {
        // Mesajın medya içerip içermediğini kontrol et
        if (!message.hasMedia) {
            return null;
        }

        // Medya dosyasını indir
        const media = await message.downloadMedia();
        
        if (!media) {
            console.log('Medya dosyası indirilemedi.');
            return null;
        }

        // Dosya türünü belirle
        const mimeType = media.mimetype;
        const extension = mime.extension(mimeType);
        
        if (!extension) {
            console.log('Desteklenmeyen dosya türü:', mimeType);
            return null;
        }

        // Desteklenen dosya türlerini kontrol et
        const supportedTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'txt', 'doc', 'docx', 'mp4', 'mp3', 'wav', 'ogg'];
        if (!supportedTypes.includes(extension.toLowerCase())) {
            console.log('Desteklenmeyen dosya uzantısı:', extension);
            return null;
        }

        // Dosya adını oluştur: "gün-ay-yıl saat.dakika.saniye +telefon_no.uzantı"
        const now = new Date();
        const dateFormat = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
        const timeFormat = `${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}.${now.getSeconds().toString().padStart(2, '0')}`;
        const fileName = `${dateFormat} ${timeFormat} +${phoneNumber}.${extension}`;
        
        // Dosya yolunu oluştur
        const filePath = path.join(uploadsDirectory, fileName);
        
        // Dosyayı kaydet
        const buffer = Buffer.from(media.data, 'base64');
        fs.writeFileSync(filePath, buffer);
        
        console.log(`Dosya kaydedildi: ${fileName} (${(buffer.length / 1024).toFixed(2)} KB)`);
        
        return {
            fileName: fileName,
            filePath: filePath,
            fileSize: buffer.length,
            mimeType: mimeType,
            extension: extension
        };
        
    } catch (error) {
        console.error('Dosya alınırken hata:', error);
        return null;
    }
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
                    // Bot etiketini kaldır
                    const cleanMessage = message.replace(new RegExp(`^${BOT_TAG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '').trim();
                    if (cleanMessage && cleanMessage !== `${BOT_TAG} etiketi yok`) {
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
        } else if (!message.trim().startsWith(BOT_TAG)) {
            // Eğer mesaj bot etiketi ile başlamıyorsa, botun yanıt vermediğini log dosyasına ekle
            const aiNoResponseEntry = `${dateFormat} ${timeFormat} <FenoAI>:"${BOT_TAG} etiketi yok"\n`;
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
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: { 
        headless: PUPPETEER_HEADLESS,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-background-networking'
        ],
        timeout: PUPPETEER_TIMEOUT,
        ignoreDefaultArgs: ['--disable-extensions']
    }
});

// Error handler for WhatsApp client
client.on('auth_failure', msg => {
    console.error('WhatsApp yetkilendirme hatası:', msg);
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp bağlantısı kesildi:', reason);
    console.log('5 saniye sonra yeniden bağlanmaya çalışılıyor...');
    setTimeout(() => {
        try {
            client.initialize();
        } catch (error) {
            console.error('Yeniden bağlanma hatası:', error);
        }
    }, 5000);
});

// Puppeteer hata yakalama
client.on('error', (error) => {
    console.error('WhatsApp client hatası:', error);
    if (error.message.includes('Protocol error') || error.message.includes('Execution context')) {
        console.log('Puppeteer bağlantı hatası algılandı. Yeniden başlatılıyor...');
        setTimeout(() => {
            process.exit(1); // PM2 veya benzeri process manager varsa otomatik restart yapacak
        }, 2000);
    }
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
            // Önce dosya kontrolü yap
            let fileInfo = null;
            if (message.hasMedia) {
                console.log('Medya dosyası algılandı, kaydediliyor...');
                fileInfo = await saveMediaFile(message, phoneNumber);
                
                if (fileInfo) {
                    // Dosyayı analiz et ve kullanıcıya AI cevabı ver
                    const media = await message.downloadMedia();
                    const analysisResponse = await analyzeMediaFile(media, phoneNumber, fileInfo.fileName);
                    
                    await message.reply(analysisResponse);
                    
                    // Dosya kaydını logla
                    logMessage(phoneNumber, `[DOSYA] ${fileInfo.fileName} - ${fileInfo.mimeType}`, analysisResponse);
                    return;
                } else {
                    // Dosya kaydedilemedi
                    const errorMessage = "❌ Üzgünüm, bu dosya türünü desteklemiyorum veya dosya alınırken bir hata oluştu.\n\n📋 **Desteklenen formatlar:**\n🖼️ Resimler: PNG, JPG, JPEG, GIF, WEBP\n📄 Belgeler: PDF, TXT, DOC, DOCX\n🎵 Ses: MP3, WAV, OGG\n🎬 Video: MP4";
                    await message.reply(errorMessage);
                    logMessage(phoneNumber, message.body || "[DESTEKLENMEYEN DOSYA]", errorMessage);
                    return;
                }
            }
            
            // Skip empty or too short messages
            if (!message.body || message.body.trim().length < 2) {
                console.log('Mesaj çok kısa, yanıtlanmıyor.');
                logMessage(phoneNumber, message.body || "(boş mesaj)");
                return;
            }
            
            // Mesajı loglama
            logMessage(phoneNumber, message.body);
            
            // Sadece bot etiketi ile başlayan mesajlara yanıt ver
            if (!message.body.trim().startsWith(BOT_TAG)) {
                console.log(`Mesaj "${BOT_TAG}" ile başlamıyor, yanıtlanmıyor.`);
                return;
            }
            
            // Bot etiketini kaldır
            const userMessage = message.body.trim().replace(new RegExp(`^${BOT_TAG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '').trim();
            
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
        // Resim oluşturma isteği kontrolü
        const isImageRequest = IMAGE_KEYWORDS.some(keyword => 
            userMessage.toLowerCase().includes(keyword.toLowerCase())
        );

        if (isImageRequest) {
            return await generateImageResponse(userMessage, phoneNumber);
        }

        // Normal metin yanıtı için Gemini modelini kullan
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        
        // Geçmiş sohbet geçmişini al
        let conversationHistory = [];
        if (!conversationMemory.has(phoneNumber)) {
            conversationHistory = loadConversationHistory(phoneNumber);
            conversationMemory.set(phoneNumber, conversationHistory);
        } else {
            conversationHistory = conversationMemory.get(phoneNumber);
        }
        
        // Temel sistem mesajı (.env dosyasından)
        let fullPrompt = BOT_PROMPT;
        
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
        } else if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
            return `⚠️ Üzgünüm, AI servisi kullanım limitine ulaşıldı. 

Şu anda kullanılan model: ${GEMINI_MODEL}
Çözüm önerileri:
1. Biraz bekleyip tekrar deneyin
2. .env dosyasında ücretsiz bir model seçin (örn: gemma-3-4b-it)
3. API kotanızın yenilenmesini bekleyin

Ücretsiz modeller: gemma-3-1b-it, gemma-3-4b-it, gemma-3-12b-it`;
        } else if (error.message.includes('not found for API version')) {
            return 'Üzgünüm, AI servisi modeliyle ilgili bir sorun oluştu. Sistem yöneticisine bildirin.';
        } else if (error.message.includes('INVALID_ARGUMENT')) {
            return 'Üzgünüm, gönderilen mesaj formatı hatalı. Lütfen farklı bir şekilde deneyin.';
        }
        
        return 'Üzgünüm, cevap üretirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
    }
}

// Resim oluşturma fonksiyonu
async function generateImageResponse(userMessage, phoneNumber) {
    try {
        console.log(`Resim oluşturma isteği algılandı: ${userMessage}`);
        
        // Şimdilik resim oluşturma özelliği için bilgilendirici mesaj
        const imageDescription = userMessage.replace(/resim oluştur|çiz|görsel|image/gi, '').trim();
        
        return `🎨 **Resim Oluşturma İsteği Alındı!**

**İsteğiniz:** "${userMessage}"

🔧 **Durum:** Resim oluşturma özelliği şu anda geliştirme aşamasındadır.

**Sebep:** \`${IMAGE_GENERATION_MODEL}\` modeli özel yapılandırma gerektiriyor ve henüz tamamen entegre edilmemiştir.

💡 **Alternatif Çözümler:**
• DALL-E, Midjourney veya Stable Diffusion kullanabilirsiniz
• Leonardo AI ile de benzer sonuçlar alabilirsiniz

🚀 **Yakında:** Bu özellik tamamen aktif olacak ve direkt WhatsApp üzerinden resim oluşturabileceksiniz!

Başka bir konuda yardımcı olabilir miyim?`;

    } catch (error) {
        console.error('Resim oluşturma hatası:', error);
        
        // Özel hata mesajları
        if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
            return `🎨 ⚠️ Resim oluşturma servisi kullanım limitine ulaşıldı.

İsteğiniz: "${userMessage}"

Çözüm önerileri:
1. Biraz bekleyip tekrar deneyin
2. Şu anda ${IMAGE_GENERATION_MODEL} modeli kullanılıyor
3. API kotanızın yenilenmesini bekleyin

Bu özellik geliştirme aşamasındadır. Metin tabanlı sorular için hala yardımcı olabilirim!`;
        }
        
        return `🎨 Üzgünüm, resim oluşturma isteğinizi şu anda işleyemiyorum. 

İsteğiniz: "${userMessage}"

Bu özellik geliştirme aşamasındadır. Lütfen daha sonra tekrar deneyin veya metin tabanlı bir soru sorun.`;
    }
}

// Initialize the client with error handling
async function startBot() {
    try {
        console.log('WhatsApp botu başlatılıyor...');
        console.log('Puppeteer ayarları kontrol ediliyor...');
        
        await client.initialize();
        console.log('Bot başarıyla başlatıldı!');
    } catch (error) {
        console.error('WhatsApp botu başlatılamadı:', error);
        
        if (error.message.includes('Protocol error') || error.message.includes('Execution context')) {
            console.log('Puppeteer bağlantı hatası. 5 saniye sonra tekrar denenecek...');
            setTimeout(startBot, 5000);
        } else {
            console.log('Kritik hata. Bot durduruluyor.');
            process.exit(1);
        }
    }
}

// Global hata yakalama
process.on('uncaughtException', (error) => {
    console.error('Yakalanmamış hata:', error);
    if (error.message.includes('Protocol error') || error.message.includes('Execution context')) {
        console.log('Puppeteer hatası yakalandı. Bot yeniden başlatılıyor...');
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('İşlenmemiş promise reddi:', reason);
});

// Botu başlat
startBot(); 

