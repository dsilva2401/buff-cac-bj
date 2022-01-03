import { useGlobal } from "context/global/GlobalContext";

export type EventType = {
  eventType: string;
  event: string;
  data: any;
};

const logEvent = (data: EventType) => {
  return console.log("LOG EVENT: ", data);
};

export default logEvent;
