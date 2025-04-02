import Chat from "../components/Chat/Chat";
import { usePDFFileStore } from "../stores/pdfFileStore";
import { useRef, useEffect } from "react";

/**
 * Container for handling Chat component state and logic
 */
const ChatContainer: React.FC = (): JSX.Element => {
  const { pdfFile, fileMetadata, isNewFile } = usePDFFileStore();
  const chatRef = useRef<() => void>();

  useEffect(() => {
    if (isNewFile && chatRef.current) {
      chatRef.current(); // Clear chat messages when a new file is loaded
    }
  }, [isNewFile]);

  return (
    <Chat
      pdfFile={pdfFile}
      fileName={fileMetadata.name || undefined}
      onClearMessages={(clearFn) => (chatRef.current = clearFn)} // Store the clear function
    />
  );
};

export default ChatContainer;
