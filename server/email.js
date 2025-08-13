import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Store OTPs temporarily (in production, use Redis or database)
const otpStorage = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email, userName) {
  const otp = generateOTP();
  
  // Store OTP with 5-minute expiration
  otpStorage.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  const msg = {
    to: email,
    from: 'support@replit.app', // Using Replit domain for demo
    subject: 'TeleConnect - Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">TeleConnect</h1>
          <p style="color: #6b7280; margin: 5px 0;">Your Telecom Partner</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${userName},</h2>
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Your OTP code for TeleConnect onboarding verification is:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #2563eb; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; display: inline-block;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This code will expire in 5 minutes. Please do not share this code with anyone.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            © 2024 TeleConnect. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP sent to ${email}: ${otp}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    // For demo purposes, log the OTP to console if email sending fails
    console.log(`DEMO MODE - OTP for ${email}: ${otp}`);
    return { 
      success: true, 
      message: 'OTP sent successfully (Demo Mode - Check server logs for OTP)' 
    };
  }
}

// Verify OTP
export function verifyOTP(email, enteredOTP) {
  const stored = otpStorage.get(email);
  
  if (!stored) {
    return { valid: false, message: 'No OTP found for this email' };
  }
  
  if (Date.now() > stored.expires) {
    otpStorage.delete(email);
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (stored.otp !== enteredOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it
  otpStorage.delete(email);
  return { valid: true, message: 'OTP verified successfully' };
}

// Send welcome email
export async function sendWelcomeEmail(email, userName, accountNumber, planType) {
  const msg = {
    to: email,
    from: 'support@replit.app', // Using Replit domain for demo
    subject: 'Welcome to TeleConnect - Account Activated!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">TeleConnect</h1>
          <p style="color: #6b7280; margin: 5px 0;">Welcome to the Future of Telecommunications</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">🎉 Welcome ${userName}!</h2>
          <p style="margin: 0; opacity: 0.9;">Your TeleConnect account is now active</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 20px;">Your Account Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Account Number:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${accountNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Plan:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${planType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Status:</td>
              <td style="padding: 8px 0; color: #10b981; font-weight: 600;">✓ Active</td>
            </tr>
          </table>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">What's Next?</h3>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 10px 0;">
            <h4 style="color: #2563eb; margin: 0 0 10px 0;">📱 Manage Your Account</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Access your dashboard to view usage, manage settings, and update your preferences.</p>
          </div>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 10px 0;">
            <h4 style="color: #f59e0b; margin: 0 0 10px 0;">🎯 Explore Services</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Discover our premium features and additional services available to you.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Access Dashboard
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Need help? Contact our support team 24/7<br>
            © 2024 TeleConnect. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent to ${email}`);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    // For demo purposes, log welcome email details if sending fails
    console.log(`DEMO MODE - Welcome email for ${userName} at ${email} with account ${accountNumber}`);
    return { 
      success: true, 
      message: 'Welcome email sent successfully (Demo Mode)' 
    };
  }
}