// Minecraft Bot Yapılandırması (Aternos Bilgilerine Göre Güncellendi)
function createBot() {
    const bot = mineflayer.createBot({
        host: 'suriboom.aternos.me', // Senin Aternos IP'n
        port: 21431,                  // Senin Aternos Portun
        username: 'DJ_Semazen',       // Botun adı
        version: '1.21.1'             // Senin sunucu sürümün
    });

    let musicInterval;
    let moveInterval;

    bot.on('spawn', () => {
        console.log('DJ Bot başarıyla sahneye çıktı!');

        // 1. HAREKET: Kendi etrafında yuvarlak çizerek dönme ve yürüme
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

        // 2. MÜZİK: Nota sesleri çalma ritmi
        musicInterval = setInterval(() => {
            if (bot.entity) {
                const pitches = [0.5, 0.7, 0.9, 1.0, 1.2, 1.4, 1.6];
                const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
                bot.chat(`/playsound minecraft:block.note_block.harp record @a ~ ~ ~ 1 ${randomPitch}`);
            }
        }, 400); 
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message.toLowerCase() === 'naber') {
            bot.chat(`Naber kanka! Ben DJ Semazen, pistlerin tozunu yutturmaya geldim! 😎🎵`);
        }
    });

    bot.on('end', () => {
        console.log('Bağlantı koptu, tekrar bağlanılıyor...');
        clearInterval(musicInterval);
        clearInterval(moveInterval);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log('Hata:', err);
    });
}