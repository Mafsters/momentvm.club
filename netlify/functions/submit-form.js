const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'role', 'expertise', 'motivation'];
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Missing required field: ${field}` })
        };
      }
    }

    // Create email content
    const emailContent = `
New Application Submission - ${data.form_type || 'Application'}

Name: ${data.name}
Email: ${data.email}
LinkedIn: ${data.linkedin || 'Not provided'}
Role: ${data.role}
Company: ${data.company || 'Not specified'}
Expertise: ${data.expertise}
Motivation: ${data.motivation}
Submission Date: ${data.submission_date || new Date().toLocaleString()}

---
This submission was sent via the Netlify function.
    `;

    // Send email using environment variables
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'momentvmclub@gmail.com',
      subject: `New Application: ${data.name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Application submitted successfully',
        success: true 
      })
    };

  } catch (error) {
    console.error('Form submission error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to submit application. Please try again or contact us directly.'
      })
    };
  }
}; 