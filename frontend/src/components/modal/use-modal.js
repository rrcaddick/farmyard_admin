import { useCallback, useState } from "react";
import ModalBase from "./modal-base";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const Modal = useCallback(
    ({ children, containerRef }) => <ModalBase {...{ isOpen, open, close, children, containerRef }} />,
    [isOpen, open, close]
  );

  return {
    open,
    close,
    Modal,
  };
};

export default useModal;
