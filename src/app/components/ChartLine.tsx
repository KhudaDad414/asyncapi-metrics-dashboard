"use client"
import { ChartPoint } from "@/newrelic_api"
import { AreaChart } from "@tremor/react"
import numeral from "numeral"

type ChartLineProps = {
  title: string
  data: ChartPoint[]
  category: string
  sign?: string
}

export function ChartLine({ title, data, category, sign }: ChartLineProps) {
  const filteredData = data.map((point) => {
    const date = new Date(point.endTimeSeconds * 1000)
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return {
      date: formattedDate,
      [category]: point.result || 0,
    }
  })
  const customTooltip = (props: any) => {
    const { payload, active } = props
    if (!active || !payload) return null
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((category: any, idx: any) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div className={`flex w-1 flex-col bg-${category.color}-500 rounded`} />
            <div className="space-y-1">
              <p className="text-tremor-content">{category.dataKey}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {sign ? `${category.value}${sign}` : numeral(category.value).format("0a")}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
      <AreaChart
        className="mt-4 h-72"
        data={filteredData}
        index="date"
        categories={[category]}
        colors={["blue"]}
        yAxisWidth={30}
        customTooltip={customTooltip}
      />
    </div>
  )
}
