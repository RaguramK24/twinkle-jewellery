import React, { useState } from 'react';
import { messageService } from '../services/api';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      await messageService.create(formData);
      setStatus('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Error sending message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form">
      <h1>Get in Touch</h1>
      <p>Have questions about our jewelry collection? We'd love to hear from you!</p>
      
      <form onSubmit={handleSubmit} aria-label="Contact form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            aria-describedby="name-help"
            placeholder="Enter your full name"
          />
          <small id="name-help" className="form-help">
            We'll use this to personalize our response
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            aria-describedby="email-help"
            placeholder="your.email@example.com"
          />
          <small id="email-help" className="form-help">
            We'll send our response to this email address
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Your Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            required
            disabled={isSubmitting}
            aria-describedby="message-help"
            placeholder="Tell us about your jewelry needs, questions, or how we can help you..."
          />
          <small id="message-help" className="form-help">
            Share details about products you're interested in, sizing questions, or any other inquiries
          </small>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
          aria-describedby="submit-status"
        >
          {isSubmitting ? 'Sending Message...' : 'Send Message'}
        </button>
        
        {status && (
          <div 
            id="submit-status"
            className={status.includes('Error') || status.includes('Please fill') ? 'error' : 'success'}
            role="alert"
            aria-live="polite"
          >
            {status}
          </div>
        )}
      </form>
      
      <div className="contact-info">
        <h3>Other Ways to Reach Us</h3>
        <p>
          <strong>Response Time:</strong> We typically respond within 24 hours during business days
        </p>
        <p>
          <strong>For Urgent Inquiries:</strong> Please mention "URGENT" in your message subject
        </p>
      </div>
    </div>
  );
};

export default ContactForm;