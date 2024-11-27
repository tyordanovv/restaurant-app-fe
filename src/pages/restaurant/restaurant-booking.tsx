import React, { useState, MouseEvent } from 'react';
import { Plus, Minus } from 'lucide-react';

// Custom Card Component
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Custom Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  size = 'md',
  variant = 'default',
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: 'bg-blue-500 hover:bg-blue-600 text-white',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md transition-colors duration-200 
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
    >
      {children}
    </button>
  );
};

// Custom Input Component
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'text',
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      placeholder-gray-400
      ${className}`}
  />
);

// Types
interface Position {
  x: number;
  y: number;
}

interface Table {
  id: number;
  seats: number;
  isReserved: boolean;
  note: string;
  position: Position;
}

interface DragStart {
  x: number;
  y: number;
}

const RestaurantBooking: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, seats: 2, isReserved: false, note: '', position: { x: 50, y: 50 } },
    { id: 2, seats: 4, isReserved: false, note: '', position: { x: 200, y: 50 } },
    { id: 3, seats: 6, isReserved: false, note: '', position: { x: 350, y: 50 } },
  ]);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<DragStart>({ x: 0, y: 0 });

  const addNewTable = (): void => {
    const newId = Math.max(...tables.map(t => t.id), 0) + 1;
    const newTable: Table = {
      id: newId,
      seats: 2,
      isReserved: false,
      note: '',
      position: { x: 50, y: 50 }
    };
    setTables([...tables, newTable]);
    setSelectedTable(newTable);
  };

  const deleteTable = (tableId: number): void => {
    setTables(tables.filter(table => table.id !== tableId));
    if (selectedTable?.id === tableId) {
      setSelectedTable(null);
    }
  };

  const adjustSeats = (tableId: number, change: number): void => {
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, seats: Math.max(1, Math.min(12, table.seats + change)) }
        : table
    ));
  };

  const handleTableClick = (table: Table): void => {
    setSelectedTable(table);
  };

  const handleReserve = (): void => {
    if (selectedTable) {
      setTables(tables.map(table =>
        table.id === selectedTable.id
          ? { ...table, isReserved: !table.isReserved }
          : table
      ));
    }
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (selectedTable) {
      setTables(tables.map(table =>
        table.id === selectedTable.id
          ? { ...table, note: event.target.value }
          : table
      ));
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, table: Table): void => {
    setIsDragging(true);
    setSelectedTable(table);
    setDragStart({
      x: e.clientX - table.position.x,
      y: e.clientY - table.position.y
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (isDragging && selectedTable) {
      setTables(tables.map(table =>
        table.id === selectedTable.id
          ? {
              ...table,
              position: {
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
              }
            }
          : table
      ));
    }
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-screen p-4">
      <div className="flex gap-4">
        <div 
          className="relative border border-gray-200 rounded-lg w-3/4 h-[600px]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {tables.map(table => (
            <div
              key={table.id}
              className={`absolute cursor-move select-none ${
                selectedTable?.id === table.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                left: table.position.x,
                top: table.position.y
              }}
              onClick={() => handleTableClick(table)}
              onMouseDown={(e) => handleMouseDown(e, table)}
            >
              <Card className={`p-2 text-center w-28 ${
                table.isReserved ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <div className="font-bold">Table {table.id}</div>
                <div className="flex justify-center items-center gap-2 my-1">
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustSeats(table.id, -1);
                    }}
                    className="p-1 hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">{table.seats} seats</span>
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustSeats(table.id, 1);
                    }}
                    className="p-1 hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {table.note && (
                  <div className="text-xs text-gray-600 truncate w-24" title={table.note}>
                    📝 {table.note}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        <Card className="p-4 w-1/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Table Details</h2>
            <Button 
              onClick={addNewTable}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Table
            </Button>
          </div>
          
          {selectedTable ? (
            <div className="space-y-4">
              <div>
                <div className="font-medium">Table {selectedTable.id}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    size="sm"
                    onClick={() => adjustSeats(selectedTable.id, -1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span>{selectedTable.seats} seats</span>
                  <Button 
                    size="sm"
                    onClick={() => adjustSeats(selectedTable.id, 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleReserve}
                  className={selectedTable.isReserved ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                >
                  {selectedTable.isReserved ? 'Make Available' : 'Reserve Table'}
                </Button>

                <Button 
                  onClick={() => deleteTable(selectedTable.id)}
                  variant="destructive"
                  className="w-full"
                >
                  Delete Table
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Note:</label>
                <Input
                  value={tables.find(t => t.id === selectedTable.id)?.note || ''}
                  onChange={handleNoteChange}
                  placeholder="Add a note..."
                />
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Select a table to view details</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RestaurantBooking;