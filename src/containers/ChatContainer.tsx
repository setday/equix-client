import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Chat from "../components/Chat/Chat";
import { usePDFFileStore } from "../stores/pdfFileStore";
import { ChatMessage } from "../types";

export interface ChatContainerHandle {
  addMessage: (message: Partial<ChatMessage>) => void;
}

/**
 * Container for handling Chat component state and logic
 */
const ChatContainer = forwardRef<ChatContainerHandle>((_, ref) => {
  const { pdfFile, fileMetadata, isNewFile } = usePDFFileStore();
  const chatRef = useRef<() => void>();
  const addMessageRef = useRef<(message: Partial<ChatMessage>) => void>();

  useImperativeHandle(ref, () => ({
    addMessage: (message: Partial<ChatMessage>) => {
      if (addMessageRef.current) {
        addMessageRef.current(message);
      }
    },
  }));

  useEffect(() => {
    if (isNewFile && chatRef.current) {
      chatRef.current();
    }
  }, [isNewFile]);

  return (
    <Chat
      pdfFile={pdfFile}
      fileName={fileMetadata.name || undefined}
      onClearMessages={(clearFn) => (chatRef.current = clearFn)}
      onRegisterAddMessage={(addFn) => (addMessageRef.current = addFn)}
    />
  );
});

ChatContainer.displayName = "ChatContainer";

export default React.memo(ChatContainer);
