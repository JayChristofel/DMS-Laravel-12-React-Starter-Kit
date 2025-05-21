import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  availableTags?: string[];
  className?: string;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Tambahkan tag...",
  disabled = false,
  maxTags,
  availableTags = [],
  className,
}: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const filteredTags = React.useMemo(() => {
    const normalizedInput = inputValue.trim().toLowerCase();
    if (!normalizedInput) return [];
    
    return availableTags
      .filter((tag) => {
        const normalizedTag = tag.toLowerCase();
        return normalizedTag.includes(normalizedInput) && 
               !value.some(v => v.toLowerCase() === normalizedTag);
      })
      .slice(0, 5);
  }, [availableTags, inputValue, value]);

  const selectItem = React.useCallback(
    (tag: string) => {
      const normalizedTag = tag.trim();
      const exists = value.some(v => v.toLowerCase() === normalizedTag.toLowerCase());
      if (!exists && (!maxTags || value.length < maxTags)) {
        onChange([...value, normalizedTag]);
        setInputValue("");
        setOpen(false);
      }
    },
    [value, onChange, maxTags]
  );

  const handleUnselect = React.useCallback(
    (tag: string) => {
      onChange(value.filter((v) => v !== tag));
    },
    [value, onChange]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = inputRef.current;
      if (!input) return;

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        
        // Jika ada tag yang cocok di suggestions, pilih tag tersebut
        if (filteredTags.length > 0) {
          selectItem(filteredTags[0]);
          return;
        }
        
        // Jika tidak ada yang cocok dan input tidak kosong, tambahkan sebagai tag baru
        if (inputValue.trim() !== "") {
          const normalizedInput = inputValue.trim();
          // Cek apakah tag sudah ada (case insensitive)
          const exists = value.some(v => v.toLowerCase() === normalizedInput.toLowerCase());
          if (!exists && (!maxTags || value.length < maxTags)) {
            // Cek apakah tag ada di availableTags
            const existingTag = availableTags.find(
              t => t.toLowerCase() === normalizedInput.toLowerCase()
            );
            onChange([...value, existingTag || normalizedInput]);
            setInputValue("");
          }
        }
      }

      // Remove tag when pressing backspace
      if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
        handleUnselect(value[value.length - 1]);
      }
    },
    [inputValue, value, onChange, handleUnselect, maxTags, availableTags, filteredTags, selectItem]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative border flex min-h-10 w-full items-center flex-wrap gap-1.5 rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-2 py-0.5">
          {tag}
          <button
            type="button"
            className="rounded-full hover:bg-muted p-0.5 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleUnselect(tag);
            }}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setOpen(true);
        }}
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] max-w-full"
        placeholder={value.length > 0 ? "" : placeholder}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && filteredTags.length > 0 && (
        <div className="absolute mt-2 top-full left-0 w-full z-10">
          <Command className="rounded-md border shadow-md">
            <CommandGroup>
              {filteredTags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => selectItem(tag)}
                  className="cursor-pointer"
                >
                  {tag}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
} 