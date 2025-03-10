"use client"

import type React from "react"

import { useState } from "react"
import { CheckIcon, Loader2Icon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {HttpMethod} from "@/lib/common/models/HttpMethod";
import {ContentType} from "@/lib/common/models/ContentType";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? ''

interface User {
  id: string,
  businessId: string,
}

interface Business {
  id: string,
  name: string,
}

export default function PhoneSearchForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isFound, setIsFound] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [user, setUser] = useState<User | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])

  // Validate phone number format
  const isValidPhoneNumber = (number: string) => {
    // Basic validation - can be enhanced based on your requirements
    return /^\d{9,10}$/.test(number)
  }

  // Handle phone number search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidPhoneNumber(phoneNumber)) {
      toast({
        title: "Invalido número de teléfono",
        description: "Por favor, ingresa un número de teléfono válido.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    try {
      const fetchedUser = await (await fetch(
        `/api/user?phone=${phoneNumber}`,
        {
          method: HttpMethod.GET,
          headers: {
            "Content-Type": ContentType.ApplicationJson,
            "x-debug-key": API_KEY,
          },
        }
      )).json()

      const fetchedBusinesses = await (await fetch(
        `/api/business`,
        {
          method: HttpMethod.GET,
          headers: {
            "Content-Type": ContentType.ApplicationJson,
            "x-debug-key": API_KEY,
          },
        }
      )).json()

      setUser(fetchedUser)
      setBusinesses(fetchedBusinesses)
      if (fetchedUser) {
        setSelectedBusiness(fetchedUser.businessId)
      }
      setIsFound(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al buscar el número de teléfono. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Handle radio selection
  const handleRadioChange = (businessId: string) => {
    setSelectedBusiness(businessId)
  }

  // Handle submission of selected item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBusiness) {
      toast({
        title: "Negocio no seleccionado",
        description: "Por favor, selecciona un negocio para continuar.",
        variant: "destructive",
      })
      return
    }

    try {
      await fetch(
        `/api/user`,
        {
          method: HttpMethod.POST,
          headers: {
            "Content-Type": ContentType.ApplicationJson,
            "x-debug-key": API_KEY,
          },
          body: JSON.stringify({
            userId: user?.id,
            phoneNumber: phoneNumber,
            businessId: selectedBusiness,
          }),
        }
      )

      setPhoneNumber("")
      setIsFound(false)
      setSelectedBusiness("")

      const selectedBusinessName = businesses.find((item) => item.id === selectedBusiness)?.name

      toast({
        title: "Item submitted successfully",
        description: (
          <div className="mt-2">
            <p>Negocio seleccionado:</p>
            <p className="font-medium mt-1">{selectedBusinessName}</p>
          </div>
        ),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar la selección. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Reset the form
  const handleReset = () => {
    setPhoneNumber("")
    setIsFound(false)
    setSelectedBusiness("")
  }

  return (
    <div className="flex justify-center items-center h-[100dvh]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Número de teléfono de usuario</CardTitle>
          <CardDescription>Ingresa un número de teléfono y después selecciona el negocio al que pertenecerá.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Número de teléfono</Label>
              <div className="flex space-x-2">
                <Input
                  id="phone-number"
                  placeholder="e.g., 123-456-7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isSearching || isFound}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSearching || isFound || !phoneNumber} className="w-24">
                  {isSearching ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <SearchIcon className="h-4 w-4 mr-1" /> Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {isFound && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Negocios disponibles</h3>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Resetear
                </Button>
              </div>
              <RadioGroup value={selectedBusiness} onValueChange={handleRadioChange} className="space-y-3">
                {businesses.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.id} id={item.id} />
                    <Label htmlFor={item.id} className="cursor-pointer">
                      {item.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>

        {isFound && (
          <CardFooter>
            <Button onClick={handleSubmit} disabled={!selectedBusiness} className="w-full">
              <CheckIcon className="h-4 w-4 mr-1" /> Submit Selection
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

