"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CHF"
  | "CNY"
  | "INR"
  | "BRL"
  | "MXN"
  | "ZAR"
  | (string & {})

type CurrencyMeta = {
  symbol: string
  // Simple relative rate vs USD for demo purposes
  rateToUSD: number
}

const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  USD: { symbol: "$", rateToUSD: 1 },
  EUR: { symbol: "€", rateToUSD: 1.08 },
  GBP: { symbol: "£", rateToUSD: 1.27 },
  JPY: { symbol: "¥", rateToUSD: 0.0064 },
  CAD: { symbol: "C$", rateToUSD: 0.73 },
  AUD: { symbol: "A$", rateToUSD: 0.67 },
  CHF: { symbol: "CHF", rateToUSD: 1.12 },
  CNY: { symbol: "¥", rateToUSD: 0.14 },
  INR: { symbol: "₹", rateToUSD: 0.012 },
  BRL: { symbol: "R$", rateToUSD: 0.19 },
  MXN: { symbol: "$", rateToUSD: 0.057 },
  ZAR: { symbol: "R", rateToUSD: 0.055 },
}

type CurrencyContextValue = {
  currency: CurrencyCode
  symbol: string
  /**
   * Format a numeric amount (assumed to be in USD by default) in the current currency.
   */
  format: (amount: number, options?: Intl.NumberFormatOptions) => string
  /**
   * Convert an amount from another currency (default USD) into the current currency.
   */
  convert: (amount: number, fromCurrency?: CurrencyCode) => number
  /**
   * Update the current currency preference (persists to localStorage).
   */
  setCurrency: (code: CurrencyCode) => void
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

const STORAGE_KEY = "dashboard_currency"

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD")

  // Load initial currency from localStorage (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null
    if (stored && CURRENCY_META[stored as CurrencyCode]) {
      setCurrencyState(stored)
    }
  }, [])

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, code)
    }
  }

  const value = useMemo<CurrencyContextValue>(() => {
    const meta = CURRENCY_META[currency] ?? CURRENCY_META.USD

    const format = (amount: number, options?: Intl.NumberFormatOptions) => {
      const formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency in CURRENCY_META ? (currency as string) : "USD",
        maximumFractionDigits: 2,
        ...options,
      })

      // Assume incoming amounts are in USD and convert into the target currency
      const converted = convert(amount)
      return formatter.format(converted)
    }

    const convert = (amount: number, fromCurrency: CurrencyCode = "USD") => {
      const fromMeta = CURRENCY_META[fromCurrency] ?? CURRENCY_META.USD
      const baseInUSD = amount * fromMeta.rateToUSD
      const targetAmount = baseInUSD / meta.rateToUSD
      return targetAmount
    }

    return {
      currency,
      symbol: meta.symbol,
      format,
      convert,
      setCurrency,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return ctx
}


