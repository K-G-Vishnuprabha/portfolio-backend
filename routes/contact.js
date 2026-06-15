import { Router } from 'express';
import mongoose from 'mongoose';
import Contact from '../models/Contact.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const contact = new Contact({
        name,
        email,
        subject,
        message,
      });

      await contact.save();
    }

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully!',
    });
  } catch (error) {
    console.error('Contact form error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to submit message.',
    });
  }
});

export default router;