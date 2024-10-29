import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'oussamalaajili20@gmail.com', // remplacez par votre adresse email
        pass: 'wrraxpxoslkdmacq', // remplacez par le mot de passe d'application généré
      },
    });
  }

  async sendUserPassword(email: string, password: string) {
    const mailOptions = {
      from: 'oussamalaajili20@gmail.com',
      to: email,
      subject: 'Votre mot de passe de compte',
      text: `Welcome to our Hajemli application, 
      Your generated password is : ${password}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    }
  }
}
