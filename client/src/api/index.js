import axios from 'axios'

// Production backend URL (Render)
const API = axios.create({
  baseURL: 'https://equisplit-meer.onrender.com'
})

// Attach token automatically on every request
API.interceptors.request.use((req) => {
  const profile = JSON.parse(localStorage.getItem('profile'))

  if (profile?.accessToken) {
    req.headers.Authorization = `token ${profile.accessToken}`
  }

  return req
})

// ===================== AUTH =====================

export const loginIn = (formData) =>
  API.post('/api/users/v1/login', formData)

export const register = (formData) =>
  API.post('/api/users/v1/register', formData)

export const deleteUser = (formData) =>
  API.delete('/api/users/v1/delete', { data: formData })

export const updatePassword = (formData) =>
  API.post('/api/users/v1/updatePassword', formData)

export const getUser = (formData) =>
  API.post('/api/users/v1/view', formData)

export const editUser = (formData) =>
  API.post('/api/users/v1/edit', formData)

export const getEmailList = () =>
  API.get('/api/users/v1/emailList')

// ===================== GROUP =====================

export const getUserGroups = (formData) =>
  API.post('/api/group/v1/user', formData)

export const createGroup = (formData) =>
  API.post('/api/group/v1/add', formData)

export const editGroup = (formData) =>
  API.post('/api/group/v1/edit', formData)

export const getGroupDetails = (formData) =>
  API.post('/api/group/v1/view', formData)

export const getSettle = (formData) =>
  API.post('/api/group/v1/settlement', formData)

export const makeSettle = (formData) =>
  API.post('/api/group/v1/makeSettlement', formData)

// ===================== EXPENSE =====================

export const getGroupExpense = (formData) =>
  API.post('/api/expense/v1/group', formData)

export const addExpense = (formData) =>
  API.post('/api/expense/v1/add', formData)

export const editExpense = (formData) =>
  API.post('/api/expense/v1/edit', formData)

export const deleteExpense = (formData) =>
  API.delete('/api/expense/v1/delete', { data: formData })

export const getGroupCategoryExp = (formData) =>
  API.post('/api/expense/v1/group/categoryExp', formData)

export const getGroupMonthlyExp = (formData) =>
  API.post('/api/expense/v1/group/monthlyExp', formData)

export const getGroupDailyExp = (formData) =>
  API.post('/api/expense/v1/group/dailyExp', formData)

export const getUserExpense = (formData) =>
  API.post('/api/expense/v1/user', formData)

export const getUserMonthlyExp = (formData) =>
  API.post('/api/expense/v1/user/monthlyExp', formData)

export const getUserDailyExp = (formData) =>
  API.post('/api/expense/v1/user/dailyExp', formData)

export const getUserCategoryExp = (formData) =>
  API.post('/api/expense/v1/user/categoryExp', formData)

export const getRecentUserExp = (formData) =>
  API.post('/api/expense/v1/user/recent', formData)

export const getExpDetails = (formData) =>
  API.post('/api/expense/v1/view', formData)

// ===================== PAYMENT =====================

export const createRazorpayOrder = (formData) =>
  API.post('/api/payment/v1/create-order', formData)

export const verifyRazorpayPayment = (formData) =>
  API.post('/api/payment/v1/verify', formData)
