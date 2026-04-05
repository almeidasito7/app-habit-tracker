import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, UpdateUserDTO } from '../../../domain/entities/User';

export class GetProfileUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}

export class UpdateProfileUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string, data: UpdateUserDTO): Promise<User | null> {
    return this.userRepository.update(userId, data);
  }
}
