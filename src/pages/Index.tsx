import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  rentalType: 'daily' | 'long-term';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  ownerName: string;
  ownerPhone: string;
}

interface Chat {
  id: number;
  listingId: number;
  listingTitle: string;
  listingImage: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: number;
  chatId: number;
  senderId: string;
  text: string;
  time: string;
  isOwn: boolean;
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
    favorite: false,
    rentalType: 'long-term',
    moderationStatus: 'approved',
    ownerName: 'Анна Петрова',
    ownerPhone: '+7 (999) 123-45-67'
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
    favorite: false,
    rentalType: 'long-term',
    moderationStatus: 'approved',
    ownerName: 'Игорь Смирнов',
    ownerPhone: '+7 (999) 234-56-78'
  },
  {
    id: 3,
    title: 'Студия в новостройке с ремонтом',
    price: 2800,
    rooms: 1,
    area: 32,
    location: 'Северный район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/76082600-7fc7-449f-a6c6-936baf40c74c.jpg',
    verified: false,
    favorite: false,
    rentalType: 'daily',
    moderationStatus: 'approved',
    ownerName: 'Елена Соколова',
    ownerPhone: '+7 (999) 345-67-89'
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
    favorite: false,
    rentalType: 'long-term',
    moderationStatus: 'approved',
    ownerName: 'Дмитрий Кузнецов',
    ownerPhone: '+7 (999) 456-78-90'
  },
  {
    id: 5,
    title: 'Квартира с евроремонтом',
    price: 3500,
    rooms: 2,
    area: 58,
    location: 'Западный район',
    image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/3988e34d-d103-4f31-a7bd-da855d2de823.jpg',
    verified: false,
    favorite: false,
    rentalType: 'daily',
    moderationStatus: 'approved',
    ownerName: 'Мария Волкова',
    ownerPhone: '+7 (999) 567-89-01'
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
    favorite: false,
    rentalType: 'long-term',
    moderationStatus: 'approved',
    ownerName: 'Сергей Новиков',
    ownerPhone: '+7 (999) 678-90-12'
  }
];

const mockChats: Chat[] = [
  {
    id: 1,
    listingId: 2,
    listingTitle: 'Просторная двушка с видом на парк',
    listingImage: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/3988e34d-d103-4f31-a7bd-da855d2de823.jpg',
    participantName: 'Игорь Смирнов',
    lastMessage: 'Квартира еще доступна?',
    lastMessageTime: '14:32',
    unreadCount: 2
  },
  {
    id: 2,
    listingId: 4,
    listingTitle: 'Трёхкомнатная квартира для семьи',
    listingImage: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/e3c208a9-47e6-4af1-b521-694e67859ff3.jpg',
    participantName: 'Дмитрий Кузнецов',
    lastMessage: 'Спасибо за информацию!',
    lastMessageTime: 'Вчера',
    unreadCount: 0
  }
];

