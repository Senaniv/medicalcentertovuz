"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  required?: boolean;
}

const AZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr"
];

const AZ_WEEKDAYS = ["Be", "Ça", "Çə", "Ca", "Cü", "Şə", "Ba"];

export default function DatePicker({ value, onChange, required = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse initial date value or default to today
  const initialDate = value ? new Date(value) : new Date();
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date to YYYY-MM-DD
  const formatYYYYMMDD = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  // Format date to Azerbaijani readable format
  const formatAzReadable = (dateStr: string) => {
    if (!dateStr) return "Tarix seçin *";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Tarix seçin *";
    return `${d.getDate()} ${AZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // First day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    // Adjust to Monday start (0 = Monday, ..., 6 = Sunday)
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    const selectedDateStr = formatYYYYMMDD(viewYear, viewMonth, day);
    onChange(selectedDateStr);
    setIsOpen(false);
  };

  // Generate days array
  const dayCells = [];
  // Padding cells
  for (let i = 0; i < firstDay; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-9 w-9" />);
  }

  // Active days cells
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(viewYear, viewMonth, day);
    cellDate.setHours(0, 0, 0, 0);

    const isPast = cellDate < today;
    const isSelected = value === formatYYYYMMDD(viewYear, viewMonth, day);
    const isToday = today.getTime() === cellDate.getTime();

    dayCells.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={isPast}
        onClick={() => handleDaySelect(day)}
        className={`h-9 w-9 text-xs rounded-xl flex items-center justify-center font-bold font-sans transition-all ${
          isSelected
            ? "bg-secondary text-white shadow-md hover:bg-secondary-hover"
            : isToday
            ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            : isPast
            ? "text-slate-300 cursor-not-allowed font-normal"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 text-sm bg-white transition-all flex items-center justify-between text-left font-sans"
      >
        <span className={value ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}>
          {formatAzReadable(value)}
        </span>
        <CalendarIcon className="h-4.5 w-4.5 text-slate-400" />
      </button>

      {/* Hidden input to make HTML validation work if required */}
      <input
        type="text"
        tabIndex={-1}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        required={required}
        value={value}
        onChange={() => {}}
      />

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-55 mt-2 left-0 right-0 bg-white border border-slate-150 rounded-2xl shadow-xl p-4 animate-fade-in max-w-sm mx-auto">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-extrabold text-slate-800 font-sans">
              {AZ_MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {AZ_WEEKDAYS.map((day) => (
              <span key={day} className="text-[10px] font-black text-slate-400 uppercase font-sans">
                {day}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 justify-items-center">
            {dayCells}
          </div>
        </div>
      )}
    </div>
  );
}
