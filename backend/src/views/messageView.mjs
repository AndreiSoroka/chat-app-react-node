/**
 * @param {ChatMessage[]} messages
 * @returns {Object}
 */
export function formatMessagesList(messages) {
  return {
    success: true,
    count: messages.length,
    data: messages,
  };
}

/**
 * @param {ChatMessage} message
 * @returns {Object}
 */
export function formatCreatedMessage(message) {
  return {
    success: true,
    data: message,
  };
}
