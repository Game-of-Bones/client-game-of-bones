interface DeleteConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
  }
  
  const DeleteConfirmModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isDeleting = false
  }: DeleteConfirmModalProps) => {
    if (!isOpen) return null;
  
    return (
      // Overlay
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={onCancel}
      >
        {/* Modal Content */}
        <div 
          className="bg-[#462e1b] rounded-xl p-6 sm:p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-red-400 mb-3">{title}</h3>
          <p className="text-white/80 mb-6 text-base sm:text-lg">{message}</p>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel} 
              disabled={isDeleting}
              className="py-2 px-5 rounded-full text-white bg-gray-500/50 hover:bg-gray-500/70 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm} 
              disabled={isDeleting}
              className="py-2 px-5 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteConfirmModal;