import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ModeratorAuth from '@/components/ModeratorAuth';

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
  authorName?: string;
  authorPhone?: string;
  createdAt?: string;
}

const MODERATOR_USERNAME = 'модерация005';
const MODERATOR_PASSWORD = '885522';

export default function Moderation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 7,
      title: 'Новая квартира на модерации',
      price: 45000,
      rooms: 2,
      area: 55,
      location: 'Восточный район',
      image: 'https://cdn.poehali.dev/projects/d13845ce-797c-4b47-b7b8-dab012dad499/files/e3c208a9-47e6-4af1-b521-694e67859ff3.jpg',
      verified: false,
      favorite: false,
      rentalType: 'long-term',
      moderationStatus: 'pending',
      authorName: 'Иван Петров',
      authorPhone: '+7 (999) 123-45-67',
      createdAt: new Date().toLocaleDateString('ru-RU')
    }
  ]);

  const handleLogin = (username: string, password: string) => {
    if (username === MODERATOR_USERNAME && password === MODERATOR_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Неверный логин или пароль');
    }
  };

  const handleApprove = (id: number) => {
    setListings(listings.map(listing => 
      listing.id === id ? { ...listing, moderationStatus: 'approved' as const } : listing
    ));
  };

  const handleReject = (id: number) => {
    setListings(listings.map(listing => 
      listing.id === id ? { ...listing, moderationStatus: 'rejected' as const } : listing
    ));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <ModeratorAuth onLogin={handleLogin} error={authError} />;
  }

  const pendingListings = listings.filter(l => l.moderationStatus === 'pending');
  const approvedListings = listings.filter(l => l.moderationStatus === 'approved');
  const rejectedListings = listings.filter(l => l.moderationStatus === 'rejected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Shield" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold">Панель модерации</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <Icon name="LogOut" className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-600">{pendingListings.length}</div>
                  <div className="text-sm text-muted-foreground">На модерации</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{approvedListings.length}</div>
                  <div className="text-sm text-muted-foreground">Одобрено</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{rejectedListings.length}</div>
                  <div className="text-sm text-muted-foreground">Отклонено</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {pendingListings.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Clock" className="text-yellow-600" />
                На модерации ({pendingListings.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {pendingListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-yellow-600">
                        <Icon name="Clock" size={12} className="mr-1" />
                        На модерации
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Icon name="MapPin" size={14} className="text-primary" />
                          {listing.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Home" size={14} className="text-primary" />
                          {listing.rooms} комн.
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Maximize" size={14} className="text-primary" />
                          {listing.area} м²
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} className="text-primary" />
                          {listing.createdAt}
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {listing.price.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {listing.rentalType === 'daily' ? 'за сутки' : 'в месяц'}
                        </div>
                      </div>

                      {listing.authorName && (
                        <div className="pt-3 border-t space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Icon name="User" size={14} className="text-muted-foreground" />
                            <span>{listing.authorName}</span>
                          </div>
                          {listing.authorPhone && (
                            <div className="flex items-center gap-2">
                              <Icon name="Phone" size={14} className="text-muted-foreground" />
                              <span>{listing.authorPhone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-3">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(listing.id)}
                        >
                          <Icon name="Check" className="mr-2" size={16} />
                          Одобрить
                        </Button>
                        <Button 
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(listing.id)}
                        >
                          <Icon name="X" className="mr-2" size={16} />
                          Отклонить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {approvedListings.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="CheckCircle" className="text-green-600" />
                Одобренные ({approvedListings.length})
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {approvedListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="relative h-32">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-green-600">
                        <Icon name="CheckCircle" size={10} />
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{listing.title}</h3>
                      <div className="text-lg font-bold text-primary mt-1">
                        {listing.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {rejectedListings.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="XCircle" className="text-red-600" />
                Отклонённые ({rejectedListings.length})
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {rejectedListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden opacity-60">
                    <div className="relative h-32">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-600">
                        <Icon name="XCircle" size={10} />
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{listing.title}</h3>
                      <div className="text-lg font-bold text-primary mt-1">
                        {listing.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
