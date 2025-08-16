import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface Tag {
  id: number
  name: string
}

interface TagsInputProps {
  tags: Tag[]
  selectedTags: number[]
  onTagsChange: (selectedTags: number[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TagsInput({
  tags = [],
  selectedTags = [],
  onTagsChange,
  placeholder = "Pilih tag...",
  disabled = false,
  className,
}: TagsInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)

  // Memastikan selectedTags selalu array, bukan null/undefined
  const safeSelectedTags = React.useMemo(() => 
    Array.isArray(selectedTags) ? selectedTags : []
  , [selectedTags])

  // Memastikan tags selalu array, bukan null/undefined
  const safeTags = React.useMemo(() => 
    Array.isArray(tags) ? tags : []
  , [tags])

  const handleSelect = React.useCallback(
    (tagId: number) => {
      if (safeSelectedTags.includes(tagId)) {
        onTagsChange(safeSelectedTags.filter((id) => id !== tagId))
      } else {
        onTagsChange([...safeSelectedTags, tagId])
      }

      setInputValue("")
    },
    [safeSelectedTags, onTagsChange]
  )

  const handleRemove = React.useCallback(
    (tagId: number) => {
      onTagsChange(safeSelectedTags.filter((id) => id !== tagId))
    },
    [safeSelectedTags, onTagsChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      
      // Find tag that starts with input value
      const matchingTag = safeTags.find(tag => 
        tag.name.toLowerCase().startsWith(inputValue.toLowerCase()) && 
        !safeSelectedTags.includes(tag.id)
      )
      
      if (matchingTag) {
        handleSelect(matchingTag.id)
      }
    }
  }

  // Filter tags based on input
  const filteredTags = React.useMemo(() => {
    if (!inputValue.trim()) return []
    
    return safeTags.filter((tag) => 
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !safeSelectedTags.includes(tag.id)
    )
  }, [safeTags, inputValue, safeSelectedTags])

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="border flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs focus-within:ring-2 focus-within:ring-ring"
        onClick={() => inputRef.current?.focus()}
      >
        {safeSelectedTags.length > 0 && (
          <>
            {safeSelectedTags.map((tagId) => {
              const tag = safeTags.find((t) => t.id === tagId)
              if (!tag) return null
              return (
                <Badge key={tag.id} variant="secondary" className="flex items-center gap-1 px-2 py-0.5">
                  {tag.name}
                  <button
                    type="button"
                    className="rounded-full hover:bg-muted p-0.5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(tag.id)
                    }}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </>
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          onKeyDown={handleKeyDown}
          placeholder={safeSelectedTags.length > 0 ? "" : placeholder}
          className="flex-1 bg-transparent outline-none border-none px-1 py-0.5 placeholder:text-muted-foreground w-20"
          disabled={disabled}
        />
      </div>
      
      {open && filteredTags.length > 0 && (
        <div className="absolute top-full left-0 z-10 w-full mt-1 rounded-md border bg-popover shadow-md animate-in fade-in-80">
          <ul className="max-h-[200px] overflow-auto py-1">
            {filteredTags.map((tag) => (
              <li
                key={tag.id}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(tag.id)
                }}
                className="flex cursor-pointer items-center px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
              >
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 