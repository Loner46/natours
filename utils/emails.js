const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// Email class` use: new Email(user,url).sendWelcome();
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Peter Parker <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return nodemailer.createTransport({
                service: process.env.SENDINBLUE_SERVICE,
                auth: {
                    user: process.env.SENDINBLUE_USERNAME,
                    pass: process.env.SENDINBLUE_PASSWORD
                }
            })
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
            // Activate in gmail "less secure app" option
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })

        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
                // html:
        }

        // 3) Craete a transport and send an email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to teh Natours Family!');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', `Your password reset token (valid only for ${process.env.PASS_RESET_TOKEN_EXPIRY} minutes)`);
    }
}