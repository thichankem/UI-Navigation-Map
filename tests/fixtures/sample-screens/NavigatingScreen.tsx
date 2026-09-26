export default function NavigatingScreen() {
  return (
    <div>
      <button data-unm-navigate="dashboard">Go to Dashboard</button>
      <a data-unm-navigate="settings">Settings</a>
      <span>No navigation here</span>
    </div>
  )
}
