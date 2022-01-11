import { showToast } from "components/Toast/Toast";
import { useCallback } from "react";
import { useAPI } from "utils/api"

interface EventPayload {
  name: string,
  type: string,
  data: any
}

const useLogEvent = () => {
  const onSuccess = useCallback((event: any) => {
    console.log(`Event logged => ${JSON.stringify(event)}`)
  }, []);

  const onError = useCallback((error: any) => {
    showToast({ message: error?.message, type: 'error' })
  }, []);

  const [postEvent] = useAPI<EventPayload>({
    method: 'POST',
    endpoint: 'events',
    onSuccess,
    onError,
  })

  return postEvent;
}

export default useLogEvent
