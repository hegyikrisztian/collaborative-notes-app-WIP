import { ArrowPathIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid";

type LiveLoadingIndicatorProps = {
    isLoading: boolean
}

export const LiveLoadingIndicator = ({ isLoading }: LiveLoadingIndicatorProps) => {
    return ( 
        <div>
            {isLoading ? <ArrowPathIcon className="w-5 animate-spin"/> : <ClipboardDocumentCheckIcon className="w-5"/>}
        </div>
    );
}