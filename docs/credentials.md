Name	Roxanne Bartoletti
Username	roxanne36@ethereal.email
Password	T9Vy1eSU5HQ199jEzy


Nodemailer configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'roxanne36@ethereal.email',
        pass: 'T9Vy1eSU5HQ199jEzy'
    }
});
PHPMailer configuration
$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'smtp.ethereal.email';
$mail->SMTPAuth = true;
$mail->Username = 'roxanne36@ethereal.email';
$mail->Password = 'T9Vy1eSU5HQ199jEzy';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
SwiftMailer configuration
$transport = (new Swift_SmtpTransport('smtp.ethereal.email', 587, 'tls'))
  ->setUsername('roxanne36@ethereal.email')
  ->setPassword('T9Vy1eSU5HQ199jEzy');
SMTP configuration
Host	smtp.ethereal.email
Port	587
Security	STARTTLS
Username	roxanne36@ethereal.email
Password	T9Vy1eSU5HQ199jEzy
IMAP configuration
Host	imap.ethereal.email
Port	993
Security	TLS
Username	roxanne36@ethereal.email
Password	T9Vy1eSU5HQ199jEzy
POP3 configuration
Host	pop3.ethereal.email
Port	995
Security	TLS
Username	roxanne36@ethereal.email
Password	T9Vy1eSU5HQ199jEzy