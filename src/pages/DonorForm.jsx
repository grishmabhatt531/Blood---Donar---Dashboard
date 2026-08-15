import React, { useState } from 'react';
import { BLOOD_GROUPS } from '../utils/helpers.js';
import { donorApi } from '../services/api.js';
import Topbar from '../components/Topbar.jsx';
import { CheckIcon, PlusIcon } from '../components/Icons.jsx';

const EMPTY = {
  donorId: '', name: '', bloodGroup: '', phone: '',
  age: '', gender: '', email: '', address: '', city: '', lastDonationDate: '',
};

export default function DonorForm({ initial = null, onSuccess, onCancel, onToast, onOpenSidebar }) {
  const isEdit    = !!initial;
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function set(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.donorId.trim())   e.donorId   = 'Donor ID is required';
    if (!form.name.trim())      e.name      = 'Full Name is required';
    if (!form.bloodGroup)       e.bloodGroup = 'Blood Type is required';
    if (!form.phone.trim())     e.phone     = 'Phone Number is required';
    if (form.age && (isNaN(form.age) || form.age < 1 || form.age > 120))
      e.age = 'Enter a valid age (1–120)';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
      };
      if (isEdit) {
        await donorApi.update(form.donorId, payload);
        onToast('Donor record updated successfully!', 'success');
      } else {
        await donorApi.create(payload);
        onToast('Donor registered successfully!', 'success');
      }
      onSuccess();
    } catch (err) {
      onToast(`Error saving donor: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  }

  const title = isEdit ? `Edit Profile — ${initial.name}` : 'Register New Donor';

  return (
    <div className="page-wrapper">
      <Topbar
        title={isEdit ? 'Edit Donor Record' : 'Register New Donor'}
        subtitle={isEdit ? `Updating profile ID: ${initial.donorId}` : 'Enter donor personal, medical, and contact details'}
        onOpenSidebar={onOpenSidebar}
      />

      <main className="page">
        <div className="card shadow-card form-container">
          <div className="card-header form-header">
            <div>
              <h2 className="form-title">{title}</h2>
              <p className="form-subtitle">Fields marked with <span className="required">*</span> are mandatory for registry entry.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="donor-form">
            <div className="form-grid">
              <Field label="Donor ID" required error={errors.donorId}>
                <input
                  id="field-donorId"
                  className={`form-input ${errors.donorId ? 'error' : ''}`}
                  value={form.donorId}
                  onChange={(e) => set('donorId', e.target.value)}
                  placeholder="e.g. D-1092"
                  disabled={isEdit}
                />
              </Field>

              <Field label="Full Legal Name" required error={errors.name}>
                <input
                  id="field-name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                />
              </Field>

              <Field label="Blood Type" required error={errors.bloodGroup}>
                <select
                  id="field-bloodGroup"
                  className={`form-input ${errors.bloodGroup ? 'error' : ''}`}
                  value={form.bloodGroup}
                  onChange={(e) => set('bloodGroup', e.target.value)}
                >
                  <option value="">Select Blood Type</option>
                  {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>

              <Field label="Phone Contact" required error={errors.phone}>
                <input
                  id="field-phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+1 (555) 019-2834"
                />
              </Field>

              <Field label="Age (Years)" error={errors.age}>
                <input
                  id="field-age"
                  className={`form-input ${errors.age ? 'error' : ''}`}
                  type="number"
                  min={18} max={75}
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                  placeholder="e.g. 28"
                />
              </Field>

              <Field label="Gender">
                <select
                  id="field-gender"
                  className="form-input"
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </Field>

              <Field label="Email Address" error={errors.email}>
                <input
                  id="field-email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="sarah@example.com"
                />
              </Field>

              <Field label="City / Region">
                <input
                  id="field-city"
                  className="form-input"
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="e.g. Chicago"
                />
              </Field>

              <Field label="Last Donation Date">
                <input
                  id="field-lastDonationDate"
                  className="form-input"
                  type="date"
                  value={form.lastDonationDate}
                  onChange={(e) => set('lastDonationDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </Field>

              <Field label="Residential Address" className="full">
                <input
                  id="field-address"
                  className="form-input"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Suite 100"
                />
              </Field>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="spinner-sm" />
                      <span>Saving Record...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon size={16} />
                      <span>{isEdit ? 'Save Changes' : 'Complete Registration'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, required, error, children, className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      <label className="form-label">
        <span>{label}</span>
        {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
