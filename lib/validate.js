const VALID_SERVICES = ['web', 'mobile', 'cloud', 'ai', 'devops', 'other'];
const VALID_BUDGETS = ['<10k', '10-50k', '50-100k', '100k+'];

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').trim();
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateContact(data) {
  const errors = {};

  // Name
  const name = typeof data.name === 'string' ? stripHtml(data.name) : '';
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.length > 100) {
    errors.name = 'Name must be under 100 characters';
  }

  // Email
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email address';
  }

  // Company (optional)
  if (data.company) {
    const company = stripHtml(String(data.company));
    if (company.length > 100) {
      errors.company = 'Company name must be under 100 characters';
    }
  }

  // Service (optional)
  if (data.service && !VALID_SERVICES.includes(data.service)) {
    errors.service = 'Invalid service selection';
  }

  // Budget (optional)
  if (data.budget && !VALID_BUDGETS.includes(data.budget)) {
    errors.budget = 'Invalid budget selection';
  }

  // Message
  const message = typeof data.message === 'string' ? stripHtml(data.message) : '';
  if (!message) {
    errors.message = 'Message is required';
  } else if (message.length < 20) {
    errors.message = 'Message is too short (min 20 characters)';
  } else if (message.length > 2000) {
    errors.message = 'Message is too long (max 2000 characters)';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name,
      email,
      company: data.company ? stripHtml(String(data.company)) : null,
      service: data.service || null,
      budget: data.budget || null,
      message,
    },
  };
}
