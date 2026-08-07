const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, {method="GET", body}={}){
    const response = await fetch(`${BASE_URL}${path}`,{
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
    });

    const raw= await response.text();
    let data ;
    
    try{
        data= raw? JSON.parse(raw): null;
    }
    catch{
        data=raw;
    }

    if(!response.ok){
        const message = (data && data.message) || (typeof data === "string" ? data : "Request failed");
        throw new Error(message);
    }
    return data;
}