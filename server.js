const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.post('/invia-prenotazione', (req, res) => {
    const dati = req.body;
    const oggi = new Date();
    const dataViaggio = dati.periodo || `${oggi.getDate()}/${oggi.getMonth() + 1}/${oggi.getFullYear()}`;
    const nomeFile = 'prenotazionedata.txt';
    const riga = `
----- Prenotazione del ${dataViaggio} -----
Partenza: ${dati.partenza}
Numero fermate: ${dati.Num_fermate}
Fermate: ${dati.fermate}
Destinazione: ${dati.destinazione}
Periodo: ${dati.periodo}
Viaggiatori: ${dati.viaggiatori}
Telefono: ${dati.contatto || 'Non fornito'}
Email mittente: ${dati.emailMittente}
-------------------------------------------
`;
    fs.appendFile(nomeFile, riga, (err) => {
        if (err) return res.status(500).json({ message: "Errore nel salvataggio dei dati." });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'TUO_EMAIL@gmail.com',
                pass: 'LA_TUA_PASSWORD_O_APP_PASSWORD'
            }
        });
        const mailOptions = {
            from: 'TUO_EMAIL@gmail.com',
            to: dati.emailMittente,
            subject: 'Conferma Prenotazione Salento',
            text: riga
        };
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log("Errore email:", error);
                return res.json({ message: "Prenotazione salvata, ma email non inviata." });
            } else {
                return res.json({ message: "Prenotazione completata con successo ed email inviata!" });
            }
        });
    });
});
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});
