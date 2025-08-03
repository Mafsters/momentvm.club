# Email Functionality Setup Guide

## Overview
The email functionality has been improved with multiple fallback options to ensure form submissions always work:

1. **Primary**: EmailJS
2. **Fallback 1**: Netlify Function
3. **Fallback 2**: Formspree
4. **Fallback 3**: Email Client (mailto:)

## Setup Instructions

### 1. EmailJS Setup (Primary Method)

1. Go to [EmailJS](https://www.emailjs.com/) and create an account
2. Create a new Email Service (Gmail, Outlook, etc.)
3. Create an email template with the following variables:
   - `to_name`
   - `from_name`
   - `from_email`
   - `linkedin_url`
   - `role`
   - `company`
   - `expertise`
   - `motivation`
   - `submission_date`
   - `form_type`

4. Update the configuration in `script.js`:
   ```javascript
   // Replace with your actual IDs
   const serviceID = 'your_service_id';
   const templateID = 'your_template_id';
   emailjs.init('your_user_id');
   ```

### 2. Netlify Function Setup (Fallback 1)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in Netlify:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password (not regular password)

3. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### 3. Formspree Setup (Fallback 2)

1. Go to [Formspree](https://formspree.io/) and create an account
2. Create a new form
3. Update the form endpoint in `script.js`:
   ```javascript
   fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

### 4. Testing

Use the test page at `test-email.html` to debug the email functionality:

1. Open `test-email.html` in your browser
2. Try each individual test button
3. Check the console logs for detailed error messages
4. Use the full form submission to test the complete flow

## Troubleshooting

### EmailJS Issues
- Check that the service ID and template ID are correct
- Verify that the EmailJS library is loading properly
- Check browser console for detailed error messages
- Ensure your EmailJS account has sufficient credits

### Netlify Function Issues
- Verify environment variables are set correctly
- Check Netlify function logs in the dashboard
- Ensure the function is deployed properly
- Test the function endpoint directly

### Formspree Issues
- Verify the form ID is correct
- Check that the form is active in Formspree dashboard
- Ensure you're not hitting rate limits

### General Issues
- Check browser console for JavaScript errors
- Verify all required form fields are filled
- Test with different browsers
- Check network tab for failed requests

## Current Configuration

The current setup uses these IDs (you may need to update them):

- **EmailJS User ID**: `8Ti-BdFPIXQJRCnwa`
- **EmailJS Service ID**: `service_lb1tvqc`
- **EmailJS Template ID**: `template_1bsatl6`
- **Formspree Form ID**: `xpzgwqjq`

## Email Template Example

Here's a sample email template for EmailJS:

```html
Subject: New Application: {{from_name}}

Name: {{from_name}}
Email: {{from_email}}
LinkedIn: {{linkedin_url}}
Role: {{role}}
Company: {{company}}
Expertise: {{expertise}}
Motivation: {{motivation}}
Submission Date: {{submission_date}}
Form Type: {{form_type}}
```

## Support

If you're still having issues:
1. Check the test page logs
2. Verify all configurations are correct
3. Test each method individually
4. Contact support with specific error messages 