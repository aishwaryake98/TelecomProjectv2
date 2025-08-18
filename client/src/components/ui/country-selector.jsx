import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const countries = [
  { code: "+91", name: "India", flag: "🇮🇳", country: "IN" },
  { code: "+1", name: "United States", flag: "🇺🇸", country: "US" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", country: "GB" },
  { code: "+86", name: "China", flag: "🇨🇳", country: "CN" },
  { code: "+81", name: "Japan", flag: "🇯🇵", country: "JP" },
  { code: "+49", name: "Germany", flag: "🇩🇪", country: "DE" },
  { code: "+33", name: "France", flag: "🇫🇷", country: "FR" },
  { code: "+39", name: "Italy", flag: "🇮🇹", country: "IT" },
  { code: "+34", name: "Spain", flag: "🇪🇸", country: "ES" },
  { code: "+7", name: "Russia", flag: "🇷🇺", country: "RU" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", country: "BR" },
  { code: "+61", name: "Australia", flag: "🇦🇺", country: "AU" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", country: "KR" },
  { code: "+65", name: "Singapore", flag: "🇸🇬", country: "SG" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", country: "MY" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", country: "TH" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", country: "ID" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", country: "PH" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", country: "VN" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", country: "PK" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", country: "BD" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", country: "LK" },
  { code: "+977", name: "Nepal", flag: "🇳🇵", country: "NP" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪", country: "AE" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", country: "SA" },
];

export function CountrySelector({ value, onValueChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  
  const selectedCountry = countries.find(country => country.code === value) || countries[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[140px] justify-between"
          disabled={disabled}
          data-testid="country-selector-trigger"
        >
          <div className="flex items-center">
            <span className="mr-2 text-lg" role="img" aria-label={selectedCountry.name}>
              {selectedCountry.flag}
            </span>
            <span className="font-mono text-sm">{selectedCountry.code}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search country..." 
            data-testid="country-search-input"
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {countries.map((country) => (
              <CommandItem
                key={country.country}
                value={`${country.name} ${country.code}`}
                onSelect={() => {
                  onValueChange(country.code);
                  setOpen(false);
                }}
                data-testid={`country-option-${country.country}`}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country.code ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center">
                  <span className="mr-3 text-lg" role="img" aria-label={country.name}>
                    {country.flag}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{country.name}</span>
                    <span className="text-sm text-muted-foreground font-mono">{country.code}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CountrySelector;