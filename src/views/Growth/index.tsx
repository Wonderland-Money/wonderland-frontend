import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Charts } from "./Charts";

export const Growth = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Charts />
        </QueryClientProvider>
    );
};
