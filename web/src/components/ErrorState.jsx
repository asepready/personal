export default function ErrorState({ message = 'Terjadi kesalahan.', onRetry }) {
  return (
    <div className="error-box" style={{ textAlign: 'center', maxWidth: 400, margin: '2rem auto' }}>
      <p style={{ margin: '0 0 1rem' }}>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Coba lagi
        </button>
      )}
    </div>
  )
}
