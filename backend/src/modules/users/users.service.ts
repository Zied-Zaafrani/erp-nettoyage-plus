import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { UserStatus } from '../../shared/types/user.types';
import {
  CreateUserDto,
  UpdateUserDto,
  SearchUserDto,
  BatchCreateUsersDto,
  BatchUpdateUsersDto,
  BatchIdsDto,
} from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ==================== CREATE OPERATIONS ====================

  /**
   * Create a single user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    // Check for duplicate email
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      withDeleted: true, // Check even soft-deleted users
    });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const user = this.userRepository.create({
      ...createUserDto,
      email: email.toLowerCase(),
    });

    await this.userRepository.save(user);
    this.logger.log(`User created: ${user.email} (ID: ${user.id})`);

    return this.sanitizeUser(user);
  }

  /**
   * Create multiple users at once
   */
  async createBatch(batchDto: BatchCreateUsersDto): Promise<{
    created: User[];
    errors: Array<{ email: string; error: string }>;
  }> {
    const created: User[] = [];
    const errors: Array<{ email: string; error: string }> = [];

    for (const userDto of batchDto.users) {
      try {
        const user = await this.create(userDto);
        created.push(user);
      } catch (error) {
        errors.push({
          email: userDto.email,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Batch create: ${created.length} created, ${errors.length} failed`,
    );

    return { created, errors };
  }

  // ==================== READ OPERATIONS ====================

  /**
   * Find single user by flexible criteria
   */
  async findOne(criteria: {
    id?: string;
    email?: string;
    phone?: string;
  }): Promise<User> {
    if (!criteria.id && !criteria.email && !criteria.phone) {
      throw new NotFoundException('No search criteria provided');
    }

    const where: FindOptionsWhere<User> = {};

    if (criteria.id) {
      where.id = criteria.id;
    } else if (criteria.email) {
      where.email = criteria.email.toLowerCase();
    } else if (criteria.phone) {
      where.phone = criteria.phone;
    }

    const user = await this.userRepository.findOne({ where });

    if (!user) {
      throw new NotFoundException(
        `User not found with: ${JSON.stringify(criteria)}`,
      );
    }

    return this.sanitizeUser(user);
  }

  /**
   * Find single user by ID
   */
  async findById(id: string, includeDeleted = false): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: includeDeleted,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.sanitizeUser(user);
  }

  /**
   * Find all users with pagination, filtering, and sorting
   */
  async findAll(searchDto: SearchUserDto): Promise<{
    data: User[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      includeDeleted = false,
      role,
      status,
      firstName,
      lastName,
      email,
      search,
    } = searchDto;

    const skip = (page - 1) * limit;

    // Build where conditions
    const where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = [];

    // Handle generic search with OR conditions
    if (search) {
      const searchPattern = `%${search}%`;
      where.push(
        { email: ILike(searchPattern), ...(role && { role }), ...(status && { status }) },
        { firstName: ILike(searchPattern), ...(role && { role }), ...(status && { status }) },
        { lastName: ILike(searchPattern), ...(role && { role }), ...(status && { status }) },
        { phone: ILike(searchPattern), ...(role && { role }), ...(status && { status }) },
      );
    } else {
      // Handle specific field filters with AND conditions
      const andWhere: FindOptionsWhere<User> = {};
      if (role) andWhere.role = role;
      if (status) andWhere.status = status;
      if (firstName) andWhere.firstName = ILike(`%${firstName}%`);
      if (lastName) andWhere.lastName = ILike(`%${lastName}%`);
      if (email) andWhere.email = ILike(`%${email}%`);
      where.push(andWhere);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: where.length > 0 ? where : {},
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
      withDeleted: includeDeleted,
    });

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== UPDATE OPERATIONS ====================

  /**
   * Update single user by ID
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check for email conflict if updating email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email.toLowerCase() },
        withDeleted: true,
      });

      if (emailExists) {
        throw new ConflictException(
          `Email ${updateUserDto.email} is already in use`,
        );
      }

      updateUserDto.email = updateUserDto.email.toLowerCase();
    }

    // Merge and save
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    this.logger.log(`User updated: ${user.email} (ID: ${user.id})`);

    return this.sanitizeUser(user);
  }

  /**
   * Update multiple users at once
   */
  async updateBatch(batchDto: BatchUpdateUsersDto): Promise<{
    updated: User[];
    errors: Array<{ id: string; error: string }>;
  }> {
    const updated: User[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const { id, ...updateData } of batchDto.users) {
      try {
        const user = await this.update(id, updateData);
        updated.push(user);
      } catch (error) {
        errors.push({
          id,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Batch update: ${updated.length} updated, ${errors.length} failed`,
    );

    return { updated, errors };
  }

  // ==================== DELETE OPERATIONS ====================

  /**
   * Soft delete single user
   */
  async softDelete(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update status to ARCHIVED before soft deleting
    await this.userRepository.update(id, { status: UserStatus.ARCHIVED });
    
    await this.userRepository.softDelete(id);
    this.logger.log(`User soft deleted: ${user.email} (ID: ${id})`);

    return { message: `User ${user.email} has been deactivated` };
  }

  /**
   * Soft delete multiple users
   */
  async softDeleteBatch(batchDto: BatchIdsDto): Promise<{
    deleted: string[];
    errors: Array<{ id: string; error: string }>;
  }> {
    const deleted: string[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of batchDto.ids) {
      try {
        await this.softDelete(id);
        deleted.push(id);
      } catch (error) {
        errors.push({
          id,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Batch delete: ${deleted.length} deleted, ${errors.length} failed`,
    );

    return { deleted, errors };
  }

  // ==================== RESTORE OPERATIONS ====================

  /**
   * Restore single soft-deleted user
   */
  async restore(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!user.deletedAt) {
      throw new ConflictException(`User ${id} is not deleted`);
    }

    // Restore the user (removes deletedAt)
    await this.userRepository.restore(id);
    
    // Update status back to ACTIVE
    await this.userRepository.update(id, { status: UserStatus.ACTIVE });
    
    this.logger.log(`User restored: ${user.email} (ID: ${id})`);

    // Fetch fresh user
    return this.findById(id);
  }

  /**
   * Restore multiple soft-deleted users
   */
  async restoreBatch(batchDto: BatchIdsDto): Promise<{
    restored: User[];
    errors: Array<{ id: string; error: string }>;
  }> {
    const restored: User[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of batchDto.ids) {
      try {
        const user = await this.restore(id);
        restored.push(user);
      } catch (error) {
        errors.push({
          id,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Batch restore: ${restored.length} restored, ${errors.length} failed`,
    );

    return { restored, errors };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: User): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitized } = user;
    return sanitized as User;
  }
}
