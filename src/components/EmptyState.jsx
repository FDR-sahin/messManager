function EmptyState({ message }) {
  return (
    <div className="text-center py-16 text-slate2-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto mb-3 opacity-50">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v14l-4-2-2 2-2-2-2 2-4-2V6a2 2 0 0 1 2-2Z" />
      </svg>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
