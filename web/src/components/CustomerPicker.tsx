'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Customer } from '@/types'
import { CustomerQuery } from '@/queries'
import { useState, useRef, useEffect } from 'react'

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
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: customers, isSuccess } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: CustomerQuery.getAll
  })

  const selectedCustomer = customers?.find((c) => c.customer_number === selectedCustomerNumber)

  useEffect(() => {
    if (selectedCustomer) {
      setSearchTerm(customerToString(selectedCustomer))
    } else {
      setSearchTerm('')
    }
  }, [selectedCustomer])

  const filteredCustomers =
    customers?.filter((customer) => customerToString(customer).toLowerCase().includes(searchTerm.toLowerCase())) || []

  const handleSelectCustomer = (customerNumber: string) => {
    if (customerNumber === 'create-new-customer') {
      router.push('/customers/create?redirect=create-account')
    } else {
      onSelectCustomer(customerNumber)
    }
    setIsDropdownOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    onSelectCustomer(null)
    setIsDropdownOpen(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative space-y-4" ref={dropdownRef}>
      {isSuccess && (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search customers..."
            className="w-full"
            autoFocus
          />
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer.customer_number)}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                >
                  {customerToString(customer)}
                </div>
              ))}
              <div
                onClick={() => handleSelectCustomer('create-new-customer')}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              >
                Create New Customer
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
