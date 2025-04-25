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
    Country, City, Airport, RailwayStation, SearchAirTicket, SearchTrainTicket, SearchTour,
    Airline, RailwayCompany
)
from .serializers import (
    TicketSerializer, UserSerializer, RegisterSerializer, 
    LoginSerializer, TrainTicketSerializer, PopularTourSerializer, TravelIdeaSerializer,
    CountrySerializer, CitySerializer, AirportSerializer, RailwayStationSerializer,
    SearchAirTicketSerializer, SearchTrainTicketSerializer, SearchTourSerializer,
    AirlineSerializer, RailwayCompanySerializer
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
        
        # Фильтрация по максимальной цене
        max_economy_price = self.request.query_params.get('max_economy_price', None)
        if max_economy_price and max_economy_price.isdigit():
            queryset = queryset.filter(economy_price__lte=int(max_economy_price))
            
        # Фильтрация по максимальной длительности пересадки
        max_transfer_duration = self.request.query_params.get('max_transfer_duration', None)
        if max_transfer_duration and max_transfer_duration.isdigit():
            queryset = queryset.filter(
                Q(has_transfer=False) |  # Прямые рейсы всегда включаем
                Q(has_transfer=True, transfer_duration__lte=int(max_transfer_duration))
            )
        
        # Сортировка
        sort_by = self.request.query_params.get('sort', 'recommendation')
        if sort_by == 'price_asc':
            queryset = queryset.order_by('economy_price')
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-economy_price')
        elif sort_by == 'duration':
            queryset = queryset.order_by('duration')
        elif sort_by == 'early_departure':
            # Сортировка по раннему времени вылета (ближе к 00:00)
            queryset = queryset.order_by('departure_time')
        elif sort_by == 'early_arrival':
            # Сортировка по раннему времени прибытия (ближе к 00:00)
            queryset = queryset.order_by('arrival_time')
        else:  # По умолчанию сортировка по рекомендации
            queryset = queryset.order_by('-recommendation_score', 'economy_price')
        
        # Фильтрация по авиакомпаниям
        airlines = self.request.query_params.get('airlines', None)
        if airlines:
            airline_codes = airlines.split(',')
            queryset = queryset.filter(airlines__code__in=airline_codes).distinct()
            
        # Дополнительные фильтры для удобства
        no_reregistration = self.request.query_params.get('no_reregistration', None)
        if no_reregistration == 'true':
            queryset = queryset.filter(Q(has_transfer=False) | Q(requires_reregistration=False))
            
        no_night_transfers = self.request.query_params.get('no_night_transfers', None)
        if no_night_transfers == 'true':
            queryset = queryset.filter(Q(has_transfer=False) | Q(night_transfer=False))
            
        refundable = self.request.query_params.get('refundable', None)
        if refundable == 'true':
            queryset = queryset.filter(refundable=True)
            
        # ============ ПЕРЕРАБОТАННАЯ ЛОГИКА ФИЛЬТРАЦИИ ПЕРЕСАДОК ============
        # Переместил фильтрацию по пересадкам в конец, чтобы она имела наивысший приоритет
        direct = self.request.query_params.get('direct', None)
        one_transfer = self.request.query_params.get('one_transfer', None)
        two_transfers = self.request.query_params.get('two_transfers', None)
        
        # Новый параметр max_transfers, который приходит с фронтенда
        max_transfers = self.request.query_params.get('max_transfers', None)
        
        # Получаем все билеты, которые попали в выборку после применения других фильтров
        print(f"До фильтрации по пересадкам: {queryset.count()} билетов")
        print(f"Параметры фильтрации: direct={direct}, one_transfer={one_transfer}, two_transfers={two_transfers}, max_transfers={max_transfers}")
        
        # Создаем словарь для проверки количества билетов по типам пересадок
        transfer_counts = {
            0: queryset.filter(transfer_count=0).count(),
            1: queryset.filter(transfer_count=1).count(),
            2: queryset.filter(transfer_count=2).count()
        }
        print(f"Распределение билетов по пересадкам: {transfer_counts}")
        
        # Сначала обрабатываем параметр max_transfers, который приходит с фронтенда
        if max_transfers is not None:
            try:
                max_transfers_int = int(max_transfers)
                print(f"Применяем фильтр max_transfers={max_transfers_int}")
                
                if max_transfers_int == 1:
                    # Если max_transfers=1, показываем билеты с 1 пересадкой
                    queryset = queryset.filter(transfer_count=1)
                    print(f"Фильтруем по точному количеству пересадок: 1")
                elif max_transfers_int == 2:
                    # Если max_transfers=2, показываем билеты с 2 пересадками
                    queryset = queryset.filter(transfer_count=2)
                    print(f"Фильтруем по точному количеству пересадок: 2")
            except ValueError:
                print(f"Неверное значение max_transfers: {max_transfers}")
        else:
            # Если max_transfers не указан, используем устаревшую логику с checkboxes
            has_transfer_filter = any(x == 'true' for x in [direct, one_transfer, two_transfers])
            
            if has_transfer_filter:
                # Создаем пустой Q-объект для OR-условий
                transfer_q = Q()
                
                # Добавляем условия в соответствии с выбранными типами
                if direct == 'true':
                    transfer_q |= Q(transfer_count=0)
                    print("Добавляем фильтр: прямые рейсы (0 пересадок)")
                    
                if one_transfer == 'true':
                    transfer_q |= Q(transfer_count=1)
                    print("Добавляем фильтр: рейсы с 1 пересадкой")
                    
                if two_transfers == 'true':
                    transfer_q |= Q(transfer_count=2)
                    print("Добавляем фильтр: рейсы с 2 пересадками")
                
                # Применяем фильтр
                queryset = queryset.filter(transfer_q)
                print(f"После фильтрации по пересадкам: {queryset.count()} билетов")
        
        # Проверяем, сколько билетов осталось каждого типа
        filter_counts = {
            0: queryset.filter(transfer_count=0).count(),
            1: queryset.filter(transfer_count=1).count(),
            2: queryset.filter(transfer_count=2).count()
        }
        print(f"Итоговое распределение: {filter_counts}")
        
        # Возвращаем отфильтрованный набор
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
        
        # Фильтрация по максимальной продолжительности
        max_duration = self.request.query_params.get('max_duration', None)
        if max_duration and max_duration.isdigit():
            max_duration_int = int(max_duration)
            # Создаем фильтр с улучшенной обработкой строки длительности
            filtered_queryset = []
            
            print(f"Применяем фильтр по максимальной длительности: {max_duration} часов")
            for ticket in queryset:
                try:
                    # Получаем строку длительности
                    duration_str = ticket.duration
                    # Проверяем на пустую строку или None
                    if not duration_str:
                        filtered_queryset.append(ticket.id)
                        continue
                        
                    print(f"Анализируем длительность: {duration_str} для билета {ticket.id}")
                    
                    # Преобразуем в общее количество часов
                    total_hours = 0
                    
                    # Обработка форматов типа "5ч 30м", "5 ч", "5ч" и т.д.
                    if 'ч' in duration_str:
                        hours_part = duration_str.split('ч')[0].strip()
                        try:
                            hours = int(hours_part)
                            total_hours += hours
                            
                            # Обработка минут
                            if 'м' in duration_str and 'ч' in duration_str:
                                minutes_part = duration_str.split('ч')[1].split('м')[0].strip()
                                if minutes_part and minutes_part.isdigit():
                                    minutes = int(minutes_part)
                                    total_hours += minutes / 60
                        except (ValueError, IndexError) as e:
                            print(f"Ошибка при обработке часов: {e}")
                    
                    # Обработка форматов типа "180" (минуты)
                    elif duration_str.isdigit():
                        minutes = int(duration_str)
                        total_hours = minutes / 60
                    
                    # Обработка дней в формате "1д 5ч"
                    elif 'д' in duration_str:
                        days_part = duration_str.split('д')[0].strip()
                        try:
                            days = int(days_part)
                            total_hours += days * 24
                            
                            # Проверяем, есть ли еще и часы
                            if 'ч' in duration_str:
                                hours_part = duration_str.split('д')[1].split('ч')[0].strip()
                                if hours_part and hours_part.isdigit():
                                    hours = int(hours_part)
                                    total_hours += hours
                        except (ValueError, IndexError) as e:
                            print(f"Ошибка при обработке дней: {e}")
                    
                    print(f"Общая длительность в часах: {total_hours}")
                    
                    # Добавляем билет, если он удовлетворяет условию
                    if total_hours <= max_duration_int:
                        filtered_queryset.append(ticket.id)
                    
                except Exception as e:
                    # В случае любых других ошибок добавляем билет
                    print(f"Ошибка при обработке длительности '{duration_str}': {e}")
                    filtered_queryset.append(ticket.id)
            
            # Применяем фильтр
            queryset = queryset.filter(id__in=filtered_queryset)
            print(f"Отфильтровано по максимальной длительности: {max_duration} часов, осталось билетов: {len(filtered_queryset)}")
        
        # Фильтрация по максимальной цене
        max_coupe_price = self.request.query_params.get('max_coupe_price', None)
        if max_coupe_price and max_coupe_price.isdigit():
            # Создаем логику фильтрации, которая учитывает все типы вагонов
            # Если пользователь ищет билеты, стоимость которых не превышает указанную максимальную
            queryset = queryset.filter(
                Q(coupe_price__lte=int(max_coupe_price)) | 
                Q(platzkart_price__lte=int(max_coupe_price)) | 
                Q(sitting_price__lte=int(max_coupe_price)) | 
                Q(sv_price__lte=int(max_coupe_price))
            ).distinct()
            print(f"Отфильтровано по максимальной цене: {max_coupe_price} руб.")
        
        # Сортировка
        sort_by = self.request.query_params.get('sort', 'recommendation')
        if sort_by == 'price_asc':
            # Сортировка по минимальной цене доступного класса
            queryset = queryset.order_by('coupe_price')  # Примерная сортировка, логика берется из сериализатора
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-coupe_price')
        elif sort_by == 'duration':
            queryset = queryset.order_by('duration')
        elif sort_by == 'early_departure':
            # Сортировка по раннему времени отправления (ближе к 00:00)
            queryset = queryset.order_by('departure_time')
        elif sort_by == 'early_arrival':
            # Сортировка по раннему времени прибытия (ближе к 00:00)
            queryset = queryset.order_by('arrival_time')
        else:  # По умолчанию сортировка по рекомендации
            queryset = queryset.order_by('-recommendation_score', 'coupe_price')
            
        # Фильтрация по типам мест
        type_filters = Q()
        has_type_filter = False
        
        platzkart = self.request.query_params.get('platzkart', None)
        if platzkart == 'true':
            type_filters |= Q(platzkart_available=True)
            has_type_filter = True
            
        coupe = self.request.query_params.get('coupe', None)
        if coupe == 'true':
            type_filters |= Q(coupe_available=True)
            has_type_filter = True
            
        sv = self.request.query_params.get('sv', None)
        if sv == 'true':
            type_filters |= Q(sv_available=True)
            has_type_filter = True
            
        sitting = self.request.query_params.get('sitting', None)
        if sitting == 'true':
            type_filters |= Q(sitting_available=True)
            has_type_filter = True
        
        # Применяем фильтры типов мест только если хотя бы один тип выбран
        if has_type_filter:
            queryset = queryset.filter(type_filters)
            
        # Фильтрация по компаниям
        companies = self.request.query_params.get('companies', None)
        if companies:
            try:
                # Пытаемся распарсить как JSON массив
                import json
                company_codes = json.loads(companies)
                if isinstance(company_codes, list):
                    queryset = queryset.filter(companies__code__in=company_codes).distinct()
                    print(f"Применен фильтр по ж/д компаниям: {company_codes}")
            except json.JSONDecodeError:
                # Если не удалось распарсить как JSON, обрабатываем как строку с разделителями
                company_codes = companies.split(',')
                queryset = queryset.filter(companies__code__in=company_codes).distinct()
                print(f"Применен фильтр по ж/д компаниям (строковый формат): {company_codes}")
        
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
        food_included = self.request.query_params.get('food', None) or self.request.query_params.get('food_included', None)
        if food_included == 'true':
            queryset = queryset.filter(food_included=True)
        
        pets_allowed = self.request.query_params.get('pets', None) or self.request.query_params.get('pets_allowed', None)
        if pets_allowed == 'true':
            queryset = queryset.filter(pets_allowed=True)
        
        near_sea = self.request.query_params.get('near_sea', None)
        if near_sea == 'true':
            queryset = queryset.filter(near_sea=True)
        
        # Фильтрация по рейтингу
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating and min_rating.replace('.', '', 1).isdigit():
            queryset = queryset.filter(rating__gte=float(min_rating))
        
        # Получаем количество ночей
        nights_param = self.request.query_params.get('nights', '1')
        try:
            nights = int(nights_param)
            if nights <= 0:
                nights = 1
        except (ValueError, TypeError):
            nights = 1
            
        print(f"Количество ночей для расчета общей стоимости: {nights}")
            
        # Создаем аннотацию для общей стоимости (price_per_night * nights)
        from django.db.models import F, ExpressionWrapper, IntegerField
        queryset = queryset.annotate(
            total_price=ExpressionWrapper(
                F('price_per_night') * nights,
                output_field=IntegerField()
            )
        )
        
        # Фильтрация по цене
        price_min = self.request.query_params.get('price_min', None)
        price_max = self.request.query_params.get('price_max', None)
        max_price_per_night = self.request.query_params.get('max_price_per_night', None)
        
        if price_min and price_min.isdigit():
            # Фильтруем по общей цене за все ночи
            min_price = int(price_min)
            queryset = queryset.filter(total_price__gte=min_price)
            print(f"Применен фильтр по минимальной общей цене: {min_price} руб.")
            
        # Используем либо price_max, либо max_price_per_night (приоритет у max_price_per_night)
        if max_price_per_night and max_price_per_night.isdigit():
            # Фильтруем по общей цене за все ночи
            max_price = int(max_price_per_night)
            queryset = queryset.filter(total_price__lte=max_price)
            print(f"Применен фильтр по максимальной общей цене: {max_price} руб.")
        elif price_max and price_max.isdigit():
            # Фильтруем по общей цене за все ночи
            max_price = int(price_max)
            queryset = queryset.filter(total_price__lte=max_price)
            print(f"Применен фильтр по максимальной общей цене (старый параметр): {max_price} руб.")
        
        # Сортировка
        sort_by = self.request.query_params.get('sort', 'recommendation')
        print(f"Применяем сортировку туров: {sort_by}")  # Добавляем отладочный вывод
        
        if sort_by == 'price_asc':
            queryset = queryset.order_by('total_price')
            print(f"Сортировка туров по возрастанию общей цены (за {nights} ночей)")
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-total_price')
            print(f"Сортировка туров по убыванию общей цены (за {nights} ночей)")
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')
            print("Сортировка туров по рейтингу")
        elif sort_by == 'center_distance':
            # Поддержка сортировки по расстоянию до центра
            # Если нет поля center_distance, используем рекомендации
            queryset = queryset.order_by('-recommendation_score', 'total_price')
            print("Запрошена сортировка по расстоянию до центра, используем сортировку по умолчанию")
        else:  # По умолчанию сортировка по рекомендации
            queryset = queryset.order_by('-recommendation_score', 'total_price')
            print("Сортировка туров по рекомендации (по умолчанию)")
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Добавляем новые классы для получения списка компаний
class AirlineListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API эндпоинт для получения списка авиакомпаний
    """
    queryset = Airline.objects.all()
    serializer_class = AirlineSerializer
    permission_classes = [AllowAny]

class RailwayCompanyListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API эндпоинт для получения списка ж/д компаний
    """
    queryset = RailwayCompany.objects.all()
    serializer_class = RailwayCompanySerializer
    permission_classes = [AllowAny]
