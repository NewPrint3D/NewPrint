"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Filter } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency } from "@/lib/intl"

interface ProductFilterControlsProps {
  initialFilterState?: FilterState
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  category: string
  priceRange: [number, number]
  colors: string[]
  materials: string[]
}

export function ProductFilterControls({ initialFilterState, onFilterChange }: ProductFilterControlsProps) {
  const { t, locale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>(
    initialFilterState || {
      category: "all",
      priceRange: [0, 100],
      colors: [],
      materials: [],
    },
  )

  useEffect(() => {
    if (initialFilterState) {
      setFilterState(initialFilterState)
    }
  }, [initialFilterState])

  const categories = [
    { value: "all", label: t.filters.categories.all },
    { value: "accessories", label: t.filters.categories.accessories },
    { value: "home", label: t.filters.categories.home },
  ]

  const colors = [
    { value: "#8B5CF6", label: "Purple" },
    { value: "#06B6D4", label: "Cyan" },
    { value: "#10B981", label: "Green" },
    { value: "#F59E0B", label: "Orange" },
    { value: "#EF4444", label: "Red" },
  ]

  const materials = ["PLA", "ABS", "PETG"]

  const handleCategoryChange = (category: string) => {
    const updatedFilterState = { ...filterState, category }
    setFilterState(updatedFilterState)
    onFilterChange(updatedFilterState)
  }

  const handlePriceChange = (value: number[]) => {
    const updatedFilterState = { ...filterState, priceRange: [value[0], value[1]] as [number, number] }
    setFilterState(updatedFilterState)
    onFilterChange(updatedFilterState)
  }

  const handleColorToggle = (hex: string) => {
    const newColors = filterState.colors.includes(hex)
      ? filterState.colors.filter((c) => c !== hex)
      : [...filterState.colors, hex]
    const updatedFilterState = { ...filterState, colors: newColors }
    setFilterState(updatedFilterState)
    onFilterChange(updatedFilterState)
  }

  const handleMaterialToggle = (mat: string) => {
    const newMaterials = filterState.materials.includes(mat)
      ? filterState.materials.filter((m) => m !== mat)
      : [...filterState.materials, mat]
    const updatedFilterState = { ...filterState, materials: newMaterials }
    setFilterState(updatedFilterState)
    onFilterChange(updatedFilterState)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-bold text-lg">{t.filters.title}</h3>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          <Filter className="w-4 h-4 mr-2" />
          {isOpen ? t.common.hideFilterPanel : t.common.showFilterPanel}
        </Button>
      </div>

      <div className={`space-y-4 ${isOpen ? "block" : "hidden lg:block"}`}>
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-bold mb-3 block">{t.filters.category}</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={filterState.category === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(cat.value)}
                  className="transition-all duration-200"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-bold mb-3 block">{t.filters.priceRange}</Label>
            <div className="space-y-4">
              <Slider
                min={0}
                max={100}
                step={5}
                value={filterState.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(filterState.priceRange[0], locale)}</span>
                <span>{formatCurrency(filterState.priceRange[1], locale)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-bold mb-3 block">{t.filters.colors}</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorToggle(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    filterState.colors.includes(color.value)
                      ? "border-primary ring-4 ring-primary/20"
                      : "border-border hover:border-primary"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-bold mb-3 block">{t.filters.materials}</Label>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <Button
                  key={material}
                  onClick={() => handleMaterialToggle(material)}
                  variant={filterState.materials.includes(material) ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-200"
                >
                  {material}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
