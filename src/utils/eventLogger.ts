export type EventType = {
  eventType: string;
  event: string;
  data: any;
};

const logEvent = (data: EventType) => {
  data = Object.assign(data, { userInfo: window.navigator.userAgent });
  return console.log('LOG EVENT: ', data);
};

export default logEvent;
