import { memo, useId, useState } from "react";

import {
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  ROLES,
  type EmployeeDraft,
  type EmployeeStatus,
} from "~/types/employee";
import {
  containsMarkup,
  isValidEmail,
  isValidPersonName,
  sanitizeText,
} from "~/utils/sanitize";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type EmployeeFormProps = {
  initial?: EmployeeDraft;
  submitLabel: string;
  disabled?: boolean;
  onSubmit: (draft: EmployeeDraft) => void;
  onCancel: () => void;
};

type FormErrors = Partial<Record<keyof EmployeeDraft, string>>;

const EMPTY_DRAFT: EmployeeDraft = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  role: "",
  status: "Active",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 dark:border-gray-600 dark:bg-gray-950";

function isStatus(value: string): value is EmployeeStatus {
  return (EMPLOYEE_STATUSES as readonly string[]).includes(value);
}

function validate(values: EmployeeDraft): { draft?: EmployeeDraft; errors: FormErrors } {
  const errors: FormErrors = {};
  const firstName = sanitizeText(values.firstName);
  const lastName = sanitizeText(values.lastName);
  const email = sanitizeText(values.email);

  if (containsMarkup(values.firstName) || (firstName && !isValidPersonName(firstName))) {
    errors.firstName = "Use letters, spaces, apostrophes, or hyphens only.";
  } else if (!firstName) {
    errors.firstName = "First name is required.";
  }

  if (containsMarkup(values.lastName) || (lastName && !isValidPersonName(lastName))) {
    errors.lastName = "Use letters, spaces, apostrophes, or hyphens only.";
  } else if (!lastName) {
    errors.lastName = "Last name is required.";
  }

  if (containsMarkup(values.email)) {
    errors.email = "Email cannot include < or >.";
  } else if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.department) {
    errors.department = "Select a department.";
  }

  if (!values.role) {
    errors.role = "Select a role.";
  }

  if (!isStatus(values.status)) {
    errors.status = "Select a status.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    draft: {
      firstName,
      lastName,
      email,
      department: values.department,
      role: values.role,
      status: values.status,
    },
  };
}

export const EmployeeForm = memo(function EmployeeForm({
  initial,
  submitLabel,
  disabled = false,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const formId = useId();
  const [values, setValues] = useState<EmployeeDraft>(initial ?? EMPTY_DRAFT);
  const [errors, setErrors] = useState<FormErrors>({});

  const update = (key: keyof EmployeeDraft, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const result = validate(values);
        setErrors(result.errors);
        if (result.draft) {
          onSubmit(result.draft);
        }
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${formId}-first-name`}
          label="First name"
          value={values.firstName}
          error={errors.firstName}
          autoComplete="given-name"
          onChange={(value) => update("firstName", value)}
        />
        <Field
          id={`${formId}-last-name`}
          label="Last name"
          value={values.lastName}
          error={errors.lastName}
          autoComplete="family-name"
          onChange={(value) => update("lastName", value)}
        />
      </div>

      <Field
        id={`${formId}-email`}
        label="Email"
        type="email"
        value={values.email}
        error={errors.email}
        autoComplete="email"
        onChange={(value) => update("email", value)}
      />

      {/* Department — Select */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Department</label>
        <Select value={values.department} onValueChange={(val) => update("department", val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-sm text-red-700" role="alert">{errors.department}</p>
        )}
      </div>

      {/* Role — Select */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Role</label>
        <Select value={values.role} onValueChange={(val) => update("role", val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-700" role="alert">{errors.role}</p>
        )}
      </div>

      {/* Status — Select */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Status</label>
        <Select value={values.status} onValueChange={(val) => update("status", val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            {EMPLOYEE_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-red-700" role="alert">{errors.status}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={disabled}
          className="cursor-pointer rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
});

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
      {error ? (
        <span id={errorId} role="alert" className="block text-sm text-red-700">
          {error}
        </span>
      ) : null}
    </div>
  );
}
