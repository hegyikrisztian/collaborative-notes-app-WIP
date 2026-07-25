import { RefObject } from "react";

const useDialog = (ref: RefObject<HTMLDialogElement | null>) => {

    function toggleDialog() {
        if (!ref.current)
            return

        ref.current.hasAttribute('open') ?
            ref.current.close()
            :
            ref.current.showModal()
    }

    return { toggleDialog }
}

export default useDialog;