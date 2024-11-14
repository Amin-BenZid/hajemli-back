import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Barber } from './barber.schema';
import { CreateBarberDto } from './dto/create-barber.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/Mail/Mail.service';
import { randomBytes } from 'crypto'; // Import randomBytes here
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';



@Injectable()
export class BarberService {
  private googleClient: OAuth2Client;
  constructor(
    @InjectModel(Barber.name) private barberModel: Model<Barber>,
    private mailService: MailService,
    private jwtService: JwtService,

  ) {}

  async create(createBarberDto: CreateBarberDto): Promise<Barber> {
    // Hash the password before saving
    const saltRounds = 10; // Adjust the salt rounds as needed
    const hashedPassword = await bcrypt.hash(createBarberDto.password, saltRounds);

    // Create a new Barber instance with the hashed password
    const createdBarber = new this.barberModel({
      ...createBarberDto,
      password: hashedPassword, // Store the hashed password
    });

    return createdBarber.save();
  }

  async findOne(barberId: string): Promise<Barber> {
    const barber = await this.barberModel.findOne({ barber_id: barberId });
    if (!barber) throw new NotFoundException(`Barber with ID ${barberId} not found`);
    return barber;
  }

  async findAll(): Promise<Barber[]> {
    return this.barberModel.find().exec();
  }

  async validateBarber(mail: string, password: string): Promise<Barber | null> {
    const barber = await this.barberModel.findOne({ mail }); // Use appropriate field to find barber
    if (barber && await bcrypt.compare(password, barber.password)) {
      // Password is valid
      return barber;
    }
    return null; // Invalid mail or password
  }

  // Method to handle login and generate JWT
  async login(mail: string, password: string) {
    const barber = await this.validateBarber(mail, password);
    if (!barber) {
      throw new UnauthorizedException('Invalid mail or password');
    }

    // Generate JWT token
    const payload = { barber_id: barber.barber_id, mail: barber.mail }; // Adjust based on your Barber schema
    const token = this.jwtService.sign(payload);

    return { token, barber }; // Return token and barber data
  }

  async findByMail(mail: string): Promise<Barber | null> {
    const result = await this.barberModel.findOne({ mail }).lean();
    return result ? (result as Barber) : null; // Cast to Barber
  }

  async requestPasswordReset(mail: string): Promise<void> {
    const barber = await this.barberModel.findOne({ mail }).exec();
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    // Generate a reset token and expiration date
    const resetToken = randomBytes(4).toString('hex'); // Use the imported randomBytes
    barber.resetToken = resetToken;
    barber.resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await barber.save();

    // Send reset token to barber
    await this.mailService.sendUserPassword(mail, resetToken);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const barber = await this.barberModel.findOne({
      resetToken,
      resetTokenExpiration: { $gte: Date.now() },
    }).exec();

    if (!barber) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    barber.password = await bcrypt.hash(newPassword, 10);
    barber.resetToken = undefined;
    barber.resetTokenExpiration = undefined;
    await barber.save();
  }



  async loginWithGoogle(googleToken: string) {
    // Verify the Google token
    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Google token verification failed');
    }

    const { email, sub: googleId, name, picture } = payload;

    // Check if the barber already exists
    let barber = await this.barberModel.findOne({ mail: email }).exec();

    if (!barber) {
      // If barber doesn't exist, create a new barber
      barber = new this.barberModel({
        mail: email,
        name: name || 'Unnamed Barber',  // Set a default name if needed
        googleId,
        profile_image: picture,           // Save profile image if needed
        password: null,                   // Set password as null for Google accounts
      });
      await barber.save();
    }

    // Generate JWT token
    const tokenPayload = { barber_id: barber.barber_id, mail: barber.mail };
    const token = this.jwtService.sign(tokenPayload);

    return { token, barber };
  }


  
}
