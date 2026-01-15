import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  SearchUserDto,
  BatchCreateUsersDto,
  BatchUpdateUsersDto,
  BatchIdsDto,
} from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== CREATE ====================

  /**
   * POST /api/users
   * Create a single user
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * POST /api/users/batch
   * Create multiple users at once
   */
  @Post('batch')
  async createBatch(@Body() batchDto: BatchCreateUsersDto) {
    return this.usersService.createBatch(batchDto);
  }

  // ==================== READ ====================

  /**
   * GET /api/users
   * Get all users with pagination, filtering, and sorting
   */
  @Get()
  async findAll(@Query() searchDto: SearchUserDto) {
    return this.usersService.findAll(searchDto);
  }

  /**
   * GET /api/users/search
   * Search for a single user by flexible criteria (id, email, or phone)
   */
  @Get('search')
  async findOne(
    @Query('id') id?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    return this.usersService.findOne({ id, email, phone });
  }

  /**
   * GET /api/users/:id
   * Get a single user by ID
   */
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.usersService.findById(id, includeDeleted === 'true');
  }

  // ==================== UPDATE ====================

  /**
   * PATCH /api/users/:id
   * Update a single user
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * PATCH /api/users/batch
   * Update multiple users at once
   */
  @Patch('batch/update')
  async updateBatch(@Body() batchDto: BatchUpdateUsersDto) {
    return this.usersService.updateBatch(batchDto);
  }

  // ==================== DELETE ====================

  /**
   * DELETE /api/users/:id
   * Soft delete a single user
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.softDelete(id);
  }

  /**
   * DELETE /api/users/batch
   * Soft delete multiple users
   */
  @Post('batch/delete')
  @HttpCode(HttpStatus.OK)
  async deleteBatch(@Body() batchDto: BatchIdsDto) {
    return this.usersService.softDeleteBatch(batchDto);
  }

  // ==================== RESTORE ====================

  /**
   * POST /api/users/:id/restore
   * Restore a soft-deleted user
   */
  @Post(':id/restore')
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.restore(id);
  }

  /**
   * POST /api/users/batch/restore
   * Restore multiple soft-deleted users
   */
  @Post('batch/restore')
  async restoreBatch(@Body() batchDto: BatchIdsDto) {
    return this.usersService.restoreBatch(batchDto);
  }
}
