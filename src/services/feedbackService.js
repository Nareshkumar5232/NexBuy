import { apiRequest } from './api';

export const feedbackService = {
  async submitFeedback({ name, email, phone, subject, category, message }) {
    return await apiRequest('/feedback', {
      method: 'POST',
      body: { name, email, phone, subject, category, message }
    });
  },

  async subscribeNewsletter(email) {
    return await apiRequest('/feedback/newsletter', {
      method: 'POST',
      body: { email }
    });
  }
};
