const nodemailer = require('nodemailer');

const contacts = []; // In-memory storage (use DB in production)

// Initialize email transporter
let transporter = null;

const initializeTransporter = () => {
  if (transporter) return transporter;
  
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };
  
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.warn('⚠️ Email not configured. Set SMTP_USER and SMTP_PASS in .env');
    return null;
  }
  
  transporter = nodemailer.createTransport(smtpConfig);
  return transporter;
};

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Input validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Text length validation (prevent spam)
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Input text exceeds maximum length'
      });
    }

    // Create contact entry
    const contact = {
      id: contacts.length + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Initialize transporter if not already done
    const mailTransporter = initializeTransporter();

    // Send email to site owner
    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.SMTP_USER,
          subject: `📧 New Portfolio Contact: ${subject}`,
          replyTo: email,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr />
            <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
          `
        });
        
        // Send confirmation to visitor
        await mailTransporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Thank you for contacting Dhaval Prajapati',
          html: `
            <h2>Thank You, ${name}!</h2>
            <p>Your message has been received successfully.</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>I'll get back to you as soon as possible.</p>
            <hr />
            <p>Best regards,<br/>Dhaval Prajapati</p>
          `
        });
        
        contact.status = 'sent';
        console.log('✅ Emails sent successfully for contact:', contact.id);
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError.message);
        contact.status = 'failed';
        // Still save contact even if email fails
      }
    }

    // Store contact
    contacts.push(contact);
    console.log('📧 New Contact Submission:', contact);

    res.status(201).json({
      success: true,
      message: 'Message received! You will receive a confirmation email shortly.',
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        status: contact.status,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Contact submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process contact form. Please try again later.'
    });
  }
};

const getContacts = (req, res) => {
  res.json({
    success: true,
    count: contacts.length,
    data: contacts
  });
};

module.exports = { submitContact, getContacts, initializeTransporter };