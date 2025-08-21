"use client"
import { createContext, useContext } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ChartContext = createContext({})

export function ChartContainer({ children, config }) {
  return (
    <ChartContext.Provider value={{ config }}>
      <TooltipProvider>{children}</TooltipProvider>
    </ChartContext.Provider>
  )
}

export function ChartTooltip({ children, ...props }) {
  return <Tooltip {...props}>{children}</Tooltip>
}

export function ChartTooltipTrigger({ children, ...props }) {
  return <TooltipTrigger {...props}>{children}</TooltipTrigger>
}

export function ChartTooltipContent({ children, ...props }) {
  const { config } = useContext(ChartContext)

  return (
    <TooltipContent {...props}>
      {({ payload, label, active }) => {
        if (!active || !payload?.length) {
          return null
        }

        return (
          <div className="space-y-2">
            {label && <div className="font-medium">{label}</div>}
            <div className="space-y-1">
              {payload.map((item, index) => {
                const color = config[item.dataKey]?.color || "currentColor"
                const label = config[item.dataKey]?.label || item.dataKey
                const value = item.value

                return (
                  <div key={index} className="flex items-center">
                    <div
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: color,
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {label}: {value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }}
    </TooltipContent>
  )
}
