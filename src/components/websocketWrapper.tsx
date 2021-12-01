type WebSocketWrapperType = {
  children: React.ReactNode;
};

export default function WebSocketWrapper({ children }: WebSocketWrapperType) {
  return <>{children}</>;
}
