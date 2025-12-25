import { useEffect, useState } from "react";
import { ZAFClient } from "zafclient";
import { User } from "node-zendesk/clients/core/users";

export function useCurrentUser(client: ZAFClient | null) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!client) return;
    client.get(["currentUser"]).then(({ currentUser }) => {
      setUser(currentUser as User);
    });
  }, [client]);

  return user;
}
