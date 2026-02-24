// api/send-email.js
// This is a serverless function that runs on Vercel

// You can use any email service. Here are two options:

// OPTION 1: Using Nodemailer (Recommended for Gmail)
// First install: npm install nodemailer

// OPTION 2: Using SendGrid (Free tier available)
// First install: npm install @sendgrid/mail

// For this example, we'll use Nodemailer with Gmail
// To use this, you need to enable "Less secure app access" or use an App Password

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Option 1: Using Email Service API (Recommended for production)
        // You can use services like:
        // - SendGrid (https://sendgrid.com)
        // - Mailgun (https://www.mailgun.com)
        // - AWS SES (https://aws.amazon.com/ses)
        
        // Example with SendGrid:
        /*
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
            to: 'patel25samarth7@gmail.com', // Your email
            from: 'noreply@yourdomain.com', // Verified sender in SendGrid
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        };
        
        await sgMail.send(msg);
        */

        // Option 2: Using Nodemailer with Gmail (Requires Gmail credentials)
        // For production, use environment variables for sensitive data
        
        /*
        const nodemailer = require('nodemailer');
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS  // Your Gmail app password
            }
        });
        
        // Email content
        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: 'patel25samarth7@gmail.com', // Your email
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>This email was sent from your portfolio website.</p>
            `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        */

        // Option 3: Using Resend.com (Modern email API, free tier available)
        // First install: npm install resend
        
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Use your verified domain in production
            to: 'patel25samarth7@gmail.com',
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>This email was sent from your portfolio website.</p>
            `
        });

        // For demo purposes, we'll just log and return success
        console.log('Form submission:', { name, email, subject, message });

        // Return success
        return res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully' 
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to send email. Please try again later.' 
        });
    }
}