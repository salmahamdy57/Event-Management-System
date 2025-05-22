import { useEffect } from "react";

export default function ErrorBar({error, setError}){

    useEffect(() => {
        if(error !== ""){
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }, [error]);

    return (
        <div className='error-banner'>{error}</div>
    );
}