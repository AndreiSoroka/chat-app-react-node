import * as messageModel from "../models/messageModel.mjs";
import {
  formatCreatedMessage,
  formatMessagesList,
} from "../views/messageView.mjs";
import errors from "../lib/errors/errors.json" assert { type: "json" };
import sendToAllClients from "../lib/webSocket/sendToAllClients.mjs";

export function listMessages(req, res, next) {
  try {
    const timestamp = req.query.timestamp
      ? parseInt(req.query.timestamp, 10)
      : null;

    const messages = timestamp
      ? messageModel.getMessagesFromTimestamp(timestamp)
      : messageModel.getLastNMessages(10);
    res.json(formatMessagesList(messages));
  } catch (err) {
    next(err);
  }
}

export function addMessage(req, res, next) {
  try {
    const textContent = req.body.textContent?.trim();
    const displayName = req.body.displayName?.trim();

    // P.s. I don't use middlewares in current project, so code here
    if (!displayName || !textContent) {
      next(errors.messages.EMPTY_DATA);
      return;
    }

    if (
      typeof displayName !== "string" ||
      typeof textContent !== "string" ||
      displayName.length > 20 ||
      textContent.length > 300
    ) {
      next(errors.messages.INVALID_DATA);
      return;
    }

    if (messageModel.hasUserSpammed(displayName)) {
      next(errors.messages.TO_MANY_REQUESTS);
      return;
    }

    const message = messageModel.addMessage(displayName, textContent);

    sendToAllClients(message);
    res.json(formatCreatedMessage(message));
  } catch (err) {
    next(err);
  }
}
