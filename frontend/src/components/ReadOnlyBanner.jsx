// frontend/src/components/ReadOnlyBanner.jsx
export default function ReadOnlyBanner() {
  return (
    <div style={{
      background: "#fff8e1", border: "1px solid #f0c14b", color: "#7a5c00",
      borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 14,
    }}>
      Your account is inactive. You can view content here, but you can't create,
      edit, or delete anything. Contact an admin if this seems wrong.
    </div>
  );
}