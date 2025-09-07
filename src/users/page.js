'use client';

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function formatDateSafe(value) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // list state
  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [q, setQ] = useState("");

  // editing modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // edit form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [admin, setAdmin] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && !session?.user?.admin) {
      router.replace("/");
    }
  }, [status, session, router]);

  async function loadUsers() {
    try {
      setListError("");
      setLoadingList(true);
      const url = q ? `/api/users?q=${encodeURIComponent(q)}` : `/api/users`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setListError("Failed to load users.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.admin) loadUsers();
  }, [status]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );
  }, [users, q]);

  function openEdit(u) {
    setEditing(u);
    setName(u.name || "");
    setEmail(u.email || "");
    setImage(u.image || "");
    setAdmin(!!u.admin);
    setNewPassword("");
    setOpen(true);
  }
  function closeEdit() {
    setOpen(false);
    setEditing(null);
    setName(""); setEmail(""); setImage(""); setAdmin(false); setNewPassword("");
    setSaveError(""); setSaving(false);
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setSaveError("");

    const payload = { name, email, image, admin };
    if (newPassword) payload.newPassword = newPassword;

    const res = await fetch(`/api/users/${editing._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setSaveError(err?.message || "Update failed.");
      return;
    }

    const updated = await res.json();
    setUsers((cur) => cur.map((u) => (u._id === updated._id ? updated : u)));
    closeEdit();
  }

  async function handleDelete(id) {
    if (!id) return;
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const prev = users;
    setUsers((cur) => cur.filter((u) => u._id !== id));
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setUsers(prev);
      const err = await res.json().catch(() => ({}));
      alert(err?.message || "Delete failed.");
    }
  }

  if (status === "loading") return <div className="p-6 text-gray-600">Loading…</div>;
  if (status === "authenticated" && !session?.user?.admin) return <div className="p-6 text-red-600">Not authorized.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="w-56 px-2.5 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={loadUsers}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {listError && <div className="mb-3 text-red-600 text-sm">{listError}</div>}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 w-[40%]">User</th>
                <th className="px-4 py-3 w-[28%]">Email</th>
                <th className="px-4 py-3 w-[12%]">Role</th>
                <th className="px-4 py-3 w-[20%]">Created</th>
                <th className="px-4 py-3 w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`border-t ${idx % 2 ? "bg-white" : "bg-gray-50/40"} hover:bg-blue-50/40`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.image || "/user.svg"}
                        alt={u.name || u.email}
                        className="rounded-full object-cover border flex-none"
                        width={40}
                        height={40}
                        style={{ width: 40, height: 40 }} // beats global img rules
                      />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{u.name || "—"}</div>
                        <div className="text-xs text-gray-500 truncate">{u._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="truncate">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {u.admin ? (
                      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDateSafe(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(u)}
                        className="px-2.5 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-2.5 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loadingList && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-xs text-gray-500 border-t bg-gray-50">
          {loadingList ? "Loading…" : `${users.length} user(s)`}
        </div>
      </div>

      {/* Edit Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit user</h2>
              <button onClick={closeEdit} className="px-2 py-1 rounded-md hover:bg-gray-100">✕</button>
            </div>

            <form onSubmit={saveEdit} className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={image || "/user.svg"}
                  alt="preview"
                  className="rounded-full object-cover border"
                  width={48}
                  height={48}
                  style={{ width: 48, height: 48 }}
                />
                <div className="text-xs text-gray-500">Paste an image URL below to change avatar.</div>
              </div>

              <label className="block">
                <span className="block text-sm mb-1">Image URL</span>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>

              <label className="block">
                <span className="block text-sm mb-1">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>

              <label className="block">
                <span className="block text-sm mb-1">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>

              <div className="flex items-center gap-2">
                <input
                  id="isAdmin"
                  type="checkbox"
                  checked={admin}
                  onChange={(e) => setAdmin(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="isAdmin" className="text-sm">Admin</label>
              </div>

              <label className="block">
                <span className="block text-sm mb-1">Set New Password (optional)</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-xs text-gray-500">Must be at least 5 characters if provided.</span>
              </label>

              {saveError && <div className="text-sm text-red-600">{saveError}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeEdit} className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
