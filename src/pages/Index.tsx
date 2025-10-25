import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface SkullArtwork {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  linkUrl: string;
  linkText: string;
}

const API_URL = "https://functions.poehali.dev/8ccfdb62-48d9-421d-a58f-4e9fac85790f";

const Index = () => {
  const [skulls, setSkulls] = useState<SkullArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkulls = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setSkulls(data.skulls || []);
      } catch (error) {
        console.error("Failed to fetch skulls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkulls();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="py-12 md:py-20 px-4 text-center animate-fade-in relative">
        <h1 className="text-5xl md:text-7xl font-light text-foreground mb-4">
          Галерея черепов
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Искусство памяти и красоты в минималистичном пространстве
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <Icon name="Settings" size={20} />
        </Button>
      </header>

      <main className="container max-w-6xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : skulls.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Пока нет работ в галерее</p>
            <Button onClick={() => navigate("/admin")}>
              <Icon name="Plus" className="mr-2" size={16} />
              Добавить первую работу
            </Button>
          </div>
        ) : (
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
                  
                  {skull.linkUrl && skull.linkUrl !== '#' && (
                    <Button 
                      asChild 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <a href={skull.linkUrl} target="_blank" rel="noopener noreferrer">
                        {skull.linkText}
                        <Icon name="ArrowRight" className="ml-2" size={16} />
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
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
