import { Mail, MailOpen, Phone, Trash2 } from 'lucide-react'
import { errorText, useToast } from '../../components/admin/Toast'
import { AsyncView, EmptyState } from '../../components/ui/States'
import { useAsync } from '../../hooks/useAsync'
import { deleteRow, listMessages, updateRow } from '../../lib/api'
import { formatDate } from '../../lib/format'
import type { ContactMessage } from '../../lib/types'

export default function MessagesAdmin() {
  const toast = useToast()
  const state = useAsync(listMessages)

  async function toggleRead(m: ContactMessage) {
    try {
      await updateRow<ContactMessage>('contact_messages', 'id', m.id, { is_read: !m.is_read })
      state.reload()
    } catch (e) {
      toast('error', errorText(e))
    }
  }

  async function remove(m: ContactMessage) {
    if (!confirm(`${m.name} xabari o‘chirilsinmi?`)) return
    try {
      await deleteRow('contact_messages', 'id', m.id)
      toast('success', 'Xabar o‘chirildi')
      state.reload()
    } catch (e) {
      toast('error', errorText(e))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">Aloqa formasi xabarlari</h1>
      <p className="mt-1 text-forest-900/60">Saytdagi aloqa formasi orqali yuborilgan xabarlar. Ularni faqat administratorlar ko‘ra oladi.</p>
      <div className="mt-6">
        <AsyncView state={state} empty={(d) => d.length === 0} emptyView={<EmptyState title="Hozircha xabarlar yo‘q" />}>
          {(messages) => (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id} className={`card p-5 ${m.is_read ? 'opacity-75' : 'border-forest-300 ring-2 ring-forest-100'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-forest-950">
                        {m.name} {!m.is_read && <span className="ml-2 rounded-full bg-forest-600 px-2 py-0.5 text-xs text-white">yangi</span>}
                      </p>
                      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-forest-700">
                        {m.email && (
                          <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:underline">
                            <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {m.email}
                          </a>
                        )}
                        {m.phone && (
                          <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:underline">
                            <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {m.phone}
                          </a>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="mr-2 text-xs text-forest-900/50">{formatDate(m.created_at)}</span>
                      <button
                        onClick={() => toggleRead(m)}
                        className="rounded-lg p-2 text-forest-700 hover:bg-forest-50"
                        aria-label={m.is_read ? 'O‘qilmagan deb belgilash' : 'O‘qilgan deb belgilash'}
                        title={m.is_read ? 'O‘qilmagan deb belgilash' : 'O‘qilgan deb belgilash'}
                      >
                        {m.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                      </button>
                      <button onClick={() => remove(m)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="O‘chirish">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-forest-900/85">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </AsyncView>
      </div>
    </div>
  )
}
