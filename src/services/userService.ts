
import { userRetrievalService } from './users/userRetrievalService';
import { userUpdateService } from './users/userUpdateService';
import { userCreationService } from './users/userCreationService';
import { userDeletionService } from './users/userDeletionService';
import { userStatusService } from './users/userStatusService';

export const userService = {
  // User retrieval operations
  getUsers: userRetrievalService.getUsers,
  getUserById: userRetrievalService.getUserById,
  getUserByEmail: userRetrievalService.getUserByEmail,
  
  // User update operations
  updateUser: userUpdateService.updateUser,
  
  // User creation operations
  createUser: userCreationService.createUser,
  
  // User deletion operations
  deleteUser: userDeletionService.deleteUser,
  
  // User status operations
  activateUser: userStatusService.activateUser,
  deactivateUser: userStatusService.deactivateUser
};
