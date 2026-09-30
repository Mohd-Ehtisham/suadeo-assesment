import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { EmployeeForm } from "../components/EmployeeForm";

const defaultProps = {
  submitLabel: "Add record",
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
};

function renderForm(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<EmployeeForm {...props} />);
}

describe("EmployeeForm", () => {
  // --- Rendering ---

  it("renders all form fields", () => {
    renderForm();

    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders submit and cancel buttons", () => {
    renderForm();

    expect(screen.getByRole("button", { name: "Add record" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders custom submit label", () => {
    renderForm({ submitLabel: "Save changes" });

    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  // --- Validation: empty form ---

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    await user.click(screen.getByRole("button", { name: "Add record" }));

    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Last name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Select a department.")).toBeInTheDocument();
    expect(screen.getByText("Select a role.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // --- Validation: invalid inputs ---

  it("shows error for invalid first name", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("First name"), "123");
    await user.click(screen.getByRole("button", { name: "Add record" }));

    expect(screen.getByText("Use letters, spaces, apostrophes, or hyphens only.")).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Add record" }));

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("rejects markup in first name (XSS protection)", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("First name"), "<script>alert(1)</script>");
    await user.click(screen.getByRole("button", { name: "Add record" }));

    expect(screen.getByText("Use letters, spaces, apostrophes, or hyphens only.")).toBeInTheDocument();
  });

  it("rejects markup in email (XSS protection)", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), "<img src=x>");
    await user.click(screen.getByRole("button", { name: "Add record" }));

    expect(screen.getByText("Email cannot include < or >.")).toBeInTheDocument();
  });

  // --- Buttons ---

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderForm({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("disables buttons when disabled prop is true", () => {
    render(
      <EmployeeForm
        submitLabel="Saving..."
        disabled
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  // --- Validation errors use role="alert" ---

  it("validation errors have role=alert for accessibility", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Add record" }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(3);
  });
});
