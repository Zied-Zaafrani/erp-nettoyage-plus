import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto';
import { UserStatus } from '../../shared/types/user.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<{
    user: Partial<User>;
    accessToken: string;
  }> {
    const { email } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    // Create new user
    const user = this.userRepository.create({
      ...registerDto,
      email: email.toLowerCase(),
    });

    await this.userRepository.save(user);
    this.logger.log(`User registered: ${user.email}`);

    // Generate token
    const accessToken = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
    };
  }

  /**
   * Login user with email and password
   */
  async login(loginDto: LoginDto): Promise<{
    user: Partial<User>;
    accessToken: string;
  }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Your account is not active. Please contact support.',
      );
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    this.logger.log(`User logged in: ${user.email}`);

    // Generate token
    const accessToken = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
    };
  }

  /**
   * Get user by ID (for JWT validation)
   */
  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
    });
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: User): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
