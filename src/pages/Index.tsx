import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Listing {
  id: number;
  title: string;
  price: number;
  rooms: number;
  area: number;
  location: string;
  image: string;
  verified: boolean;
  favorite: boolean;
}

const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Уютная однокомнатная квартира в центре',
    price: 35000,
    rooms: 1,
    area: 42,
    location: 'Центральный район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/e3c208a9-47e6-4af1-b521-694e67859ff3.jpg',
    verified: true,
    favorite: false
  },
  {
    id: 2,
    title: 'Просторная двушка с видом на парк',
    price: 52000,
    rooms: 2,
    area: 68,
    location: 'Парковый район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/3988e34d-d103-4f31-a7bd-da855d2de823.jpg',
    verified: true,
    favorite: false
  },
  {
    id: 3,
    title: 'Студия в новостройке с ремонтом',
    price: 28000,
    rooms: 1,
    area: 32,
    location: 'Северный район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/76082600-7fc7-449f-a6c6-936baf40c74c.jpg',
    verified: false,
    favorite: false
  },
  {
    id: 4,
    title: 'Трёхкомнатная квартира для семьи',
    price: 68000,
    rooms: 3,
    area: 85,
    location: 'Южный район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/e3c208a9-47e6-4af1-b521-694e67859ff3.jpg',
    verified: true,
    favorite: false
  },
  {
    id: 5,
    title: 'Квартира с евроремонтом',
    price: 45000,
    rooms: 2,
    area: 58,
    location: 'Западный район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/3988e34d-d103-4f31-a7bd-da855d2de823.jpg',
    verified: false,
    favorite: false
  },
  {
    id: 6,
    title: 'Лофт в историческом центре',
    price: 82000,
    rooms: 2,
    area: 95,
    location: 'Центральный район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/76082600-7fc7-449f-a6c6-936baf40c74c.jpg',
    verified: true,
    favorite: false
  }
];

