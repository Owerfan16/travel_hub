from django.shortcuts import render
from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from .models import Ticket, TrainTicket, PopularTour, TravelIdea
from .serializers import (
    TicketSerializer, UserSerializer, RegisterSerializer, 
    LoginSerializer, TrainTicketSerializer, PopularTourSerializer, TravelIdeaSerializer
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
