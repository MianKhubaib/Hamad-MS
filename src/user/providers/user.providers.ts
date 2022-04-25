import { User } from '../entity/user.entity';
import { USER_REPOSITORY } from '../../constants';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
