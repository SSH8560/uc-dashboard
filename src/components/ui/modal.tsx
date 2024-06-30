export default function Modal({ children }: React.PropsWithChildren) {
  return (
    <div className="fixed inset-0 w-full h-full bg-gray-950 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">{children}</div>
    </div>
  );
}
