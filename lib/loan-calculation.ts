export const LOAN_DURATIONS = [12, 24, 36, 48, 60]
export const LOAN_AMOUNTS = [
  50000, 100000, 150000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1200000, 1500000,
  1800000, 2000000,
]

export function calculateMonthlyInstallment(amount: number, months: number): number {
  return Math.round(amount / months)
}

export interface LoanOption {
  duration: number
  amount: number
  monthlyInstallment: number
}

export function getLoanOptions(): LoanOption[] {
  const options: LoanOption[] = []
  for (const amount of LOAN_AMOUNTS) {
    for (const duration of LOAN_DURATIONS) {
      options.push({
        duration,
        amount,
        monthlyInstallment: calculateMonthlyInstallment(amount, duration),
      })
    }
  }
  return options
}
