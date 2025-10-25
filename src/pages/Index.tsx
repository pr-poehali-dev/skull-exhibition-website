import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface SkullArtwork {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  linkUrl: string;
  linkText: string;
}

const skulls: SkullArtwork[] = [
  {
    id: 1,
    title: "Цветочный сон",
    imageUrl: "https://cdn.poehali.dev/files/c054c511-cb4a-4c34-821d-8ae72e82b96b.jpg",
    description: "Черный череп расцветает яркими красками мексиканских узоров. Глаз смотрит сквозь время, а розовый цветок напоминает о красоте жизни в каждом моменте.",
    linkUrl: "#",
    linkText: "Подробнее"
  },
  {
    id: 2,
    title: "Вечная весна",
    imageUrl: "https://cdn.poehali.dev/files/c054c511-cb4a-4c34-821d-8ae72e82b96b.jpg",
    description: "Сочетание традиционного искусства Dia de los Muertos с современной эстетикой. Каждая деталь наполнена символизмом и памятью.",
    linkUrl: "#",
    linkText: "Подробнее"
  },
  {
    id: 3,
    title: "Радужная память",
    imageUrl: "https://cdn.poehali.dev/files/c054c511-cb4a-4c34-821d-8ae72e82b96b.jpg",
    description: "Арт-объект, где смерть становится праздником цвета. Ручная роспись превращает каждый череп в уникальное произведение искусства.",
    linkUrl: "#",
    linkText: "Подробнее"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-12 md:py-20 px-4 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-light text-foreground mb-4">
          Галерея черепов
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Искусство памяти и красоты в минималистичном пространстве
        </p>
      </header>

      <main className="container max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skulls.map((skull, index) => (
            <Card 
              key={skull.id} 
              className="overflow-hidden bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={skull.imageUrl} 
                  alt={skull.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-card-foreground">
                  {skull.title}
                </h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  {skull.description}
                </p>
                
                <Button 
                  asChild 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href={skull.linkUrl} target="_blank" rel="noopener noreferrer">
                    {skull.linkText}
                    <Icon name="ArrowRight" className="ml-2" size={16} />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-muted-foreground border-t border-border">
        <p className="text-sm">
          Коллекция арт-объектов · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
