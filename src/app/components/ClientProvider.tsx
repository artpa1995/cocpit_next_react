// components/ClientProvider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../../lib/store";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ClientProvider;