function AuthButton({ onAddListing }: { onAddListing: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button onClick={() => navigate('/auth')}>
        <Icon name="LogIn" className="mr-2" />
        Войти
      </Button>
    );
  }

  return (
    <>
      <Button onClick={onAddListing}>
        <Icon name="Plus" className="mr-2" />
        Разместить
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icon name="User" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            <Icon name="User" className="mr-2" size={16} />
            {user.name}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <Icon name="LogOut" className="mr-2" size={16} />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRooms, setSelectedRooms] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedRentalType, setSelectedRentalType] = useState<string>('all');
  const [activeView, setActiveView] = useState<'main' | 'listing' | 'add' | 'messages' | 'chat'>('main');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [chats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, chatId: 1, senderId: 'other', text: 'Здравствуйте! Интересует эта квартира', time: '14:20', isOwn: false },
    { id: 2, chatId: 1, senderId: 'me', text: 'Добрый день! Да, квартира свободна', time: '14:25', isOwn: true },
    { id: 3, chatId: 1, senderId: 'other', text: 'Квартира еще доступна?', time: '14:32', isOwn: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleAddListing = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setActiveView('add');
  };

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
    const matchesRentalType = selectedRentalType === 'all' || listing.rentalType === selectedRentalType;
    const isApproved = listing.moderationStatus === 'approved';
    
    return matchesSearch && matchesPrice && matchesRooms && matchesDistrict && matchesRentalType && isApproved;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      chatId: selectedChat.id,
      senderId: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  if (activeView === 'messages') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveView('main')}>
                <Icon name="ArrowLeft" className="mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Сообщения
              </h1>
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {chats.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Icon name="MessageCircle" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Нет сообщений</h3>
                <p className="text-muted-foreground mb-6">
                  Начните общение с арендодателями через объявления
                </p>
                <Button onClick={() => setActiveView('main')}>
                  Смотреть объявления
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {chats.map(chat => (
                <Card 
                  key={chat.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedChat(chat);
                    setActiveView('chat');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={chat.listingImage} 
                        alt={chat.listingTitle}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold truncate">{chat.participantName}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {chat.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          {chat.listingTitle}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm truncate">{chat.lastMessage}</p>
                          {chat.unreadCount > 0 && (
                            <Badge className="ml-2">{chat.unreadCount}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (activeView === 'chat' && selectedChat) {
    const chatMessages = messages.filter(m => m.chatId === selectedChat.id);
    
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveView('messages')}>
                <Icon name="ArrowLeft" className="mr-2" />
                Назад
              </Button>
              <div className="text-center">
                <h2 className="font-bold">{selectedChat.participantName}</h2>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {selectedChat.listingTitle}
                </p>
              </div>
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-4 max-w-4xl overflow-y-auto">
          <div className="space-y-4">
            {chatMessages.map(msg => (
              <div 
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.isOwn ? 'bg-primary text-primary-foreground' : 'bg-white'} rounded-2xl px-4 py-2 shadow`}>
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'} block text-right mt-1`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <div className="border-t bg-white sticky bottom-0">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <div className="flex gap-2">
              <Input 
                placeholder="Напишите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Icon name="Send" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      if (!user) {
                        navigate('/auth');
                        return;
                      }
                      const existingChat = chats.find(c => c.listingId === selectedListing.id);
                      if (existingChat) {
                        setSelectedChat(existingChat);
                        setActiveView('chat');
                      } else {
                        alert('Начат новый чат с арендодателем');
                        setActiveView('messages');
                      }
                    }}
                  >
                    <Icon name="MessageCircle" className="mr-2" />
                    Написать арендодателю
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      if (!user) {
                        alert('Для просмотра контактов необходимо зарегистрироваться');
                        navigate('/auth');
                        return;
                      }
                      alert(`Телефон: ${selectedListing.ownerPhone}`);
                    }}
                  >
                    <Icon name="Phone" className="mr-2" />
                    {user ? 'Показать телефон' : 'Войдите, чтобы увидеть телефон'}
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
              <Button onClick={() => {
                alert('Объявление отправлено на модерацию! После проверки оно появится в каталоге.');
                setActiveView('main');
              }}>Отправить на модерацию</Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Info" className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Модерация объявлений</h3>
                <p className="text-sm text-yellow-800">
                  Все объявления проходят проверку модератором перед публикацией. 
                  Это занимает от нескольких минут до нескольких часов.
                </p>
              </div>
            </div>
          </div>

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
              <Logo size={32} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Rently24
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setActiveView('main')}>Объявления</Button>
              <Button variant="ghost">Избранное</Button>
              <Button variant="ghost" onClick={() => {
                if (!user) {
                  navigate('/auth');
                  return;
                }
                setActiveView('messages');
              }}>Сообщения</Button>
              <Button variant="ghost">Правила</Button>
              <Button variant="ghost">Контакты</Button>
              <AuthButton onAddListing={handleAddListing} />
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
                  <Label className="text-sm mb-2 block">Тип аренды</Label>
                  <Select value={selectedRentalType} onValueChange={setSelectedRentalType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Все типы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы</SelectItem>
                      <SelectItem value="daily">Посуточно</SelectItem>
                      <SelectItem value="long-term">Длительная аренда</SelectItem>
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
                  <Badge variant="outline" className="text-xs">
                    {listing.rentalType === 'daily' ? '📅 Посуточно' : '📆 Долгосрок'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {listing.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {listing.rentalType === 'daily' ? 'за сутки' : 'в месяц'}
                    </div>
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
                <span className="text-xl font-bold">Rently24</span>
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
                  support@rently24.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (800) 123-45-67
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Rently24. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}