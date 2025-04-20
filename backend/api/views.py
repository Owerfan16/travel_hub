from django.shortcuts import render
from rest_framework import viewsets, status, generics, permissions, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.db.models import Q
from .models import (
    Ticket, TrainTicket, PopularTour, TravelIdea,
    Country, City, Airport, RailwayStation, SearchAirTicket, SearchTrainTicket, SearchTour
)
from .serializers import (
    TicketSerializer, UserSerializer, RegisterSerializer, 
    LoginSerializer, TrainTicketSerializer, PopularTourSerializer, TravelIdeaSerializer,
    CountrySerializer, CitySerializer, AirportSerializer, RailwayStationSerializer,
    SearchAirTicketSerializer, SearchTrainTicketSerializer, SearchTourSerializer
)

# CSRF Token view for frontend
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return JsonResponse({"success": "CSRF cookie set"})

# User views
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # Проверяем, что имя пользователя было указано
        if 'username' not in request.data:
            request.data['username'] = request.data.get('email', '').split('@')[0]
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Log the user in
        login(request, user)
        
        return Response(
            {
                "message": "User registered successfully", 
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        
        # Пытаемся найти пользователя по email
        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Проверяем аутентификацию
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            return Response(
                {
                    "message": "Login successful",
                    "user": UserSerializer(user).data
                }, 
                status=status.HTTP_200_OK
            )
        
        return Response(
            {"error": "Invalid credentials"}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

# Create your views here.

class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Ticket.objects.all().prefetch_related('airlines')
        date = self.request.query_params.get('date', None)
        if date is not None:
            queryset = queryset.filter(date=date)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TrainTicketViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TrainTicketSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = TrainTicket.objects.all().prefetch_related('companies')
        date = self.request.query_params.get('date', None)
        if date is not None:
            queryset = queryset.filter(date=date)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PopularTourViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PopularTourSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return PopularTour.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
        
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            # Debug: проверить MIME-типы изображений
            for tour in queryset:
                if tour.image:
                    print(f"Image path: {tour.image.path}, MIME-type: {tour.image.content_type if hasattr(tour.image, 'content_type') else 'unknown'}")
            
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in PopularTourViewSet.list: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TravelIdeaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TravelIdeaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return TravelIdea.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
        
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in TravelIdeaViewSet.list: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Новые представления для системы поиска

class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]
    queryset = Country.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CitySerializer
    permission_classes = [AllowAny]
    queryset = City.objects.all().select_related('country')
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'country__name']
    
    def get_queryset(self):
        queryset = City.objects.all().select_related('country')
        country_id = self.request.query_params.get('country_id', None)
        country_name = self.request.query_params.get('country', None)
        
        if country_id:
            queryset = queryset.filter(country_id=country_id)
        elif country_name:
            queryset = queryset.filter(country__name__icontains=country_name)
            
        return queryset

class LocationSuggestionView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        query = request.query_params.get('query', '')
        if not query or len(query) < 2:
            return Response({"results": []})
        
        # Для поиска используем нечеткое совпадение (contains)
        # Ищем по городам, аэропортам и ж/д станциям
        cities = City.objects.filter(
            Q(name__icontains=query) | Q(country__name__icontains=query)
        ).select_related('country')[:5]
        
        airports = Airport.objects.filter(
            Q(name__icontains=query) | Q(code__icontains=query) | 
            Q(city__name__icontains=query)
        ).select_related('city', 'city__country')[:5]
        
        railway_stations = RailwayStation.objects.filter(
            Q(name__icontains=query) | Q(city__name__icontains=query)
        ).select_related('city', 'city__country')[:5]
        
        # Формируем результаты в зависимости от типа страницы
        page_type = request.query_params.get('page_type', 'air')
        results = []
        
        if page_type == 'air':
            # Для авиабилетов показываем города и аэропорты
            for city in cities:
                results.append(f"{city.name}, {city.country.name}")
            
            for airport in airports:
                results.append(f"{airport.city.name} ({airport.code}), {airport.city.country.name}")
                
        elif page_type == 'train':
            # Для ж/д билетов показываем города и ж/д станции
            for city in cities:
                results.append(f"{city.name}, {city.country.name}")
            
            for station in railway_stations:
                results.append(f"{station.city.name} ({station.name}), {station.city.country.name}")
                
        elif page_type == 'tour':
            # Для туров показываем только города
            for city in cities:
                results.append(f"{city.name}, {city.country.name}")
        
        # Удаляем дубликаты и возвращаем результаты
        unique_results = list(dict.fromkeys(results))
        return Response({"results": unique_results[:10]})

class SearchAirTicketViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SearchAirTicketSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = SearchAirTicket.objects.all().prefetch_related(
            'airlines', 'from_airport', 'to_airport', 'from_airport__city', 
            'to_airport__city', 'from_airport__city__country', 
            'to_airport__city__country', 'transfer_city'
        )
        
        # Фильтрация по локациям
        from_airport = self.request.query_params.get('from_airport', None)
        to_airport = self.request.query_params.get('to_airport', None)
        from_city = self.request.query_params.get('from_city', None)
        to_city = self.request.query_params.get('to_city', None)
        
        if from_airport:
            queryset = queryset.filter(from_airport_id=from_airport)
        elif from_city:
            queryset = queryset.filter(from_airport__city__name__icontains=from_city)
            
        if to_airport:
            queryset = queryset.filter(to_airport_id=to_airport)
        elif to_city:
            queryset = queryset.filter(to_airport__city__name__icontains=to_city)
        
        # Фильтрация по дате
        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(departure_date=date)
        
        # Фильтрация по классу
        travel_class = self.request.query_params.get('class', None)
        if travel_class == 'economy':
            queryset = queryset.filter(economy_available=True)
        elif travel_class == 'business':
            queryset = queryset.filter(business_available=True)
        
        # Сортировка
        sort_by = self.request.query_params.get('sort', 'recommendation')
        if sort_by == 'price_asc':
            queryset = queryset.order_by('economy_price')
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-economy_price')
        elif sort_by == 'duration':
            queryset = queryset.order_by('duration')
        else:  # По умолчанию сортировка по рекомендации
            queryset = queryset.order_by('-recommendation_score', 'economy_price')
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class SearchTrainTicketViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SearchTrainTicketSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = SearchTrainTicket.objects.all().prefetch_related(
            'companies', 'from_station', 'to_station', 'from_station__city', 
            'to_station__city', 'from_station__city__country', 
            'to_station__city__country'
        )
        
        # Фильтрация по локациям
        from_station = self.request.query_params.get('from_station', None)
        to_station = self.request.query_params.get('to_station', None)
        from_city = self.request.query_params.get('from_city', None)
        to_city = self.request.query_params.get('to_city', None)
        
        if from_station:
            queryset = queryset.filter(from_station_id=from_station)
        elif from_city:
            queryset = queryset.filter(from_station__city__name__icontains=from_city)
            
        if to_station:
            queryset = queryset.filter(to_station_id=to_station)
        elif to_city:
            queryset = queryset.filter(to_station__city__name__icontains=to_city)
        
        # Фильтрация по дате
        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(departure_date=date)
        
        # Фильтрация по классу
        travel_class = self.request.query_params.get('class', None)
        if travel_class == 'sitting':
            queryset = queryset.filter(sitting_available=True)
        elif travel_class == 'platzkart':
            queryset = queryset.filter(platzkart_available=True)
        elif travel_class == 'coupe':
            queryset = queryset.filter(coupe_available=True)
        elif travel_class == 'sv':
            queryset = queryset.filter(sv_available=True)
        
        # Сортировка
        sort_by = self.request.query_params.get('sort', 'recommendation')
        if sort_by == 'price_asc':
            # Сортировка по минимальной цене доступного класса
            queryset = queryset.order_by('coupe_price')  # Примерная сортировка, логика берется из сериализатора
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-coupe_price')
        elif sort_by == 'duration':
            queryset = queryset.order_by('duration')
        else:  # По умолчанию сортировка по рекомендации
            queryset = queryset.order_by('-recommendation_score', 'coupe_price')
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class SearchTourViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SearchTourSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = SearchTour.objects.all().select_related('city', 'city__country')
        
        # Фильтрация по локации
        city = self.request.query_params.get('city', None)
        country = self.request.query_params.get('country', None)
        
        if city:
            queryset = queryset.filter(city__name__icontains=city)
        if country:
            queryset = queryset.filter(city__country__name__icontains=country)
        
        # Фильтрация по звездности отеля
        stars = self.request.query_params.get('stars', None)
        if stars and stars.isdigit():
            queryset = queryset.filter(hotel_stars=int(stars))
        
        # Фильтрация по опциям
        food_included = self.request.query_params.get('food', None)
        if food_included == 'true':
            queryset = queryset.filter(food_included=True)
        
        pets_allowed = self.request.query_params.get('pets', None)
        if pets_allowed == 'true':
            queryset = queryset.filter(pets_allowed=True)
        
        # Фильтрация по рейтингу
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating and min_rating.replace('.', '', 1).isdigit():
            queryset = queryset.filter(rating__gte=float(min_rating))
        
        # Фильтрация по цене
        price_min = self.request.query_params.get('price_min', None)
        price_max = self.request.query_params.get('price_max', None)
        
        if price_min and price_min.isdigit():
            queryset = queryset.filter(price_per_night__gte=int(price_min))
        if price_max and price_max.isdigit():
            queryset = queryset.filter(price_per_night__lte=int(price_max))
        
        # Сортировка
        sort_by = self.request.query_params.get('sort', 'recommendation')
        if sort_by == 'price_asc':
            queryset = queryset.order_by('price_per_night')
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-price_per_night')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')
        else:  # По умолчанию сортировка по рекомендации
            queryset = queryset.order_by('-recommendation_score', 'price_per_night')
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
