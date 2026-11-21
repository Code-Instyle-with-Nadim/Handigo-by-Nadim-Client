"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, ShieldCheck, Users } from "lucide-react"
import { toast } from "sonner"

import { DashboardAvatar } from "@/components/dashboard/avatar"
import { EmptyState } from "@/components/dashboard/empty-state"
import { fieldSelectClass } from "@/components/dashboard/form-field"
import { RoleBadge } from "@/components/site/role-badge"
import { updateUserRole } from "@/lib/actions/admin-actions"
import { ROLE_OPTIONS } from "@/lib/dashboard-constants"
import type { DashboardUserRecord } from "@/lib/dashboard-types"
import { formatDate } from "@/lib/format"
import type { UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

export function AdminUsers({
  users,
  currentUserId,
}: {
  users: DashboardUserRecord[]
  currentUserId: string
}) {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [drafts, setDrafts] = useState<Record<string, UserRole>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return users

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.includes(term)
    )
  }, [search, users])

  const roleCounts = useMemo(() => {
    const counts: Record<UserRole, number> = {
      customer: 0,
      technician: 0,
      admin: 0,
    }

    for (const user of users) {
      counts[user.role] += 1
    }

    return counts
  }, [users])

  async function handleUpdate(user: DashboardUserRecord) {
    const nextRole = drafts[user.id] ?? user.role

    if (nextRole === user.role) return

    setSavingId(user.id)

    try {
      const result = await updateUserRole(user.id, nextRole)

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(result.message)
      setDrafts((current) => {
        const next = { ...current }
        delete next[user.id]
        return next
      })
      router.refresh()
    } catch {
      toast.error("Unable to update this role. Please try again.")
    } finally {
      setSavingId(null)
    }
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No users yet"
        description="Customers and technicians will appear here as they create accounts."
      />
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {ROLE_OPTIONS.map((role) => (
            <span
              key={role.value}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-semibold text-muted-foreground"
            >
              {role.label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9.5px] tabular-nums">
                {roleCounts[role.value]}
              </span>
            </span>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email or role…"
            aria-label="Search users"
            className="h-9 w-full rounded-xl border border-input bg-background/60 pr-3 pl-8 text-[12px] transition-all outline-none placeholder:text-muted-foreground/55 focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/70 bg-muted/30">
                {["User", "Role", "Joined", "Change role"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-4 py-2.5 text-[9.5px] font-bold tracking-[0.13em] text-muted-foreground/70 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const isSelf = user.id === currentUserId
                const draftRole = drafts[user.id] ?? user.role
                const changed = draftRole !== user.role
                const saving = savingId === user.id

                return (
                  <tr
                    key={user.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <DashboardAvatar
                          name={user.name}
                          email={user.email}
                          image={user.image}
                          className="size-9"
                        />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate text-[12px] font-semibold">
                            {user.name || "Unnamed user"}
                            {isSelf ? (
                              <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[8.5px] font-bold tracking-[0.08em] text-primary uppercase">
                                You
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-0.5 max-w-[16rem] truncate text-[10.5px] text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-4 py-3 text-[11px] text-muted-foreground">
                      {formatDate(user.joinedAt)}
                    </td>

                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-muted-foreground">
                          <ShieldCheck className="size-3.5 text-primary" />
                          You cannot change your own role
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={draftRole}
                            disabled={saving}
                            aria-label={`Change role for ${user.name || user.email}`}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [user.id]: event.target.value as UserRole,
                              }))
                            }
                            className={cn(fieldSelectClass, "h-8 w-32 text-[11px]")}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            disabled={!changed || saving}
                            onClick={() => handleUpdate(user)}
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {saving ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : null}
                            {saving ? "Saving…" : "Save"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((user) => {
          const isSelf = user.id === currentUserId
          const draftRole = drafts[user.id] ?? user.role
          const changed = draftRole !== user.role
          const saving = savingId === user.id

          return (
            <article
              key={user.id}
              className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-[0_1px_2px_rgba(11,27,52,0.03)]"
            >
              <div className="flex items-center gap-2.5">
                <DashboardAvatar
                  name={user.name}
                  email={user.email}
                  image={user.image}
                  className="size-10"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                    <span className="truncate">{user.name || "Unnamed user"}</span>
                    {isSelf ? (
                      <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[8.5px] font-bold tracking-[0.08em] text-primary uppercase">
                        You
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <RoleBadge role={user.role} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/70 pt-3">
                <p className="text-[10px] text-muted-foreground">
                  Joined {formatDate(user.joinedAt)}
                </p>

                {isSelf ? (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Own role locked
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <select
                      value={draftRole}
                      disabled={saving}
                      aria-label={`Change role for ${user.name || user.email}`}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [user.id]: event.target.value as UserRole,
                        }))
                      }
                      className={cn(fieldSelectClass, "h-8 w-28 text-[11px]")}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!changed || saving}
                      onClick={() => handleUpdate(user)}
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                    >
                      {saving ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching users"
          description="Try a different name, email address or role."
          className="mt-4"
        />
      ) : null}
    </>
  )
}
