import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { createResume, deleteResume, getResumeById, getUserResume, updateResume } from '../controllers/resumeController.js'

const resumeRouter = express.Router()

resumeRouter.post('/', protect, createResume)
resumeRouter.get('/', protect, getUserResume)
resumeRouter.get('/:id', protect, getResumeById)
resumeRouter.put('/:id', protect, updateResume)

// Fix here: use DELETE instead of PUT
resumeRouter.delete('/:id', protect, deleteResume)

export default resumeRouter;
