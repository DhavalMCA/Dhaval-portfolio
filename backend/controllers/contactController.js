const nodemailer = require('nodemailer');

const contacts = []; // In-memory storage (use DB in production)

// Initialize email transporter
let transporter = null;

const initializeTransporter = () => {
  if (transporter) return transporter;

  // Clean app password (remove spaces if any)
  const cleanPassword = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s/g, '').trim() : '';

  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // false for port 587 (TLS), true for port 465 (SSL)
    auth: {
      user: process.env.SMTP_USER,
      pass: cleanPassword
    },
    tls: {
      // In production: verify certificates (rejectUnauthorized: true)
      // In development with self-signed certs: set ALLOW_SELF_SIGNED_TLS=true
      rejectUnauthorized: process.env.ALLOW_SELF_SIGNED_TLS !== 'true'
    }
  };

  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.warn('⚠️ Email not configured. Set SMTP_USER and SMTP_PASS in .env');
    return null;
  }

  transporter = nodemailer.createTransport(smtpConfig);

  return transporter;
};

const verifyTransporter = async () => {
  if (!transporter) {
    transporter = initializeTransporter();
  }

  if (!transporter) {
    return { success: false, error: 'Transporter not initialized' };
  }

  try {
    const result = await transporter.verify();
    console.log('✅ SMTP Connection Verified');
    return { success: true };
  } catch (error) {
    console.error('❌ SMTP Connection Error:', error.message);
    return { success: false, error: error.message };
  }
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

    // Send email if transporter is ready
    if (mailTransporter) {
      try {
        // Verify connection before sending - MUST succeed
        try {
          await mailTransporter.verify();
          console.log('✅ SMTP connection verified');
        } catch (verifyError) {
          console.error('❌ SMTP verify failed:', verifyError.message);
          contact.status = 'failed';
          contacts.push(contact);
          return res.status(503).json({
            success: false,
            message: 'Email service temporarily unavailable. Please try again later.',
            data: { id: contact.id, status: 'failed' }
          });
        }

        // Send email to site owner
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
    } else {
      console.warn('⚠️ Email transporter not initialized - check SMTP credentials');
      contact.status = 'pending';
    }

    // Store contact
    contacts.push(contact);
    console.log('📧 New Contact Submission:', contact);

    res.status(201).json({
      success: true,
      message: contact.status === 'sent'
        ? 'Message received! You will receive a confirmation email shortly.'
        : 'Message received! You will receive a confirmation email soon.',
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

module.exports = { submitContact, getContacts, initializeTransporter, verifyTransporter };