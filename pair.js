const { makeid } = require('./id');
const { setSession, deleteSession } = require('./store');
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

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    if (!num) {
        return res.json({ code: 'Please provide a phone number' });
    }
    
    async function xhypher_MD_PAIR_CODE() {
        const tempDir = process.env.VERCEL ? '/tmp' : './temp';
        const { state, saveCreds } = await useMultiFileAuthState(tempDir + '/' + id);
        try {
            let Pair_Code_By_xhypher_Tech = xhypher_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.ubuntu('Chrome'),
            });

            setSession(id, { status: 'waiting' });

            Pair_Code_By_xhypher_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_xhypher_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    try {
                        await delay(5000);
                        let data = fs.readFileSync(`${tempDir}/${id}/creds.json`);
                        await delay(1000);
                        let b64data = Buffer.from(data).toString('base64');
                        let sessionId = 'TRUTH-MD:~' + b64data;

                        setSession(id, { status: 'connected', sessionId });

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
                        setSession(id, { status: 'error', error: e.message });
                    }

                    setTimeout(() => { deleteSession(id); }, 300000);

                    await delay(100);
                    await Pair_Code_By_xhypher_Tech.ws.close();
                    return await removeFile(tempDir + '/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    xhypher_MD_PAIR_CODE();
                }
            });

            if (!Pair_Code_By_xhypher_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const customCodes = ["TECHWORD", "COURTNEY", "TRUTHTRU"];
                const custom = customCodes[Math.floor(Math.random() * customCodes.length)];
                const code = await Pair_Code_By_xhypher_Tech.requestPairingCode(num, custom);
                if (!res.headersSent) {
                    const formatted = code.match(/.{1,4}/g)?.join('-') || code;
                    await res.send({ code: formatted, sessionTrackId: id });
                }
            }
        } catch (err) {
            console.log('Pairing error:', err.message || err);
            await removeFile(tempDir + '/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }
    
    return await xhypher_MD_PAIR_CODE();
});

module.exports = router;
