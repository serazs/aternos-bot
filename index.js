const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Render'ın açık kalması için web sunucusu (Sürekli aktif kalacak)
app.get('/', (req, res) => {
    res.send('DJ Bot Arka Planda Calisiyor!');
});

app.listen(PORT, () => {
    console.log(`Web sunucu ${PORT} portunda baslatildi.`);
});

// ÇÖKMEYİ ENGELLEYEN ALTIN DOKUNUŞ:
// Ne hata olursa olsun bu kod Render'ın kapanmasını engeller!
process.on('uncaughtException', (err) => {
    console.log('Sistem hatayı yakaladı ve çökme engellendi:', err.message);
});

function createBot() {
    console.log('Aternos sunucusuna baglanmaya calisiliyor...');

    const bot = mineflayer.createBot({
        host: 'suriboom.aternos.me', 
        port: 21431,                  
        username: '.DJ_Semazen',       
        version: '1.21.1'
    });

    let musicInterval;
    let moveInterval;

    bot.on('spawn', () => {
        console.log('DJ Bot basariyla sunucuya giris yapti! Sahne onun!');

        // 1. HAREKET: Yuvarlak çizerek dönme
        let angle = 0;
        moveInterval = setInterval(() => {
            if (bot.entity) {
                angle += 0.2; 
                bot.look(angle, 0, true);
                bot.setControlState('forward', true);
                
                if (Math.random() < 0.15) {
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                }
            }
        }, 100);

        // 2. MÜZİK: Nota sesleri çalma
        musicInterval = setInterval(() => {
            if (bot.entity) {
                const pitches = [0.5, 0.7, 0.9, 1.0, 1.2, 1.4, 1.6];
                const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
                bot.chat(`/playsound minecraft:block.note_block.harp record @a ~ ~ ~ 1 ${randomPitch}`);
            }
        }, 400); 
    });

    // Bağlantı koparsa veya sunucu kapalıysa tetiklenir, çökmeden 15 saniye sonra tekrar dener
    bot.on('end', () => {
        console.log('Baglanti koptu. 15 saniye sonra tekrar baglanilacak...');
        clearInterval(musicInterval);
        clearInterval(moveInterval);
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => {
        console.log('Bağlantı hatası alındı (Sunucu kapalı olabilir):', err.message);
    });
}

// Botu başlat
createBot();
