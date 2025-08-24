/*
  # Create popup management system

  1. New Tables
    - `popups`
      - `id` (ObjectId, primary key)
      - `title` (String, required)
      - `content` (String, required)
      - `detailContent` (String, optional)
      - `isActive` (Boolean, default true)
      - `frequency` (Number, default 24 - hours between shows)
      - `priority` (Number, default 1)
      - `targetPages` (Array of strings)
      - `createdAt` (Date)
      - `updatedAt` (Date)
  2. Security
    - Basic validation for popup data
*/

import mongoose from 'mongoose';

const popupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    detailContent: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: Number,
      default: 24, // hours between shows
      min: 1,
      max: 168, // max 1 week
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    targetPages: [{
      type: String,
      enum: ['home', 'recycle', 'facilities', 'education', 'all'],
      default: 'all',
    }],
    viewCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for better query performance
popupSchema.index({ isActive: 1, priority: -1 });
popupSchema.index({ targetPages: 1 });

export default mongoose.model('Popup', popupSchema);