<?php
// send_email.php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Get form data (matches contact.html)
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS);
$interest = filter_input(INPUT_POST, 'interest', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

// Validate required fields
if (empty($name) || empty($email) || empty($interest) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Interest options mapping
$interestOptions = [
    'n5-course' => 'N5 Beginner Course',
    'n4-course' => 'N4 Intermediate Course',
    'guidance' => 'Study in Japan guidance',
    'other' => 'Other inquiry'
];

$interestText = isset($interestOptions[$interest]) ? $interestOptions[$interest] : 'Not specified';

try {
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = 'mail.momijiedu.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@momijiedu.com';
    $mail->Password = '-';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Set charset
    $mail->CharSet = 'UTF-8';

    // Recipients
    $mail->setFrom('info@momijiedu.com', 'Momiji Japanese Language Academy');
    $mail->addAddress('info@momijiedu.com', 'Momiji Info');
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission from ' . $name;

    // Email body
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=\"UTF-8\">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #e53e3e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 25px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
            .field:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #e53e3e; display: inline-block; width: 150px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
            .important { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>📧 New Contact Form Submission</h2>
                <p>Momiji Japanese Language Academy</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>👤 Name:</span> {$name}
                </div>
                <div class='field'>
                    <span class='label'>✉️ Email:</span> {$email}
                </div>
                <div class='field'>
                    <span class='label'>� Phone:</span> {$phone}
                </div>
                <div class='field'>
                    <span class='label'>� Interested In:</span> {$interestText}
                </div>
                <div class='field'>
                    <span class='label'>💬 Message:</span><br>
                    <div style=\"margin-top: 10px; padding: 10px; background-color: white; border: 1px solid #e0e0e0; border-radius: 5px;\">
                        " . nl2br(htmlspecialchars($message)) . "
                    </div>
                </div>
                <div class='field'>
                    <span class='label'>⏰ Submission Time:</span> " . date('F j, Y, g:i a') . "
                </div>
                <div class='field'>
                    <span class='label'>🌐 Source:</span> Website Contact Form
                </div>
                
                <div class='important'>
                    <strong>⚠️ Action Required:</strong> Please respond to this inquiry within 24 hours.
                </div>
            </div>
            <div class='footer'>
                <p>🎌 <strong>Momiji Japanese Language Academy</strong></p>
                <p>This email was automatically generated from momijiedu.com</p>
            </div>
        </div>
    </body>
    </html>
    ";

    // Plain text version
    $mail->AltBody = "NEW CONTACT FORM SUBMISSION
=======================

Momiji Japanese Language Academy
--------------------------------

Name: {$name}
Email: {$email}
Phone: {$phone}
Interested In: {$interestText}

Message:
{$message}

Submission Time: " . date('F j, Y, g:i a') . "
Source: Website Contact Form
";

    // Send the email
    if ($mail->send()) {
        // Send confirmation to user
        $confirmationMail = new PHPMailer(true);
        $confirmationMail->isSMTP();
        $confirmationMail->Host = 'mail.momijiedu.com';
        $confirmationMail->SMTPAuth = true;
        $confirmationMail->Username = 'info@momijiedu.com';
        $confirmationMail->Password = '';
        $confirmationMail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $confirmationMail->Port = 465;
        $confirmationMail->CharSet = 'UTF-8';

        $confirmationMail->setFrom('info@momijiedu.com', 'Momiji Japanese Language Academy');
        $confirmationMail->addAddress($email, $name);

        $confirmationMail->isHTML(true);
        $confirmationMail->Subject = 'Thank You for Contacting Momiji Japanese Language Academy';

        $confirmationMail->Body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset=\"UTF-8\">
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #e53e3e, #c53030); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
                .footer { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center; font-size: 12px; color: #666; }
                .contact-box { background-color: #fff5f5; border: 1px solid #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .btn-primary { background-color: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1 style='margin: 0;'>🎌 Thank You for Contacting Us!</h1>
                    <p style='margin: 10px 0 0; opacity: 0.9;'>Your Japanese Language Journey Starts Here</p>
                </div>
                
                <div class='content'>
                    <p>Dear <strong>{$name}</strong>,</p>
                    
                    <p>Thank you for reaching out to <strong>Momiji Japanese Language Academy</strong>. We have successfully received your inquiry and our team will review it shortly.</p>
                    
                    <div class='contact-box'>
                        <h3 style='color: #e53e3e; margin-top: 0;'>📋 Your Inquiry Details:</h3>
                        <p><strong>Interested In:</strong> {$interestText}</p>
                        <p><strong>Submission Time:</strong> " . date('F j, Y, g:i a') . "</p>
                    </div>
                    
                    <h3>⏰ What Happens Next?</h3>
                    <p>Our team will contact you within <strong>24 hours</strong> to assist you further.</p>
                    
                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>
                        <p><strong>✉️ Email:</strong> info@momijiedu.com</p>
                        <p><strong>🏢 Office Hours:</strong> Saturday – Thursday, 10:00 AM – 6:00 PM</p>
                    </div>
                    
                    <div style='text-align: center; margin: 25px 0;'>
                        <a href='https://momijiedu.com' class='btn-primary'>🌐 Visit Website</a>
                    </div>
                    
                    <p>We look forward to speaking with you soon!</p>
                    
                    <p>Best regards,<br>
                    <strong>The Momiji Team</strong></p>
                </div>
                
                <div class='footer'>
                    <p><strong>Momiji Japanese Language Academy</strong></p>
                    <p>Dhaka, Bangladesh</p>
                    <p style='margin-top: 15px; font-size: 11px; color: #999;'>
                        This is an automated confirmation email. Please do not reply to this message.<br>
                        © " . date('Y') . " Momiji Japanese Language Academy. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        ";

        $confirmationMail->AltBody = "THANK YOU FOR CONTACTING MOMIJI JAPANESE LANGUAGE ACADEMY

Dear {$name},

Thank you for reaching out to Momiji Japanese Language Academy. We have successfully received your inquiry and our team will contact you within 24 hours.

YOUR INQUIRY DETAILS:
- Interested In: {$interestText}
- Submission Time: " . date('F j, Y, g:i a') . "

We look forward to helping you with your Japanese language journey!

Best regards,
The Momiji Team
";

        $confirmationMail->send();

        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.'
        ]);

    }
    else {
        throw new Exception('Mailer failed to send');
    }


}
catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Message could not be sent. Error: ' . $e->getMessage()
    ]);
}
