// SMS OTP service (using console logging for demo)
// In production, integrate with Twilio, AWS SNS, or other SMS providers

// Store SMS OTPs temporarily (in production, use Redis or database)
const smsOtpStorage = new Map<string, { otp: string; expires: number }>();

// Generate 6-digit OTP
function generateSMSOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send SMS OTP (demo implementation)
export async function sendSMSOTP(phoneNumber: string, userName: string) {
  const otp = generateSMSOTP();
  
  // Store OTP with 5-minute expiration
  smsOtpStorage.set(phoneNumber, {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  try {
    // In production, integrate with SMS provider:
    // await twilioClient.messages.create({
    //   body: `TeleConnect OTP: ${otp}. Valid for 5 minutes. Do not share.`,
    //   from: '+1234567890',
    //   to: phoneNumber
    // });

    // For demo, log to console
    console.log(`SMS OTP sent to ${phoneNumber}: ${otp}`);
    console.log(`Message: TeleConnect OTP: ${otp}. Valid for 5 minutes. Do not share.`);
    
    return { success: true, message: 'SMS OTP sent successfully' };
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    
    // For demo purposes, still log the OTP
    console.log(`DEMO MODE - SMS OTP for ${phoneNumber}: ${otp}`);
    return { 
      success: true, 
      message: 'SMS OTP sent successfully (Demo Mode - Check server logs)' 
    };
  }
}

// Verify SMS OTP
export function verifySMSOTP(phoneNumber: string, enteredOTP: string) {
  const stored = smsOtpStorage.get(phoneNumber);
  
  if (!stored) {
    return { valid: false, message: 'No OTP found for this phone number' };
  }
  
  if (Date.now() > stored.expires) {
    smsOtpStorage.delete(phoneNumber);
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (stored.otp !== enteredOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it
  smsOtpStorage.delete(phoneNumber);
  return { valid: true, message: 'SMS OTP verified successfully' };
}

// Resend SMS OTP
export async function resendSMSOTP(phoneNumber: string, userName: string) {
  // Remove existing OTP
  smsOtpStorage.delete(phoneNumber);
  
  // Send new OTP
  return await sendSMSOTP(phoneNumber, userName);
}