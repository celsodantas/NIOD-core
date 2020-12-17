import { Socket } from "dgram";
import { store } from "./store";
import { NetworkSend } from "../types/network_types";
import { Mutate } from "../types/store_types";
import { Message } from "../types/message_types";
import { Callback } from "../types/dispatch_types";
import { EventHandler } from "../dcs/event";

export const mutate: Mutate = (mutationName, args) =>
  mutations[mutationName](args);

export const mutationNames = {
  SET_CONFIG: "setConfig",
  SET_SERVER: "setServer",
  SET_NETWORK_SEND: "setNetworkSend",
  SET_SENT_MESSAGES: "setSentMessages",
  SET_EVENT_HANDLERS: "setEventHandlers"
};

const mutations = {
  [mutationNames.SET_CONFIG]: ({ownPort, distantPort}: {ownPort: number; distantPort: number;}) => {
      (store.config = { ownPort, distantPort })
  },

  [mutationNames.SET_SERVER]: ({ server }: { server: Socket }) => {
    (store.server = server)
  },

  [mutationNames.SET_NETWORK_SEND]: ({networkSend}: {networkSend: NetworkSend;}) => {
    (store.networkSend = networkSend)
  },
  
  [mutationNames.SET_SENT_MESSAGES]: ({sentMessages}: {sentMessages: Message[];}) => {
    store.sentMessages = sentMessages;
  },

  [mutationNames.SET_EVENT_HANDLERS]: 
    ({eventHandlers}: {eventHandlers: {[key: number]: Map<string, EventHandler<any>>;};}) => {
    store.eventHandlers = eventHandlers;
  }
};
