'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { day: string; amount: number }[]
}

export function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Ingresos']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
