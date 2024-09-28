'use client'

import { useState, useRef, useEffect, useMemo, useCallback, KeyboardEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Customer } from '@/types'
import { CustomerQuery } from '@/queries'
import Banner from '@/components/Banner'
import Loader from '@/components/Loader'
import { cn } from '@/utils/styles'

interface CustomerPickerProps {
  selectedCustomer: string | null
  onSelectCustomer: (customerNumber: string | null) => void
}

function customerToString(customer: Customer): string {
  return `${customer.name} - ${customer.customer_number}`
}

export default function CustomerPicker({
  selectedCustomer: selectedCustomerNumber,
  onSelectCustomer
}: CustomerPickerProps) {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])

  const createCustomerId = 'create-new-customer'

  const {
    data: customers,
    isSuccess,
    isError,
    error,
    isLoading
  } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: CustomerQuery.getAll
  })

  const selectedCustomer = useMemo(
    () => customers?.find((c) => c.customer_number === selectedCustomerNumber),
    [customers, selectedCustomerNumber]
  )

  useEffect(() => {
    if (selectedCustomer) {
      setSearchTerm(customerToString(selectedCustomer))
    } else {
      setSearchTerm('')
    }
  }, [selectedCustomer])

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

  const filteredCustomers = useMemo(
    () =>
      customers?.filter((customer) => customerToString(customer).toLowerCase().includes(searchTerm.toLowerCase())) ||
      [],
    [customers, searchTerm]
  )

  const handleSelectCustomer = useCallback(
    (customerNumber: string) => {
      if (customerNumber === createCustomerId) {
        router.push('/customers/create?redirect=create-account')
      } else {
        onSelectCustomer(customerNumber)
      }
      setIsDropdownOpen(false)
    },
    [router, onSelectCustomer]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
      onSelectCustomer(null)
      setIsDropdownOpen(true)
      setFocusedIndex(-1)
    },
    [onSelectCustomer]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isDropdownOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prevIndex) => (prevIndex + 1) % (filteredCustomers.length + 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(
            (prevIndex) => (prevIndex - 1 + filteredCustomers.length + 1) % (filteredCustomers.length + 1)
          )
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < filteredCustomers.length) {
            handleSelectCustomer(filteredCustomers[focusedIndex].customer_number)
          } else if (focusedIndex === filteredCustomers.length) {
            handleSelectCustomer(createCustomerId)
          }
          setFocusedIndex(-1)
          break
      }
    },
    [isDropdownOpen, filteredCustomers, focusedIndex, handleSelectCustomer]
  )

  const filteredCustomerOptions = useMemo(
    () =>
      filteredCustomers.map((customer, index) => (
        <div
          key={customer.id}
          ref={(el) => {
            if (el) {
              optionRefs.current[index] = el
            }
          }}
          onClick={() => handleSelectCustomer(customer.customer_number)}
          className={cn('cursor-pointer px-3 py-2 hover:bg-gray-100', focusedIndex === index && 'bg-gray-100')}
        >
          {customerToString(customer)}
        </div>
      )),
    [filteredCustomers, handleSelectCustomer, focusedIndex]
  )

  return (
    <div className="relative space-y-4" ref={dropdownRef}>
      {isLoading ? (
        <div className="w-full rounded border bg-background p-2.5">
          <Loader data-style="accent" />
        </div>
      ) : null}
      {isSuccess ? (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search customers..."
            className="w-full"
            autoFocus
          />
          {isSuccess && isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg"
            >
              {filteredCustomerOptions}
              <div
                ref={(el) => {
                  if (el) {
                    optionRefs.current[filteredCustomers.length] = el
                  }
                }}
                onClick={() => handleSelectCustomer(createCustomerId)}
                className={cn(
                  'cursor-pointer px-3 py-2 hover:bg-gray-100',
                  focusedIndex === filteredCustomers.length && 'bg-gray-100'
                )}
              >
                Create New Customer
              </div>
            </div>
          )}
        </div>
      ) : null}
      {isError && <Banner type="error" message={error?.message} />}
    </div>
  )
}
