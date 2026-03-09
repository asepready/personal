import Select from 'react-select'

/**
 * Searchable relational dropdown (FR-30).
 * Uses react-select; options are { value, label }.
 */
const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: 40,
    backgroundColor: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--color-border)' : 'transparent',
    color: 'var(--color-text)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--color-text)',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--color-text)',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--color-text-muted)',
  }),
}

export default function RelationalSelect({
  options,
  value,
  onChange,
  placeholder = '-- Pilih --',
  isDisabled,
  required,
}) {
  const selected = options.find((opt) => String(opt.value) === String(value)) || null
  return (
    <Select
      isClearable={!required}
      placeholder={placeholder}
      options={options}
      value={selected}
      onChange={(opt) => onChange(opt ? (typeof opt.value === 'number' ? opt.value : opt.value) : '')}
      isDisabled={isDisabled}
      styles={customStyles}
      classNamePrefix="admin-select"
    />
  )
}
