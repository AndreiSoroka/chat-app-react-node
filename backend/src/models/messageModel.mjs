/**
 * Structure of a message
 * @typedef {Object} ChatMessage
 * @property {string} displayName
 * @property {string} textContent
 * @property {number} timestamp
 */

const LIMIT_SPAM_RATE = 10; // 10 messages
// An in-memory storage for the messages
/**
 * @type {ChatMessage[]}
 */
const messages = [];

/**
 * Create a message object.
 * @param {string} displayName
 * @param {string} textContent
 * @returns {ChatMessage}
 */
function messageFactory(displayName, textContent) {
  return {
    displayName: displayName.trim(),
    textContent: textContent.trim(),
    timestamp: Date.now(),
  };
}

/**
 * Fetch the last n messages.
 * @param {number} [n=10] The number of messages to retrieve.
 * @returns {ChatMessage[]} The messages.
 */
export function getLastNMessages(n = 10) {
  return messages.slice(-n);
}

/**
 * Fetch the messages after a timestamp.
 * @param {number} timestamp
 * @returns {ChatMessage[]}
 */
export function getMessagesFromTimestamp(timestamp) {
  return messages.filter((message) => message.timestamp > timestamp);
}

/**
 * Check if a user sent more than 10 messages in the last 10 seconds.
 * @param {string} displayName The display name of the user.
 * @returns {boolean} Whether the user sent more than 10 messages recently.
 */
export function hasUserSpammed(displayName) {
  const tenSecondsAgo = Date.now() - 10 * 1000; // Subtract 10 seconds (in ms)

  let countMessages = 0;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].displayName === displayName) {
      countMessages += 1;
    }
    if (
      messages[i].timestamp < tenSecondsAgo ||
      countMessages >= LIMIT_SPAM_RATE
    ) {
      break;
    }
  }
  return countMessages >= LIMIT_SPAM_RATE;
}

/**
 * Add a message to the list.
 * @param {string} displayName The message to add.
 * @param {string} textContent The message to add.
 * @returns {ChatMessage} The added message or undefined if not added.
 */
export function addMessage(displayName, textContent) {
  const message = messageFactory(displayName, textContent);

  messages.push(message);

  // Ensure only the latest 100 messages are kept
  while (messages.length > 100) {
    messages.shift();
  }

  return message;
}
