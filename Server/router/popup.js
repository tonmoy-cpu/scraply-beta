import express from 'express';
import {
  getActivePopups,
  getPopupById,
  trackPopupView,
  trackPopupClick,
  createPopup,
  getAllPopups,
  updatePopup,
  deletePopup,
} from '../controllers/popupController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const popupRoute = express.Router();

// Public routes
popupRoute.get('/active', getActivePopups);
popupRoute.get('/:id', getPopupById);
popupRoute.post('/:id/view', trackPopupView);
popupRoute.post('/:id/click', trackPopupClick);

// Admin routes
popupRoute.post('/', verifyAdmin, createPopup);
popupRoute.get('/admin/all', verifyAdmin, getAllPopups);
popupRoute.put('/:id', verifyAdmin, updatePopup);
popupRoute.delete('/:id', verifyAdmin, deletePopup);

export default popupRoute;