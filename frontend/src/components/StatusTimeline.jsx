import React from 'react';
import { Check, Flame, ClipboardList, Bell, CheckCircle2, XCircle } from 'lucide-react';

export default function StatusTimeline({ status }) {
  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Payment verified successfully', icon: ClipboardList },
    { key: 'ACCEPTED', label: 'Accepted', desc: 'Café staff confirmed order', icon: Bell },
    { key: 'PREPARING', label: 'Preparing', desc: 'Food is being freshly prepared', icon: Flame },
    { key: 'READY', label: 'Ready to Collect', desc: 'Grab your order from counter', icon: CheckCircle2 },
    { key: 'COMPLETED', label: 'Completed', desc: 'Order collected successfully', icon: Check },
  ];

  const getStatusIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'PLACED': return 0;
      case 'ACCEPTED': return 1;
      case 'PREPARING': return 2;
      case 'READY': return 3;
      case 'COMPLETED': return 4;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(status);

  if (status === 'CANCELLED') {
    return (
      <div className="bg-accent-red-light/20 border border-accent-red/20 rounded-3xl p-6 flex items-start space-x-4">
        <div className="p-3 bg-accent-red/10 text-accent-red rounded-full flex-shrink-0">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-accent-red font-sans">Order Cancelled</h4>
          <p className="text-sm text-stone-600 mt-1">
            This order has been cancelled by the cafe staff. If you have been charged, a refund will be processed shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const StepIcon = step.icon;

        return (
          <div key={step.key} className="flex group relative">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-6 top-12 bottom-[-20px] w-1 -ml-[2px] transition-colors duration-500 ${
                  index < currentIndex ? 'bg-accent-orange' : 'bg-stone-200'
                }`}
              />
            )}

            {/* Icon Circle */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                isCompleted
                  ? 'bg-accent-orange text-white shadow-md shadow-accent-orange/30'
                  : isActive
                  ? 'bg-stone-900 text-white shadow-lg scale-110 ring-4 ring-stone-100 animate-pulse-subtle'
                  : 'bg-stone-100 text-stone-400 border border-stone-200/40'
              }`}
            >
              {isCompleted ? (
                <Check className="w-5.5 h-5.5" />
              ) : (
                <StepIcon className="w-5.5 h-5.5" />
              )}
            </div>

            {/* Step Content */}
            <div className="ml-5 flex-1 pb-1">
              <h4
                className={`font-bold text-base transition-colors ${
                  isActive ? 'text-stone-900' : isCompleted ? 'text-stone-700' : 'text-stone-400'
                }`}
              >
                {step.label}
              </h4>
              <p
                className={`text-xs mt-0.5 transition-colors ${
                  isActive ? 'text-stone-600 font-medium' : isCompleted ? 'text-stone-500' : 'text-stone-400'
                }`}
              >
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
