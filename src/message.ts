import { v4 as uuidv4 } from "uuid";
import { Message, MessageType } from "./types/message_types";
import { getStore } from "./store/store";
import { mutate, mutationNames } from "./store/mutation";
import { Callback } from "./types/dispatch_types";
import { handleEvent } from "./dcs/event";

/** @internal */
export const sendMessage = (message: Message) => {
  const networkSend = getStore().networkSend;
  if (!networkSend) {
    console.error("Couldn't send message, server is probably not initialized");
    return;
  }
  networkSend(JSON.stringify(message));
  getStore().sentMessages.set(message.id, message)
};

/** @internal */
export const createMessage = <R>(
  type: MessageType,
  payload: { [key: string]: any },
  successCallback: Callback<R>,
  errorCallback: Callback<R>
): Message => {
  return {
    id: uuidv4().toString(),
    type,
    successCallback: successCallback,
    errorCallback: errorCallback,
    payload,
    sentAt: Date.now(),
    retries: 0
  };
};

const handleFunction = (message: Message) => {};

const handleReceived = (message: Message) => {
  
  const queuedMessage = getStore().sentMessages.get(message.id)
  getStore().sentMessages.delete(message.id)

  if (!queuedMessage) {
    return;
  }

  if (queuedMessage.successCallback) {
    queuedMessage.successCallback(message.payload)
  }
};

const messageHandlers = {
  function: handleFunction,
  event: (message: Message) =>
    handleEvent(
      typeof message.payload.id === "number" ? message.payload.id : -1,
      message.payload
    ),
  received: handleReceived
};

/** @internal */
export const handleMessage = (message: Message) => {
  //console.log("Received", message);
  messageHandlers[message.type](message);
};

setInterval(() => {
  getStore().sentMessages.forEach(message => {
    if (Date.now() - message.sentAt <= 5000) {
      return;
    }

    if (message.retries < 5) {
      console.log(`retrying msg... ${message.id}, retries: ${message.retries}`)
      message.retries += 1

      sendMessage(message);
    } else if (message.errorCallback) {
      console.log(`TIMEOUT msg... ${message.id}`)

      getStore().sentMessages.delete(message.id)
      message.errorCallback()
    }
  });
}, 2000);
