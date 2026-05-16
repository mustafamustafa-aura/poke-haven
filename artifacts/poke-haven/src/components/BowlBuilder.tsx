import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: "base",
    title: "Choose Your Base",
    options: ["White Rice", "Brown Rice", "Mixed Greens", "Zoodles"],
    multi: false,
  },
  {
    id: "protein",
    title: "Pick Your Protein",
    options: ["Ahi Tuna", "Salmon", "Octopus", "Tofu", "Chicken"],
    multi: false,
  },
  {
    id: "toppings",
    title: "Add Toppings",
    options: ["Edamame", "Mango", "Avocado", "Cucumber", "Seaweed", "Corn", "Crispy Onions"],
    multi: true,
  },
  {
    id: "sauce",
    title: "Finish with Sauce",
    options: ["Ponzu", "Spicy Mayo", "Sesame Ginger", "Shoyu"],
    multi: false,
  },
];

export function BowlBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({
    base: [],
    protein: [],
    toppings: [],
    sauce: [],
  });

  const step = steps[currentStep];

  const toggleOption = (option: string) => {
    setSelections(prev => {
      const current = prev[step.id] || [];
      if (step.multi) {
        return {
          ...prev,
          [step.id]: current.includes(option) 
            ? current.filter(item => item !== option)
            : [...current, option]
        };
      } else {
        return {
          ...prev,
          [step.id]: [option]
        };
      }
    });
  };

  const isNextDisabled = selections[step.id]?.length === 0;

  return (
    <section id="builder" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Build Your Bowl
          </motion.h2>
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((s, i) => (
              <div 
                key={s.id} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  i <= currentStep ? "w-12 bg-primary" : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              <h3 className="text-3xl font-display font-bold mb-8 text-center">{step.title}</h3>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {step.options.map(option => {
                  const isSelected = selections[step.id]?.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleOption(option)}
                      className={`px-6 py-4 rounded-2xl text-lg font-medium transition-all duration-200 border-2 ${
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary scale-105 shadow-[0_10px_20px_-10px_rgba(255,107,71,0.5)]" 
                          : "bg-background border-border hover:border-primary/50 hover:bg-muted text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="bg-transparent"
            >
              Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={isNextDisabled}
                className="bg-primary hover:bg-primary/90"
              >
                Next Step
              </Button>
            ) : (
              <Button
                disabled={isNextDisabled}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 shadow-lg"
                onClick={() => alert("Order Placed! (Demo)")}
              >
                Complete Order
              </Button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-12 text-center p-6 bg-muted/50 rounded-2xl">
          <h4 className="text-xl font-display font-bold mb-4">Your Bowl Summary</h4>
          <p className="text-foreground/70">
            {Object.entries(selections).map(([key, vals]) => vals.join(", ")).filter(Boolean).join(" • ") || "Select ingredients to build your bowl"}
          </p>
        </div>
      </div>
    </section>
  );
}
