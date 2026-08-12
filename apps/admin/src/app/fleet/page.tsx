"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, getYear, getMonth } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { fetchMonthlyAvailability, setDateOverride } from "@/actions/fleet";
import { DailyAvailability } from "@belihuloya/core";
import { Calendar, Save, Loader2, AlertTriangle, Settings, RefreshCw } from "lucide-react";

export default function FleetPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<Record<string, DailyAvailability>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Override form state
  const [overrideCapacity, setOverrideCapacity] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async (date: Date) => {
    setIsLoading(true);
    try {
      const year = getYear(date);
      // getMonth returns 0-11, our utility expects 1-12
      const monthStr = getMonth(date) + 1;
      const data = await fetchMonthlyAvailability(year, monthStr);
      setAvailability(data);
    } catch (error) {
      console.error("Failed to load availability", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentMonth);
  }, [currentMonth]);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    setSelectedDate(undefined);
  };

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDate(day);
    if (day) {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayData = availability[dateStr];
      if (dayData) {
        // If there's an override, show it, otherwise blank
        setOverrideCapacity("");
        setOverrideReason("");
      }
    }
  };

  const handleSaveOverride = async () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const dayData = availability[dateStr];
    
    setIsSaving(true);
    
    // If empty input, we remove the override (pass -1)
    const capacityNum = overrideCapacity.trim() === "" ? -1 : parseInt(overrideCapacity);
    
    const res = await setDateOverride(dateStr, capacityNum, overrideReason);
    if (res.success) {
      // Reload the month
      await loadData(currentMonth);
      setOverrideCapacity("");
      setOverrideReason("");
    } else {
      alert(res.error || "Failed to set override");
    }
    
    setIsSaving(false);
  };

  // Custom Day cell to render day numbers cleanly
  const renderDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayData = availability[dateStr];
    
    if (!dayData) return <div className="text-center text-slate-400 font-semibold">{day.getDate()}</div>;
    
    const isSoldOut = dayData.remainingJeeps <= 0;
    
    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative group">
        <span className={`text-base font-bold ${isSoldOut ? 'text-red-400' : 'text-slate-200'}`}>
          {day.getDate()}
        </span>

        {isSoldOut && (
          <span className="text-[9px] font-extrabold tracking-wider uppercase text-red-400 mt-0.5">Full</span>
        )}
        
        {/* Breakdown Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="text-xs font-bold text-white mb-2 border-b border-slate-800 pb-1">{format(day, "MMM do, yyyy")}</div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Capacity:</span> <span className="font-bold text-white">{dayData.totalCapacity} Jeeps</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Private:</span> <span className="font-bold text-orange-400">-{dayData.privateJeepsConsumed}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Group:</span> <span className="font-bold text-blue-400">-{dayData.groupJeepsConsumed}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 pt-1 border-t border-slate-800">
            <span>Remaining:</span> <span className={`font-bold ${isSoldOut ? 'text-red-400' : 'text-emerald-400'}`}>{dayData.remainingJeeps} Jeeps</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-2">Fleet Management</h1>
          <p className="text-slate-400">Monitor jeep availability and configure daily capacity overrides for maintenance.</p>
        </div>
        <button 
          onClick={() => loadData(currentMonth)}
          disabled={isLoading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Col: Calendar */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
          
          {/* Custom Styles for DayPicker */}
          <style>{`
            .rdp { --rdp-cell-size: 56px; margin: 0; width: 100%; max-width: none; }
            .rdp-months { justify-content: center; width: 100%; }
            .rdp-month { width: 100%; }
            .rdp-table { width: 100%; max-width: 100%; border-collapse: separate; border-spacing: 4px; }
            .rdp-cell { border: 1px solid rgba(51, 65, 85, 0.3); padding: 0; border-radius: 12px; overflow: hidden; background: rgba(15, 23, 42, 0.4); }
            .rdp-day { width: 100%; height: 56px; max-width: none; border-radius: 0; transition: all 0.2s; }
            .rdp-day:hover { background-color: rgba(255, 255, 255, 0.05); }
            .rdp-day_selected { background-color: rgba(249, 115, 22, 0.1) !important; border: 2px solid #f97316 !important; border-radius: 12px; }
            .rdp-day_selected:hover { background-color: rgba(249, 115, 22, 0.2) !important; }
            .rdp-head_cell { text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: #94a3b8; padding-bottom: 0.5rem; }
            .rdp-caption_label { font-size: 1.5rem; font-weight: 800; color: white; letter-spacing: -0.025em; }
            .rdp-nav_button { color: #f97316; }
            .rdp-nav_button:hover { background-color: rgba(249, 115, 22, 0.1); }
            
            /* Private Booking Highlight (Orange) */
            .rdp-day_has_private { background-color: rgba(249, 115, 22, 0.05) !important; position: relative; }
            .rdp-day_has_private::after { content: ''; position: absolute; inset: 0; border: 2px solid rgba(249, 115, 22, 0.4); pointer-events: none; border-radius: 12px; }
            
            /* Group Booking Highlight (Blue) */
            .rdp-day_has_group { background-color: rgba(59, 130, 246, 0.05) !important; position: relative; }
            .rdp-day_has_group::after { content: ''; position: absolute; inset: 0; border: 2px solid rgba(59, 130, 246, 0.4); pointer-events: none; border-radius: 12px; }
            
            /* Mixed Booking Highlight (Purple) */
            .rdp-day_mixed { background-color: rgba(168, 85, 247, 0.05) !important; position: relative; }
            .rdp-day_mixed::after { content: ''; position: absolute; inset: 0; border: 2px solid rgba(168, 85, 247, 0.5); pointer-events: none; border-radius: 12px; }
          `}</style>
          
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
          )}

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            components={{
              DayButton: ({ day, ...props }: any) => (
                <button {...props} className={`${props.className || ''} w-full h-full p-0 flex flex-col items-center justify-center`}>
                  {renderDay(day.date)}
                </button>
              )
            }}
            modifiers={{
              mixed: (day) => {
                const dStr = format(day, "yyyy-MM-dd");
                const dayData = availability[dStr];
                if (!dayData) return false;
                return dayData.privateJeepsConsumed > 0 && dayData.groupJeepsConsumed > 0;
              },
              has_private: (day) => {
                const dStr = format(day, "yyyy-MM-dd");
                const dayData = availability[dStr];
                if (!dayData) return false;
                return dayData.privateJeepsConsumed > 0 && dayData.groupJeepsConsumed === 0;
              },
              has_group: (day) => {
                const dStr = format(day, "yyyy-MM-dd");
                const dayData = availability[dStr];
                if (!dayData) return false;
                return dayData.groupJeepsConsumed > 0 && dayData.privateJeepsConsumed === 0;
              }
            }}
            modifiersClassNames={{
              mixed: "rdp-day_mixed",
              has_private: "rdp-day_has_private",
              has_group: "rdp-day_has_group"
            }}
          />

          {/* Color Legend inside Calendar panel */}
          <div className="flex gap-4 mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold justify-center w-full">
            <div className="flex items-center gap-2 text-slate-300"><div className="w-3.5 h-3.5 rounded-md bg-orange-500/20 border-2 border-orange-500/50"></div> Private</div>
            <div className="flex items-center gap-2 text-slate-300"><div className="w-3.5 h-3.5 rounded-md bg-blue-500/20 border-2 border-blue-500/50"></div> Group</div>
            <div className="flex items-center gap-2 text-slate-300"><div className="w-3.5 h-3.5 rounded-md bg-purple-500/20 border-2 border-purple-500/50"></div> Mixed</div>
          </div>
        </div>

        {/* Right Col: Details & Overrides */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" />
              Daily Capacity
            </h3>
            
            {!selectedDate ? (
              <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-950">
                Select a date on the calendar to view details or set an override.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-sm text-slate-400 font-semibold uppercase mb-1">Selected Date</div>
                    <div className="text-2xl font-bold text-white">{format(selectedDate, "MMM do, yyyy")}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400 font-semibold uppercase mb-1">Remaining</div>
                    <div className="text-2xl font-black text-emerald-400">{availability[format(selectedDate, "yyyy-MM-dd")]?.remainingJeeps || 0}</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <h4 className="font-bold text-slate-200">Set Manual Override</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    If a jeep is down for maintenance, you can reduce the maximum capacity for this specific day. Leave blank to clear override.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Max Jeeps Capacity</label>
                      <input 
                        type="number"
                        min="0"
                        placeholder={`Default: ${availability[format(selectedDate, "yyyy-MM-dd")]?.totalCapacity || 5}`}
                        value={overrideCapacity}
                        onChange={e => setOverrideCapacity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reason (Optional)</label>
                      <input 
                        type="text"
                        placeholder="e.g., Jeep 3 in repair"
                        value={overrideReason}
                        onChange={e => setOverrideReason(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    
                    <button
                      onClick={handleSaveOverride}
                      disabled={isSaving}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Override
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
            <h4 className="text-emerald-400 font-bold mb-2 text-sm uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              How it works
            </h4>
            <p className="text-emerald-200/70 text-xs leading-relaxed">
              When users book private tours or you create pre-scheduled group tours, they instantly deduct from the physical jeep fleet pool. Overriding the capacity here will accurately block future bookings for this date if it pushes the inventory negative.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
