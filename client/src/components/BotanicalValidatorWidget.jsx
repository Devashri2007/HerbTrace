import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

const BotanicalValidatorWidget = ({ validation, compact = false }) => {
  if (!validation) return null;

  const {
    validatorStatus = 'Consistent',
    validationMessage = '',
    confidenceScore = 95,
    flags = [],
    matchedHerb = null,
    validationRulesVersion = 'v2.4-AYUSH-AYUR',
    validatedAt,
  } = validation;

  const isConsistent = validatorStatus === 'Consistent';
  const isWarning = validatorStatus === 'Warning';
  const isDanger = validatorStatus === 'Requires Verification';

  const badgeConfig = isConsistent
    ? {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badge: 'bg-emerald-600 text-white',
        icon: CheckCircle2,
        title: 'Botanical Consistency Verified',
        border: 'border-emerald-200',
      }
    : isWarning
    ? {
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        badge: 'bg-amber-600 text-white',
        icon: AlertTriangle,
        title: 'Botanical Consistency Warning',
        border: 'border-amber-300',
      }
    : {
        bg: 'bg-rose-50 text-rose-900 border-rose-200',
        badge: 'bg-rose-600 text-white',
        icon: ShieldAlert,
        title: 'Requires Laboratory Pharmacognosy Verification',
        border: 'border-rose-300',
      };

  const Icon = badgeConfig.icon;

  if (compact) {
    return (
      <div className={`p-3 rounded-lg border ${badgeConfig.bg} ${badgeConfig.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold">{badgeConfig.title}</span>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current">
            {confidenceScore}% Match
          </span>
        </div>
        <p className="text-[11px] mt-1.5 opacity-90 leading-relaxed">{validationMessage}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${badgeConfig.bg} ${badgeConfig.border} p-5 shadow-sm space-y-4`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${badgeConfig.badge}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight">{badgeConfig.title}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeConfig.badge}`}>
                {validatorStatus}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
              <span>Rules Engine: {validationRulesVersion}</span>
              {validatedAt && <span>• {new Date(validatedAt).toLocaleDateString()}</span>}
            </p>
          </div>
        </div>

        {/* Confidence Score Gauge */}
        <div className="text-right">
          <div className="text-[11px] font-medium text-gray-500">Taxonomic Confidence</div>
          <div className="flex items-center gap-2 justify-end mt-0.5">
            <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  confidenceScore >= 80 ? 'bg-emerald-500' : confidenceScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
            <span className="text-xs font-bold font-mono">{confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Validation Message */}
      <div className="text-xs leading-relaxed font-medium">
        {validationMessage}
      </div>

      {/* Flags / Alerts */}
      {flags && flags.length > 0 && (
        <div className="bg-white/70 rounded-lg p-3 border border-current/10 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
            Taxonomic Alerts ({flags.length})
          </span>
          {flags.map((flag, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px]">
              <span className="text-amber-600 font-bold">•</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Matched Ayurvedic Pharmacopoeia Reference */}
      {matchedHerb && (
        <div className="bg-white/90 rounded-lg p-3.5 border border-botanical-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-botanical-900 border-b border-botanical-100 pb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-botanical-600" />
            <span>Ayurvedic Pharmacopoeia Reference Data</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-gray-500">Standard Family:</span>{' '}
              <span className="font-semibold text-botanical-950">{matchedHerb.family}</span>
            </div>
            <div>
              <span className="text-gray-500">Accepted Plant Parts:</span>{' '}
              <span className="font-semibold text-botanical-950">
                {Array.isArray(matchedHerb.acceptedParts) ? matchedHerb.acceptedParts.join(', ') : matchedHerb.acceptedParts}
              </span>
            </div>
            {matchedHerb.activePhytochemicalMarker && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Target Active Phytochemical:</span>{' '}
                <span className="font-mono text-botanical-800 font-medium">
                  {matchedHerb.activePhytochemicalMarker}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-[10px] text-gray-400 italic">
        * Software-based botanical taxonomy & plant part consistency validation system. Not a substitute for laboratory HPLC pharmacognosy.
      </div>
    </div>
  );
};

export default BotanicalValidatorWidget;
