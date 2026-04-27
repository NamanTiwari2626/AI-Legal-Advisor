import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Home, Landmark, Users } from 'lucide-react'

interface FeatureSuggestionsProps {
  onSelect?: (suggestion: string) => void
}

const suggestions = [
  {
    icon: Briefcase,
    title: 'Business Contract Review',
    description: 'Get expert analysis on commercial contracts',
  },
  {
    icon: Home,
    title: 'Property Dispute Law',
    description: 'Resolve property and real estate issues',
  },
  {
    icon: Landmark,
    title: 'Inheritance Tax in India',
    description: 'Understand succession and tax implications',
  },
  {
    icon: Users,
    title: 'Labor Rights Guidance',
    description: 'Know your employee and employer rights',
  },
]

export function FeatureSuggestions({ onSelect }: FeatureSuggestionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {suggestions.map((suggestion) => {
        const Icon = suggestion.icon
        return (
          <Card
            key={suggestion.title}
            className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 cursor-pointer transition-all duration-300 p-4 group"
            onClick={() => onSelect?.(suggestion.title)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-colors">
                <Icon className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{suggestion.title}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{suggestion.description}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
