export type Car = {
  id?: number
  brand: string
  model: string
  year: number
  plateNumber: string
  color: string
}

export type AuthResponse = { token: string }  // para cuando cableemos JWT