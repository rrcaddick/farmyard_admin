import { useCallback, useState, createContext, useMemo, useContext } from "react";
import ModalBase from "./modal-base";

const ModalContext = createContext({
  open: () => {},
  close: () => {},
  isOpen: false,
  openContext: null,
});

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openContext, setOpenContext] = useState();

  const open = useCallback((openContext) => {
    openContext && setOpenContext(openContext);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    openContext && setOpenContext(null);
    setIsOpen(false);
  }, [openContext]);

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen,
      openContext,
    }),
    [open, close, isOpen, openContext]
  );

  const Modal = useCallback(
    ({ children, modalProps, containerProps, closeIconProps }) => (
      <ModalContext.Provider {...{ value }}>
        <ModalBase {...{ ...value, children, modalProps, containerProps, closeIconProps }} />
      </ModalContext.Provider>
    ),
    [value]
  );

  return {
    open,
    close,
    Modal,
  };
};

export const useModalContext = () => useContext(ModalContext);

export default useModal;
