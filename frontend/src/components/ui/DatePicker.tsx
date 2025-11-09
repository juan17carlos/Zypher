// frontend/src/components/ui/DatePicker.tsx
// Date Picker EXACTO como Bitrix24

import { forwardRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'

interface DatePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  label?: string
  placeholder?: string
  showTimeSelect?: boolean
  required?: boolean
  minDate?: Date
  maxDate?: Date
  timeFormat?: string
  timeIntervals?: number
  dateFormat?: string
}

// Custom Input Component
const CustomInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; placeholder?: string }
>(({ value, onClick, placeholder }, ref) => (
  <motion.button
    ref={ref}
    onClick={onClick}
    whileHover={{ borderColor: '#60A5FA' }}
    className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-4 pr-10 text-left border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
  >
    <span className={`block truncate ${value ? 'text-gray-900' : 'text-gray-500'}`}>
      {value || placeholder}
    </span>
    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <Calendar className="h-5 w-5 text-gray-400" />
    </span>
  </motion.button>
))

CustomInput.displayName = 'CustomInput'

export default function DatePicker({
  selected,
  onChange,
  label,
  placeholder = 'Seleccionar fecha',
  showTimeSelect = false,
  required = false,
  minDate,
  maxDate,
}: DatePickerProps) {

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          showTimeSelect={showTimeSelect}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat={showTimeSelect ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
          locale={es}
          minDate={minDate}
          maxDate={maxDate}
          customInput={<CustomInput placeholder={placeholder} />}
          calendarClassName="bitrix-calendar"
          popperClassName="bitrix-calendar-popper"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>

              <div className="text-white font-semibold text-base">
                {format(date, 'MMMM yyyy', { locale: es })}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          )}
        />
      </div>

      {/* Custom styles */}
      <style>{`
        .bitrix-calendar-popper {
          z-index: 9999;
        }

        .bitrix-calendar {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          font-family: inherit;
        }

        .react-datepicker__month-container {
          width: 320px;
        }

        .react-datepicker__month {
          padding: 1rem;
          margin: 0;
        }

        .react-datepicker__day-names {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
          padding: 0;
        }

        .react-datepicker__day-name {
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
        }

        .react-datepicker__week {
          display: flex;
          gap: 4px;
          margin-bottom: 4px;
        }

        .react-datepicker__day {
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #374151;
          transition: all 0.15s;
          cursor: pointer;
        }

        .react-datepicker__day:hover {
          background-color: #EFF6FF;
          color: #2563EB;
          transform: scale(1.05);
        }

        .react-datepicker__day--selected {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
        }

        .react-datepicker__day--selected:hover {
          background: linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%);
          transform: scale(1.05);
        }

        .react-datepicker__day--today {
          background-color: #DBEAFE;
          color: #1E40AF;
          font-weight: 600;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: #EFF6FF;
          color: #2563EB;
        }

        .react-datepicker__day--disabled {
          color: #D1D5DB;
          cursor: not-allowed;
        }

        .react-datepicker__day--disabled:hover {
          background-color: transparent;
          transform: none;
        }

        .react-datepicker__day--outside-month {
          color: #D1D5DB;
        }

        .react-datepicker__time-container {
          border-left: 1px solid #E5E7EB;
          width: 100px;
        }

        .react-datepicker__time-container .react-datepicker__time {
          background: white;
        }

        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
          width: 100px;
        }

        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
          padding: 0;
        }

        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
          height: 40px;
          line-height: 40px;
          padding: 0 1rem;
          font-size: 0.875rem;
          transition: all 0.15s;
        }

        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
          background-color: #EFF6FF;
          color: #2563EB;
        }

        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: white;
          font-weight: 600;
        }

        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </div>
  )
}
