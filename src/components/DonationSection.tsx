import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Music, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const { toast } = useToast();

  const predefinedAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCustomAmount(value);
      setSelectedAmount(numValue);
    } else {
      setCustomAmount(value);
    }
  };

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Support Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Help Us Amplify Portland's Music Scene
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your donation helps us showcase emerging artists, organize events, and build a stronger music community in Portland.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Impact Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Your Impact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Music className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Artist Development</h4>
                  <p className="text-sm text-muted-foreground">Supporting emerging musicians with resources and exposure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Community Events</h4>
                  <p className="text-sm text-muted-foreground">Organizing showcases and networking opportunities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Platform Growth</h4>
                  <p className="text-sm text-muted-foreground">Expanding our reach to feature more Portland artists</p>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Make a Donation</h3>
              
              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Choose Amount</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amount)}
                      className="h-12"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Primary Donation Button - Removed for PayPal only */}
              <div className="hidden">
                <Button 
                  size="lg" 
                  className="w-full h-12"
                  onClick={() => {
                    const amount = getCurrentAmount();
                    if (!amount || amount <= 0) {
                      toast({
                        title: "Invalid Amount",
                        description: "Please select or enter a valid donation amount.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    // For now, show success message - replace with actual payment processing
                    toast({
                      title: "Thank You!",
                      description: `Your donation of $${amount} would be processed here. Payment integration needed.`,
                    });
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donate ${getCurrentAmount() || 0}
                </Button>
              </div>
                
              {/* PayPal Integration */}
              <div className="mt-4">
                <div className="text-center text-sm text-muted-foreground mb-2">
                  Or donate with PayPal:
                </div>
                <PayPalScriptProvider options={{
                  clientId: "AYGAe2Q-c5PKcmT1kR-OGJ8Qp6B-jj9E3RSw-4QgKb7vkYE8-m7t5b4EdZlNCJnE5lLNemE-DWILZ2Uf", // Replace with your actual PayPal client ID
                  currency: "USD",
                  intent: "capture"
                }}>
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "gold",
                      shape: "rect",
                      label: "donate",
                      height: 45
                    }}
                    createOrder={(data, actions) => {
                      const amount = getCurrentAmount();
                      if (!amount || amount <= 0) {
                        toast({
                          title: "Invalid Amount",
                          description: "Please select or enter a valid donation amount.",
                          variant: "destructive",
                        });
                        return Promise.reject();
                      }

                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          amount: {
                            currency_code: "USD",
                            value: amount.toString()
                          },
                          description: `Donation to PDX.Foundation - $${amount}`
                        }]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (!actions.order) return;
                      
                      try {
                        const details = await actions.order.capture();
                        toast({
                          title: "Thank You!",
                          description: `Your donation of $${getCurrentAmount()} has been processed successfully! Transaction ID: ${details.id}`,
                        });
                        
                        // Reset the form after successful donation
                        setSelectedAmount(25);
                        setCustomAmount('');
                      } catch (error) {
                        console.error('PayPal donation error:', error);
                        toast({
                          title: "Payment Error",
                          description: "There was an issue processing your donation. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      toast({
                        title: "Payment Error",
                        description: "PayPal encountered an error. Please try again.",
                        variant: "destructive",
                      });
                    }}
                    onCancel={() => {
                      toast({
                        title: "Payment Cancelled",
                        description: "Your donation was cancelled.",
                      });
                    }}
                  />
                 </PayPalScriptProvider>
               </div>

               <p className="text-xs text-muted-foreground mt-4 text-center">
                 Secure payments processed by PayPal. Your donation helps support Portland's music community.
               </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;