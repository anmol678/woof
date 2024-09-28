import { useState, useRef, useEffect, useMemo, useCallback, KeyboardEvent } from 'react'
import { cn } from '@/utils/styles'

interface PickerProps<T> {
  options: T[]
  getOptionLabel: (option: T) => string
  getOptionValue: (option: T) => string
  onSelect: (value: string | null) => void
  selectedOption: string | null
  placeholder: string
  createNewOption?: {
    label: string
    value: string
  }
}

export default function Picker<T>({
  options,
  getOptionLabel,
  getOptionValue,
  onSelect,
  selectedOption,
  placeholder,
  createNewOption
}: PickerProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(getOptionLabel(options.find((option) => getOptionValue(option) === selectedOption)!))
    } else {
      setSearchTerm('')
    }
  }, [options, selectedOption, getOptionValue, getOptionLabel])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFocusedIndex(-1)
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (focusedIndex >= 0 && dropdownRef.current && optionRefs.current[focusedIndex]) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect()
      const optionRect = optionRefs.current[focusedIndex]!.getBoundingClientRect()

      if (optionRect.bottom > dropdownRect.bottom) {
        dropdownRef.current.scrollTop += optionRect.bottom - dropdownRect.bottom
      } else if (optionRect.top < dropdownRect.top) {
        dropdownRef.current.scrollTop -= dropdownRect.top - optionRect.top
      }
    }
  }, [focusedIndex])

  const filteredOptions = useMemo(
    () => options.filter((option) => getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())),
    [options, getOptionLabel, searchTerm]
  )

  const handleSelectOption = useCallback(
    (value: string) => {
      onSelect(value)
      setIsDropdownOpen(false)
    },
    [onSelect]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
      onSelect(null)
      setIsDropdownOpen(true)
      setFocusedIndex(-1)
    },
    [onSelect]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isDropdownOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prevIndex) => (prevIndex + 1) % (filteredOptions.length + 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prevIndex) => (prevIndex - 1 + filteredOptions.length + 1) % (filteredOptions.length + 1))
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelectOption(getOptionValue(filteredOptions[focusedIndex]))
          } else if (focusedIndex === filteredOptions.length) {
            handleSelectOption(createNewOption!.value)
          }
          setFocusedIndex(-1)
          break
      }
    },
    [isDropdownOpen, filteredOptions, focusedIndex, handleSelectOption, createNewOption, getOptionValue]
  )

  const renderOptions = useMemo(
    () =>
      filteredOptions.map((option, index) => (
        <div
          key={getOptionValue(option)}
          ref={(el) => {
            if (el) {
              optionRefs.current[index] = el
            }
          }}
          onClick={() => handleSelectOption(getOptionValue(option))}
          className={cn('cursor-pointer px-3 py-2 hover:bg-gray-100', focusedIndex === index && 'bg-gray-100')}
        >
          {getOptionLabel(option)}
        </div>
      )),
    [filteredOptions, getOptionLabel, getOptionValue, handleSelectOption, focusedIndex]
  )

  return (
    <div className="relative space-y-4">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full"
          autoFocus
        />
        {isDropdownOpen && (
          <div
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg"
            ref={dropdownRef}
          >
            {renderOptions}
            {createNewOption && (
              <div
                ref={(el) => {
                  if (el) {
                    optionRefs.current[filteredOptions.length] = el
                  }
                }}
                onClick={() => handleSelectOption(createNewOption.value)}
                className={cn(
                  'cursor-pointer px-3 py-2 hover:bg-gray-100',
                  focusedIndex === filteredOptions.length && 'bg-gray-100'
                )}
              >
                {createNewOption.label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
