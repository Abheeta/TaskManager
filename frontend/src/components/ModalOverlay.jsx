import { useEffect } from "react";
import { createPortal } from "react-dom";

const ModalOverlay = ({ children, onClose }) => {
    useEffect(() => {
        document.body.style.overflowY = "hidden";
        return () => document.body.style.overflowY = "unset";
    }, []);

    const closeModal = (e) => {
        e.stopPropagation();
        if(onClose) onClose();
    }

    return createPortal(
        <div className="fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center bg-black/20 backdrop-blur-md" onClick={closeModal}>
            {children}
        </div>
    , document.body);
};

export default ModalOverlay;