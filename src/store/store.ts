import { Store } from "../types/store_types";
import { Callback } from "../types/dispatch_types";
import { EventHandler } from "../dcs/event";
import { Message } from "../types/message_types";

export const store: Store = {
  config: {
    ownPort: 15487,
    distantPort: 15488
  },
  sentMessages: new Map<string, Message>(),
  server: undefined,
  networkSend: undefined,
  eventHandlers: []
};

export const getStore = (): Readonly<Store> => store;
