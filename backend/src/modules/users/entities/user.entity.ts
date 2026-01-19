import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { UserRole, UserStatus } from '../../../shared/types/user.types';
import {
  ensurePasswordHashed,
  validatePassword as validatePwd,
} from '../../../shared/utils/password.util';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({
    type: 'varchar',
    default: UserRole.AGENT,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  // Email verification (prepared for future use)
  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  // Security: track failed login attempts (for future lockout feature)
  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lastFailedLoginAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Hash password before saving (uses shared utility)
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await ensurePasswordHashed(this.password);
    }
  }

  // Validate password (used in auth)
  async validatePassword(password: string): Promise<boolean> {
    return validatePwd(password, this.password);
  }

  // Helper to check if user is active
  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  // Helper to check if email is verified
  get isEmailVerified(): boolean {
    return this.emailVerified;
  }
}
