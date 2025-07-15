    import express from 'express';
    import { createCourse, updateCourse, deleteCourse, getCourses, courseDetails } from '../controller/course.controller.js';
    import userMiddleware from '../middleware/user.middleware.js';
    import adminMiddleware from '../middleware/admin.middleware.js';


    const router = express.Router();

    router.post('/create', adminMiddleware, createCourse);
    router.put('/update/:courseId', adminMiddleware, updateCourse); //upload.single("image") this line handles multipart/form-data
    router.delete('/delete/:courseId',adminMiddleware, deleteCourse);
    router.get('/courses', getCourses);
    router.get('/:courseId', courseDetails);
 

    export default router;