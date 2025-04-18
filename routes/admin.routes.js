import express from 'express';
import { deleteUser, getUsers, getUserWithId, paginateGetUsers, updateUser } from '../controller/admin.controller.js';
import { isAdmin } from '../middleware/protect-admin.middleware.js';
const   adminRoutes = express.Router();

adminRoutes.get('/users', isAdmin , getUsers)
adminRoutes.put('/user/:id' , isAdmin ,updateUser);
adminRoutes.delete('/users/:id', isAdmin , deleteUser);
adminRoutes.get("/user/:id" , isAdmin , getUserWithId);
adminRoutes.get("/paginateUsers", isAdmin , paginateGetUsers)

export {
    adminRoutes
}