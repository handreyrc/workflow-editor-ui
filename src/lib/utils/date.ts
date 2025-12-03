import { format } from 'date-fns'

export const formatDate = (time: string | number, frmt: string = 'yyyy-MM-dd HH:mm:ss') => {
  return format(new Date(time), frmt)
}

