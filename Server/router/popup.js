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
import verifyToken, { verifyAdmin } from '../utils/verifyToken.js';

const popupRoute = express.Router();

// Public routes
popupRoute.get('/active', getActivePopups);
popupRoute.get('/:id', getPopupById);
popupRoute.post('/:id/view', trackPopupView);
popupRoute.post('/:id/click', trackPopupClick);

// Admin routes (need verifyToken first!)
popupRoute.post('/', verifyToken, verifyAdmin, createPopup);
popupRoute.get('/admin/all', verifyToken, verifyAdmin, getAllPopups);
popupRoute.put('/:id', verifyToken, verifyAdmin, updatePopup);
popupRoute.delete('/:id', verifyToken, verifyAdmin, deletePopup);

export default popupRoute;
