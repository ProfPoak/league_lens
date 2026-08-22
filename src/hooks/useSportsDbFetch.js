import { useState, useEffect, useRef } from "react";

export function useSportsDbFetch(buildUrl) {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const cacheRef = useRef(new Map());

    const url = buildUrl(); 

    useEffect(() => {
        if (!url) return; 
        
        // memory cache to avoid re-fetching information when navigating tabs
        if (cacheRef.current.has(url)) {
            setData(cacheRef.current.get(url));
            setStatus("success");
            return;
        }

        // local variable to avoid fetch collisions on a stale request
        let cancelled = false;
        setStatus("loading");
        setError(null);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`request failed: ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (cancelled) return;
                cacheRef.current.set(url, json);
                setData(json);
                setStatus("success");
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err);
                setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    const currentStatus = !url ? "idle" : status;
    const currentData = !url ? null : data;

    return { 
        data: currentData, 
        status: currentStatus, 
        error, 
        isLoading: currentStatus === "loading" 
    };
}