import Popup from '../models/Popup.js';

// Get active popups for a specific page
export const getActivePopups = async (req, res) => {
  try {
    const { page = 'all' } = req.query;
    
    const popups = await Popup.find({
      isActive: true,
      $or: [
        { targetPages: 'all' },
        { targetPages: page }
      ]
    })
    .sort({ priority: -1, createdAt: -1 })
    .limit(1); // Only return one popup at a time

    res.status(200).json({
      success: true,
      data: popups,
    });
  } catch (error) {
    console.error('Error fetching popups:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch popups' });
  }
};

// Get popup by ID (for detail page)
export const getPopupById = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id);
    
    if (!popup) {
      return res.status(404).json({
        success: false,
        message: 'Popup not found',
      });
    }

    res.status(200).json({
      success: true,
      data: popup,
    });
  } catch (error) {
    console.error('Error fetching popup:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch popup' });
  }
};

// Track popup view
export const trackPopupView = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Popup.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking popup view:', error);
    res.status(500).json({ success: false, message: 'Failed to track view' });
  }
};

// Track popup click
export const trackPopupClick = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Popup.findByIdAndUpdate(id, {
      $inc: { clickCount: 1 }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking popup click:', error);
    res.status(500).json({ success: false, message: 'Failed to track click' });
  }
};

// Admin: Create popup
export const createPopup = async (req, res) => {
  try {
    const popup = new Popup(req.body);
    const savedPopup = await popup.save();
    
    res.status(201).json({
      success: true,
      message: 'Popup created successfully',
      data: savedPopup,
    });
  } catch (error) {
    console.error('Error creating popup:', error);
    res.status(500).json({ success: false, message: 'Failed to create popup' });
  }
};

// Admin: Get all popups
export const getAllPopups = async (req, res) => {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: popups,
    });
  } catch (error) {
    console.error('Error fetching all popups:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch popups' });
  }
};

// Admin: Update popup
export const updatePopup = async (req, res) => {
  try {
    const updatedPopup = await Popup.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPopup) {
      return res.status(404).json({
        success: false,
        message: 'Popup not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Popup updated successfully',
      data: updatedPopup,
    });
  } catch (error) {
    console.error('Error updating popup:', error);
    res.status(500).json({ success: false, message: 'Failed to update popup' });
  }
};

// Admin: Delete popup
export const deletePopup = async (req, res) => {
  try {
    const deletedPopup = await Popup.findByIdAndDelete(req.params.id);

    if (!deletedPopup) {
      return res.status(404).json({
        success: false,
        message: 'Popup not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Popup deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting popup:', error);
    res.status(500).json({ success: false, message: 'Failed to delete popup' });
  }
};

export default {
  getActivePopups,
  getPopupById,
  trackPopupView,
  trackPopupClick,
  createPopup,
  getAllPopups,
  updatePopup,
  deletePopup,
};