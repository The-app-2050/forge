/**
 * @typedef {'motion' | 'door' | 'pattern' | 'purge' | 'scan' | 'test'} SecurityCategory
 *
 * @typedef {Object} SecurityEvent
 * @property {string} title - Event title
 * @property {string} body - Event description
 * @property {SecurityCategory} [category='test'] - Event category
 */
