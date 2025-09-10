import React from 'react';

// Tipagem para os props do componente
interface EntitySectionProps {
  title: string;
  items: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  renderItem: (item: any) => React.ReactNode;
  form: React.ReactNode;
}

const EntitySection: React.FC<EntitySectionProps> = ({
  title,
  items,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  renderItem,
  form,
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold">{title}</h2>

      {/* Container de Pesquisa e Lista */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full p-2 bg-transparent border border-white/20 rounded-md mb-4 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <ul className="space-y-2 h-48 overflow-y-auto pr-2">
          {items.map(renderItem)}
        </ul>
      </div>

      {/* Container do Formulário de Adição */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
        {form}
      </div>
    </div>
  );
};

export default EntitySection;
