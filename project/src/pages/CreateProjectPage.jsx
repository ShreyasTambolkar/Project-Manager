import { useState } from "react";
import SelectField from "../components/SelectField";
import DateField   from "../components/DateField";
import { CREATE_API } from "../services/api";

export default function CreateProjectPage({ onSave }) {
  const [form, setForm] = useState({
    project_name: "",
    reason:       "",
    type:         "",
    division:     "",
    category:     "",
    priority:     "",
    department:   "",
    start_date:   "",
    end_date:     "",
    location:     "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [saving,      setSaving]      = useState(false);
  const [apiError,    setApiError]    = useState(null);
  const [success,     setSuccess]     = useState(false);

  const set = (key) => (val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setFieldErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!form.project_name.trim()) errors.project_name = "Please enter a Project Theme / Name.";
    if (!form.reason)              errors.reason       = "Please select a Reason.";
    if (!form.type)                errors.type         = "Please select a Type.";
    if (!form.division)            errors.division     = "Please select a Division.";
    if (!form.category)            errors.category     = "Please select a Category.";
    if (!form.priority)            errors.priority     = "Please select a Priority.";
    if (!form.department)          errors.department   = "Please select a Department.";
    if (!form.location)            errors.location     = "Please select a Location.";
    if (!form.start_date)          errors.start_date   = "Please select a Start Date.";
    if (!form.end_date)            errors.end_date     = "Please select an End Date.";
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      errors.end_date = "End date cannot be before start date.";
    }
    return errors;
  };

  const handleSave = async () => {
    setApiError(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${CREATE_API}/projects`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: form.project_name.trim(),
          start_date:   form.start_date || null,
          end_date:     form.end_date   || null,
          reason:       form.reason,
          type:         form.type,
          division:     form.division,
          category:     form.category,
          priority:     form.priority,
          department:   form.department,
          location:     form.location,
          status:       "Registered",
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setFieldErrors({ project_name: "A project with this name already exists." });
        return;
      }
      if (!res.ok) {
        setApiError(data.message || "Failed to create project.");
        return;
      }

      setSuccess(true);
      setTimeout(() => { onSave && onSave(); }, 800);

    } catch (err) {
      setApiError("Network error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const fe = fieldErrors;

  const saveBtn = (extraClass = "") => (
    <button
      onClick={handleSave}
      disabled={saving || success}
      className={`px-7 rounded-lg text-sm font-semibold whitespace-nowrap
                 transition-colors border-none text-white
                 ${saving || success
                   ? "bg-[#7FA8D0] cursor-not-allowed"
                   : "bg-[#1A4D87] cursor-pointer hover:bg-[#163F6E]"}
                 ${extraClass}`}
      style={{ fontFamily: "inherit" }}
    >
      {saving ? "Saving…" : "Save Project"}
    </button>
  );

  return (
  <div className="p-4 sm:p-6 md:p-7 sm:mt-[-3%]">
  <div
    className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]
               flex flex-col overflow-hidden mx-2 mb-10"
    style={{ height: "calc(100dvh - 8rem)"}}
  >
        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 md:p-7">

          {/* API / network error banner */}
          {apiError && (
            <div className="mb-4 px-4 py-2.5 rounded-lg text-sm bg-[#FFF0F0] border border-[#FFCDD2] text-[#C0392B]">
              {apiError}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="mb-4 px-4 py-2.5 rounded-lg text-sm bg-[#F0FFF4] border border-[#C6F6D5] text-[#276749]">
              Project created successfully! Redirecting…
            </div>
          )}

          {/* Top row: textarea + desktop button */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-7">
            <div className="flex-1 flex flex-col gap-1">
              <textarea
                value={form.project_name}
                onChange={(e) => set("project_name")(e.target.value)}
                placeholder="Enter Project Theme"
                rows={3}
                className={`w-full rounded-lg text-sm outline-none resize-none box-border px-4 py-3.5
                           border-[1.5px] text-[#1E3A5F] leading-relaxed
                           ${fe.project_name ? "border-[#E53E3E]" : "border-[#DDE6F0]"}`}
                style={{ fontFamily: "inherit" }}
              />
              {fe.project_name && (
                <p className="text-xs text-[#C0392B] mt-0.5">{fe.project_name}</p>
              )}
            </div>

            {/* Desktop only */}
            {saveBtn("hidden sm:block py-3")}
          </div>

          {/* Row 1: Reason / Type / Division */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 mb-5">
            <SelectField label="Reason"   value={form.reason}   onChange={set("reason")}
              options={["For Business", "Dealership", "Transport"]} error={fe.reason} />
            <SelectField label="Type"     value={form.type}     onChange={set("type")}
              options={["Internal", "External", "Vendor"]} error={fe.type} />
            <SelectField label="Division" value={form.division} onChange={set("division")}
              options={["Filters", "Compressor", "Pumps", "Glass", "Water Heater"]} error={fe.division} />
          </div>

          {/* Row 2: Category / Priority / Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 mb-5">
            <SelectField label="Category"   value={form.category}   onChange={set("category")}
              options={["Quality A", "Quality B", "Quality C", "Quality D"]} error={fe.category} />
            <SelectField label="Priority"   value={form.priority}   onChange={set("priority")}
              options={["High", "Medium", "Low"]} error={fe.priority} />
            <SelectField label="Department" value={form.department} onChange={set("department")}
              options={["Strategy", "Finance", "Quality", "Maintenance", "Stores"]} error={fe.department} />
          </div>

          {/* Row 3: Start Date / End Date / Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 mb-6">
            <DateField label="Start Date as per Project Plan" value={form.start_date}
              onChange={set("start_date")} error={fe.start_date} />
            <DateField label="End Date as per Project Plan"   value={form.end_date}
              onChange={set("end_date")} error={fe.end_date} />
            <SelectField label="Location" value={form.location} onChange={set("location")}
              options={["Pune", "Delhi", "Mumbai"]} error={fe.location} />
          </div>

          {/* Status */}
          <div className="text-sm text-[#4A5568]">
            Status:{" "}
            <span className="font-bold text-[#1A4D87]">Registered</span>
          </div>
        </div>

        {/* Mobile save button — pinned to bottom of card */}
        <div className="sm:hidden shrink-0 px-5 py-4 border-t border-[#E8EDF5]">
          {saveBtn("w-full py-3.5")}
        </div>
      </div>
    </div>
  );
}