import { useEffect, useState } from "react"
import { ZAFClient } from "zafclient";

let zafClient: ZAFClient;

export function useZafClient() {
  const [client, setClient] = useState(zafClient)
useEffect(() => {
    if (!client && typeof window.ZAFClient !== 'undefined') {
      zafClient = window.ZAFClient.init();
      setClient(zafClient);
      
      if(!zafClient) {
          console.info("❌ ZAFClient null", zafClient)
        }
        console.info("✅ ZAFClient not null", zafClient)
    }
  }, [client])
return client
}