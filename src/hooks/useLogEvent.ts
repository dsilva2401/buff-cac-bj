import { showToast } from 'components/Toast/Toast';
import { UserLocationType } from 'context/global/GlobalContext';
import { useCallback } from 'react';
import { useAPI } from 'utils/api';

export type EventType = 'ENGAGEMENTS' | 'CONVERSION_RATES' | 'REVENUE';
export type EventName =
  | 'USER_SCAN_A_TAG'
  | 'USER_REGISTER'
  | 'REGISTRATIONS'
  | 'WEBSITE_VISITS'
  | 'REVENUE_GENERATED'
  | 'REDIRECTED_TO_YOUR_WEBSITE'
  | 'REDIRECTED_TO_ANOTHER_PAGE'
  | 'FLAGS_AN_ITEM_AS_LOST_OR_STOLEN'
  | 'HAS_A_LOST_ITEM_FOUND'
  | 'VIEW_PRODUCT_INFO'
  | 'SEND_A_REFERRAL_LINK'
  | 'RECEIVES_A_REFERRAL_COUPON'
  | 'WATCHES_AN_EMBEDDED_VIDEO'
  | 'MODULE_CLICKED'
  | 'SHOPPING_CHECK_OUT'
  | 'REFERRAL_LINK_COPIED';

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
  const onSuccess = useCallback((event: any) => {
    console.log(`Event logged => ${JSON.stringify(event)}`);
  }, []);

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
