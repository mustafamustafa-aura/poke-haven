export function Footer() {
  return (
    <footer className="bg-card py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="text-3xl font-display font-bold tracking-tight text-foreground mb-4">
              POKE<span className="text-primary">HAVEN</span>
            </div>
            <p className="text-foreground/60 max-w-sm">
              Fresh ingredients, bold flavors, and good vibes. Your daily escape in a bowl.
            </p>
          </div>
          
          <div>
            <h5 className="font-display font-bold text-lg mb-4">Location</h5>
            <p className="text-foreground/60 leading-loose">
              123 Surfside Blvd<br />
              Ocean District<br />
              CA 90210
            </p>
          </div>
          
          <div>
            <h5 className="font-display font-bold text-lg mb-4">Hours</h5>
            <p className="text-foreground/60 leading-loose">
              Mon-Fri: 11am - 9pm<br />
              Sat-Sun: 12pm - 10pm
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 text-center text-foreground/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Poke Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
