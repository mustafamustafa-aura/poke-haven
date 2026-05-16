import { motion } from "framer-motion";

const bowls = [
  {
    id: "classic",
    name: "Classic Hawaiian",
    price: "$14.99",
    image: "/classic-hawaiian.png",
    ingredients: "Ahi Tuna, Sweet Onion, Seaweed Salad, Shoyu",
  },
  {
    id: "spicy",
    name: "Spicy Tuna",
    price: "$15.49",
    image: "/spicy-tuna.png",
    ingredients: "Spicy Tuna, Jalapeno, Spicy Mayo, Scallions",
  },
  {
    id: "dragon",
    name: "Dragon Bowl",
    price: "$16.99",
    image: "/dragon-bowl.png",
    ingredients: "Salmon, Tobiko, Avocado, Unagi Sauce",
  },
  {
    id: "green",
    name: "Green Goddess",
    price: "$13.99",
    image: "/green-goddess.png",
    ingredients: "Tofu, Mixed Greens, Edamame, Cucumber",
  },
  {
    id: "sunset",
    name: "Sunset Bowl",
    price: "$16.49",
    image: "/sunset-bowl.png",
    ingredients: "Salmon, Tuna, Mango, Macadamia Nuts",
  },
  {
    id: "mango",
    name: "Island Mango",
    price: "$15.99",
    image: "/island-mango.png",
    ingredients: "Octopus, Fresh Mango, Cilantro, Citrus Ponzu",
  },
];

export function MenuSection() {
  return (
    <section id="menu" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Signature Bowls</h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Crafted by our chefs for the perfect flavor balance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bowls.map((bowl, index) => (
            <motion.div
              key={bowl.id}
              className="bg-background rounded-3xl p-6 relative group overflow-hidden border border-border transition-all duration-300 hover:border-primary/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(255,107,71,0.15)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/20" />
              
              <div className="aspect-square relative mb-6 flex justify-center items-center">
                <motion.img 
                  src={bowl.image} 
                  alt={bowl.name}
                  className="w-[80%] h-[80%] object-cover rounded-full drop-shadow-xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-display font-bold">{bowl.name}</h3>
                <span className="text-primary font-bold text-lg">{bowl.price}</span>
              </div>
              
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                {bowl.ingredients}
              </p>
              
              <button className="w-full py-3 rounded-full font-bold text-sm bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                Add to Order
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
