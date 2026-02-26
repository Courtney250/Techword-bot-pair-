const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: xhypher_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

const sessionResults = {};

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    async function xhypher_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_xhypher_Tech = xhypher_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers('Chrome'),
            });

            sessionResults[id] = { status: 'waiting' };

            Pair_Code_By_xhypher_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_xhypher_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    try {
                        await delay(5000);
                        let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                        await delay(1000);
                        let b64data = Buffer.from(data).toString('base64');
                        let sessionId = 'TECHWORLD:~' + b64data;

                        sessionResults[id] = { status: 'connected', sessionId };

                        let session = await Pair_Code_By_xhypher_Tech.sendMessage(Pair_Code_By_xhypher_Tech.user.id, { text: sessionId });

                        let xhypher_MD_TEXT = `
╔════════════════════
║ 🟢 SESSION CONNECTED ◇
║ ✓ BOT: TECHWORD-X
║ ✓ TYPE: BASE64
║ ✓ OWNER: COURTNEY 🦅 
║ ✓SUPPORT: https://t.me/Courtney254
╚════════════════════`;

                        await Pair_Code_By_xhypher_Tech.sendMessage(Pair_Code_By_xhypher_Tech.user.id, { text: xhypher_MD_TEXT }, { quoted: session });
                    } catch (e) {
                        console.log('Error sending session:', e.message);
                        sessionResults[id] = { status: 'error', error: e.message };
                    }

                    setTimeout(() => { delete sessionResults[id]; }, 300000);

                    await delay(100);
                    await Pair_Code_By_xhypher_Tech.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    xhypher_MD_PAIR_CODE();
                }
            });

            if (!Pair_Code_By_xhypher_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const custom = "TECHWORD";
                const code = await Pair_Code_By_xhypher_Tech.requestPairingCode(num, custom);
                if (!res.headersSent) {
                    await res.send({ code, sessionTrackId: id });
                }
            }
        } catch (err) {
            console.log('Service restarted');
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }
    
    return await xhypher_MD_PAIR_CODE();
});

module.exports = router;
module.exports.sessionResults = sessionResults;