export default function Index() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRooms, setSelectedRooms] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [activeView, setActiveView] = useState<'main' | 'listing' | 'add'>('main');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const toggleFavorite = (id: number) => {
    setListings(listings.map(listing => 
      listing.id === id ? { ...listing, favorite: !listing.favorite } : listing
    ));
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    const matchesRooms = selectedRooms === 'all' || listing.rooms.toString() === selectedRooms;
    const matchesDistrict = selectedDistrict === 'all' || listing.location === selectedDistrict;
    
    return matchesSearch && matchesPrice && matchesRooms && matchesDistrict;
  });

  if (activeView === 'listing' && selectedListing) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveView('main')}>
                <Icon name="ArrowLeft" className="mr-2" />
                Назад к объявлениям
              </Button>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Rently24
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative rounded-2xl overflow-hidden h-[500px]">
                <img 
                  src={selectedListing.image} 
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4"
                  onClick={() => toggleFavorite(selectedListing.id)}
                >
                  <Icon 
                    name={selectedListing.favorite ? "Heart" : "Heart"} 
                    className={selectedListing.favorite ? "fill-red-500 text-red-500" : ""}
                  />
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedListing.title}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Icon name="MapPin" size={18} />
                      {selectedListing.location}
                    </p>
                  </div>
                  {selectedListing.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <Icon name="CheckCircle" size={14} />
                      Проверено
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4 py-4 border-y">
                  <div className="flex items-center gap-2">
                    <Icon name="Home" className="text-primary" />
                    <span className="font-semibold">{selectedListing.rooms} комн.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Maximize" className="text-primary" />
                    <span className="font-semibold">{selectedListing.area} м²</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-3">Описание</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Сдаётся прекрасная квартира в отличном состоянии. Вся необходимая мебель и техника. 
                    Развитая инфраструктура: магазины, школы, детские сады в шаговой доступности. 
                    Удобная транспортная развязка. Тихий двор, охраняемая территория.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-3">Удобства</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Мебель', 'Холодильник', 'Стиральная машина', 'Интернет', 'Кондиционер', 'Балкон'].map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <Icon name="Check" size={16} className="text-primary" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {selectedListing.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-sm text-muted-foreground">в месяц</div>
                  </div>

                  <Button className="w-full" size="lg">
                    <Icon name="MessageCircle" className="mr-2" />
                    Написать арендодателю
                  </Button>

                  <Button variant="outline" className="w-full" size="lg">
                    <Icon name="Phone" className="mr-2" />
                    Показать телефон
                  </Button>

                  <div className="pt-4 border-t text-sm text-muted-foreground text-center">
                    <p>Объявление размещено 3 дня назад</p>
                    <p className="mt-1">Просмотров: 234</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (activeView === 'add') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveView('main')}>
                <Icon name="ArrowLeft" className="mr-2" />
                Отменить
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Новое объявление
              </h1>
              <Button>Опубликовать</Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="title">Заголовок объявления</Label>
                <Input id="title" placeholder="Например: Уютная двушка в центре" className="mt-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена (₽/месяц)</Label>
                  <Input id="price" type="number" placeholder="35000" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="rooms">Количество комнат</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 комната</SelectItem>
                      <SelectItem value="2">2 комнаты</SelectItem>
                      <SelectItem value="3">3 комнаты</SelectItem>
                      <SelectItem value="4">4+ комнат</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Площадь (м²)</Label>
                  <Input id="area" type="number" placeholder="45" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="district">Район</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выберите район" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Центральный</SelectItem>
                      <SelectItem value="north">Северный</SelectItem>
                      <SelectItem value="south">Южный</SelectItem>
                      <SelectItem value="west">Западный</SelectItem>
                      <SelectItem value="park">Парковый</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea 
                  id="description" 
                  placeholder="Расскажите о квартире, удобствах, расположении..."
                  className="mt-2 min-h-32"
                />
              </div>

              <div>
                <Label>Фотографии</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Icon name="Upload" className="mx-auto mb-2 text-muted-foreground" size={32} />
                  <p className="text-sm text-muted-foreground">Нажмите для загрузки фото</p>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Удобства</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Мебель', 'Холодильник', 'Стиральная машина', 'Интернет', 'Кондиционер', 'Балкон'].map(item => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Home" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Rently24
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost">Объявления</Button>
              <Button variant="ghost">Избранное</Button>
              <Button variant="ghost">Правила</Button>
              <Button variant="ghost">Контакты</Button>
              <Button onClick={() => setActiveView('add')}>
                <Icon name="Plus" className="mr-2" />
                Разместить
              </Button>
            </nav>
            <Button className="md:hidden" size="icon" variant="ghost">
              <Icon name="Menu" />
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Найдите идеальное жильё
            </h2>
            <p className="text-xl text-muted-foreground">
              Тысячи проверенных объявлений об аренде квартир
            </p>
          </div>

          <Card className="max-w-4xl mx-auto shadow-lg animate-scale-in">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Район, метро, адрес..." 
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="lg">
                  <Icon name="Search" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Количество комнат</Label>
                  <Select value={selectedRooms} onValueChange={setSelectedRooms}>
                    <SelectTrigger>
                      <SelectValue placeholder="Любое" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любое количество</SelectItem>
                      <SelectItem value="1">1 комната</SelectItem>
                      <SelectItem value="2">2 комнаты</SelectItem>
                      <SelectItem value="3">3 комнаты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Район</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Все районы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все районы</SelectItem>
                      <SelectItem value="Центральный район">Центральный</SelectItem>
                      <SelectItem value="Северный район">Северный</SelectItem>
                      <SelectItem value="Южный район">Южный</SelectItem>
                      <SelectItem value="Западный район">Западный</SelectItem>
                      <SelectItem value="Парковый район">Парковый</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">
                    Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={100000}
                    step={5000}
                    className="mt-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            Найдено объявлений: {filteredListings.length}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Icon name="SlidersHorizontal" className="mr-2" size={16} />
              Фильтры
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="ArrowUpDown" className="mr-2" size={16} />
              Сортировка
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card 
              key={listing.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => {
                setSelectedListing(listing);
                setActiveView('listing');
              }}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(listing.id);
                  }}
                >
                  <Icon 
                    name={listing.favorite ? "Heart" : "Heart"} 
                    size={18}
                    className={listing.favorite ? "fill-red-500 text-red-500" : ""}
                  />
                </Button>
                {listing.verified && (
                  <Badge className="absolute top-3 left-3 bg-primary gap-1">
                    <Icon name="CheckCircle" size={12} />
                    Проверено
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                    {listing.title}
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {listing.location}
                </p>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <Icon name="Home" size={14} className="text-primary" />
                    {listing.rooms} комн.
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Maximize" size={14} className="text-primary" />
                    {listing.area} м²
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {listing.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-muted-foreground">в месяц</div>
                  </div>
                  <Button size="sm">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t mt-16 py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Home" className="text-primary" size={28} />
                <span className="text-xl font-bold">АрендуюТут</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Платформа для поиска и размещения объявлений об аренде жилья
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Разделы</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Объявления</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Добавить объявление</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Избранное</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Правила размещения</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">О сервисе</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  support@arenduyutut.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (800) 123-45-67
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 АрендуюТут. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}