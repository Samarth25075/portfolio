const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // ✅ Your Gmail credentials — use App Password (not your normal Gmail password)
    const EMAIL_USER = 'patel25samarth7@gmail.com';
    const EMAIL_PASS = 'voxc sxyy nyxo sznl'; // 👈 Replace this

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    try {
        // ✅ Email 1: Send to YOU (portfolio owner) — notification of new message
        await transporter.sendMail({
            from: `"Portfolio Contact" <${EMAIL_USER}>`,
            to: 'patel25samarth7@gmail.com',
            subject: `📬 New Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #6c63ff;">New Message from Your Portfolio</h2>
                    <hr style="border-color: #6c63ff;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #6c63ff;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">Sent from your portfolio contact form</p>
                </div>
            `
        });

        // ✅ Email 2: Send confirmation to USER who filled the form
        await transporter.sendMail({
            from: `"Samarth Patel" <${EMAIL_USER}>`,
            to: email,
            subject: `✅ Thanks for reaching out, ${name}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #6c63ff;">Hey ${name}, I got your message! 👋</h2>
                    <hr style="border-color: #6c63ff;">
                    <p>Thank you for getting in touch! I've received your message and will get back to you as soon as possible.</p>
                    
                    <p><strong>Here's a copy of what you sent:</strong></p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #6c63ff;">
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
                    </div>

                    <p style="margin-top: 20px;">In the meantime, feel free to connect with me on:</p>
                    <p>
                        🔗 <a href="https://linkedin.com/in/yourprofile" style="color: #6c63ff;">LinkedIn</a> &nbsp;|&nbsp;
                        💻 <a href="https://github.com/yourprofile" style="color: #6c63ff;">GitHub</a>
                    </p>

                    <p>Talk soon,<br><strong>Samarth Patel</strong></p>
                    <hr style="border-color: #eee;">
                    <p style="color: #999; font-size: 12px;">📧 patel25samarth7@gmail.com | 📞 +91 95586 28810</p>
                </div>
            `
        });

        return res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
    }
};