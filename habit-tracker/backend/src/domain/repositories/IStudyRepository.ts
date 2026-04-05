import { Study, CreateStudyDTO, UpdateStudyDTO } from '../entities/Study';

export interface IStudyRepository {
  findById(id: string): Promise<Study | null>;
  findByUserId(userId: string): Promise<Study[]>;
  create(data: CreateStudyDTO): Promise<Study>;
  update(id: string, data: UpdateStudyDTO): Promise<Study | null>;
  delete(id: string): Promise<boolean>;
}
