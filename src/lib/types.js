/**
 * @typedef {'vision' | 'note' | 'insight'} VisionType
 *
 * @typedef {Object} Vision
 * @property {string} name - Original user prompt / vision text
 * @property {string} [manifestation='PENDING'] - AI-generated Crystal Core response
 * @property {VisionType} [type='vision'] - Memory type
 * @property {string} [forgedAt] - When this vision was forged (ISO Date string)
 */
