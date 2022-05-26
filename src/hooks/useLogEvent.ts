import { showToast } from 'components/Toast/Toast';
import { UserLocationType } from 'context/global/GlobalContext';
import { useCallback } from 'react';
import { useAPI } from 'utils/api';

export type EventType = 'ENGAGEMENTS' | 'CONVERSION_RATES';
export type EventName =
  // when unique scan a tag after certain time range, eventType: ENGAGEMENTS
  | 'USER_SCAN_A_TAG'
  // user registers a tag, eventType: ENGAGEMENTS
  | 'USER_REGISTER'
  // when user activates warranty, eventType: ENGAGEMENTS
  | 'WARRANTY_ACTIVATED'
  // all website visits, eventType ENGAGEMENTS
  | 'WEBSITE_VISITS'
  // when user clicks on product in collection, eventType: ENGAGEMENTS
  | 'VIEW_PRODUCT_INFO'
  // all module clicked along with moduleId, eventType: ENGAGEMENTS
  | 'MODULE_CLICKED'
  // when user clicks on checkout button, eventType: ENGAGEMENTS
  | 'SHOPPING_CHECK_OUT';

export type EventPayload = {
  // Provided by event call
  event: EventName;
  eventType: EventType;
  moduleType?: string;
  moduleId?: string;
  data?: any;

  // Added automatically
  user?: string;
  product?: string;
  tag?: string;
  brand?: string;
  sku?: string;
  cost?: string;
  location?: UserLocationType;
};

const useLogEvent = () => {
  const onSuccess = useCallback((event: any) => {}, []);

  const onError = useCallback((error: any) => {
    showToast({ message: error?.message, type: 'error' });
  }, []);

  const [postEvent] = useAPI<EventPayload>({
    method: 'POST',
    endpoint: 'events',
    onSuccess,
    onError,
  });

  return postEvent;
};

export default useLogEvent;
