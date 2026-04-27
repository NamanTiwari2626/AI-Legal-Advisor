import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Clock, Shield } from 'lucide-react'

interface ClientProfileCardProps {
  name?: string
  caseId?: string
  status?: string
}

export function ClientProfileCard({ name = 'Client', caseId = 'CS-001', status = 'Ongoing' }: ClientProfileCardProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl">
      <div className="p-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-sm text-slate-400">Case ID: {caseId}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mb-6"></div>

        {/* Case Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Case Status</p>
              <Badge className="mt-1 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">{status}</Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Last Consultation</p>
              <p className="text-sm text-slate-200 mt-1">2 hours ago</p>
            </div>
          </div>
        </div>

        {/* Consultation History */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Consultation Stats</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-500">12</p>
              <p className="text-xs text-slate-400 mt-1">Total Queries</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">4</p>
              <p className="text-xs text-slate-400 mt-1">Documents</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
