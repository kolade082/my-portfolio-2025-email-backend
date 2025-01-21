require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5001;

const privateKey = process.env.PRIVATE_KEY; 
const publicKey = process.env.PUBLIC_KEY;   

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', async (req, res) => {
    const { fullname, email, subject, message } = req.body;

    if (!fullname || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailData = {
        service_id: 'service_pf8ial9',  
        template_id: 'template_ud7x99a', 
        user_id: publicKey,              
        template_params: {
            fullname,
            email,
            subject,
            message,
        },
    };

    try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData, {
            headers: {
                Authorization: `Bearer ${privateKey}`,
            },
        });
        res.status(200).json({ message: 'Email sent successfully!', data: response.data });
    } catch (error) {
        console.error('Error sending email:', error.response?.data || error.message);
        console.error('Error details:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
