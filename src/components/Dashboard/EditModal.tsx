import React from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-gray-800/80 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-white"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal feche o modal
      >
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
        </header>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default EditModal;
