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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50" onClick={onClose}>
      <div 
        className="bg-black/40 border border-white/20 rounded-xl shadow-lg p-8 w-full max-w-lg text-white relative" 
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
      >
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        {children}

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default EditModal;
