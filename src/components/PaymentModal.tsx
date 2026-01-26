"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, Zap, Star, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    id: string
    name: string
    provider: string
    price: string
    rating: number
    distance: string
    image?: string
    description: string
    estimatedTime: string
  }
  onPaymentSuccess?: (paymentId: string) => void
  theme?: string
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  service,
  onPaymentSuccess,
  theme = 'sunset'
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const paymentId = `pay_${Date.now()}`
    onPaymentSuccess?.(paymentId)
    setIsProcessing(false)
    onClose()
  }

  const isDarkTheme = theme === 'cyberpunk' || theme === 'galaxy'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl ${
              isDarkTheme
                ? 'bg-gray-900 border border-purple-500/30'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>
                Complete Booking
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={`h-8 w-8 ${
                  isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Service Summary */}
            <div className={`p-4 rounded-2xl mb-6 ${
              isDarkTheme
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-gray-50 border border-gray-100'
            }`}>
              <div className="flex items-start gap-4">
                <img
                  src={service.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face`}
                  alt={service.provider}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  }`}>{service.name}</h3>
                  <p className={`text-sm ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                  }`}>with {service.provider}</p>

                  <div className={`flex items-center gap-4 mt-2 text-sm ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{service.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <div className={`text-right ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className="text-2xl font-bold">{service.price}</div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium mb-3 ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Payment Method
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'apple', label: 'Apple Pay', icon: Shield },
                  { id: 'google', label: 'Google Pay', icon: Zap }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id as any)}
                    className={`p-3 rounded-xl border transition-all ${
                      paymentMethod === id
                        ? isDarkTheme
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-blue-500 bg-blue-50'
                        : isDarkTheme
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-1 ${
                      paymentMethod === id
                        ? isDarkTheme ? 'text-purple-400' : 'text-blue-600'
                        : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div className={`text-xs ${
                      paymentMethod === id
                        ? isDarkTheme ? 'text-purple-300' : 'text-blue-600'
                        : isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500'
                        : 'bg-white border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                      className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        isDarkTheme
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500'
                          : 'bg-white border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                      className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        isDarkTheme
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500'
                          : 'bg-white border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      isDarkTheme
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500'
                        : 'bg-white border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                </motion.div>
              )}
            </div>

            {/* Security Notice */}
            <div className={`flex items-center gap-2 p-3 rounded-xl mb-6 ${
              isDarkTheme
                ? 'bg-gray-800/50 text-gray-300'
                : 'bg-green-50 text-green-700'
            }`}>
              <Shield className="h-4 w-4" />
              <span className="text-sm">Secured by 256-bit SSL encryption</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`flex-1 ${
                  isDarkTheme
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Pay ${service.price}`
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal
