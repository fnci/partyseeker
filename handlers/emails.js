import nodemailer from 'nodemailer';
import emailConfig from '../config/emails.js';
import fs from 'fs';
import util from 'util';
import ejs from 'ejs';

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
});

export const sendMail = async (options) => {

    // Read file for email
    const file = __dirname + `/../views/emails/${options.file}.ejs`;
    // Compile
    const compiled = ejs.compile(fs.readFileSync(file, 'utf8'));
    // Create HTML
    const html = compiled({url: options.url})
    // Configure options for the email
    const optionsMail = {
        from: 'PartySeeker <noreply@partyseeker.com>',
        to: options.user.email,
        subject: options.subject,
        html
    }
    // Send email to
    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, optionsMail);
}

export default {sendMail};