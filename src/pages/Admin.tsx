import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "skull2024";
const API_URL = "https://functions.poehali.dev/8ccfdb62-48d9-421d-a58f-4e9fac85790f";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    linkText: "Подробнее"
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать в админ-панель"
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Неверный пароль",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'skull_admin_secret_2024'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Успешно!",
          description: "Новая работа добавлена в галерею"
        });
        
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          linkUrl: "",
          linkText: "Подробнее"
        });
        
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error("Failed to add skull");
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить работу",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-light mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">Введите пароль для доступа</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="mt-1"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-light">Добавить работу</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            На главную
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Цветочный сон"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Опишите идею и концепцию работы..."
                required
                rows={5}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Ссылка на изображение</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://..."
                required
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Загрузите изображение на любой хостинг и вставьте ссылку
              </p>
            </div>

            <div>
              <Label htmlFor="linkUrl">Ссылка (необязательно)</Label>
              <Input
                id="linkUrl"
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="linkText">Текст кнопки</Label>
              <Input
                id="linkText"
                value={formData.linkText}
                onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                placeholder="Подробнее"
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Добавление..." : "Добавить в галерею"}
              <Icon name="Plus" className="ml-2" size={16} />
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
