from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User
from .models import (
    UserProfile, Badge, Discipline, Query,
    Thread, Reply, Tag, Vote, Notification
)
from .serializers import (
    UserProfileSerializer, BadgeSerializer, DisciplineSerializer, QuerySerializer,
    ThreadSerializer, ReplySerializer, TagSerializer, VoteSerializer, NotificationSerializer,
    UserSerializer
)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer


class DisciplineViewSet(viewsets.ModelViewSet):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer


class QueryViewSet(viewsets.ModelViewSet):
    queryset = Query.objects.all()
    serializer_class = QuerySerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]


class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user_id = self.request.data.get("user_id")
        if not user_id:
            raise serializers.ValidationError({"user": "User ID is required."})

        thread = serializer.save(user_id=user_id)

    # Notify all users except the creator
        other_users = User.objects.exclude(id=user_id)
        for user in other_users:
            Notification.objects.create(
                user=user,
                message=f"New question posted: {thread.title}"
            )


class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [permissions.AllowAny]
    def perform_create(self, serializer):
        # Let the serializer use the provided user_id from the request payload
        serializer.save()


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.AllowAny]


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]


class GlobalSearchView(APIView):
    """
    A view that performs a global search across multiple models.
    The query parameter 'q' is used as the search term.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        q = request.query_params.get('q', '')
        if not q:
            return Response({'error': 'Please provide a search query using ?q='}, status=400)

        queries = Query.objects.filter(
            Q(title__icontains=q) | Q(description__icontains=q)
        )
        threads = Thread.objects.filter(
            Q(title__icontains=q) | Q(message__icontains=q)
        )
        disciplines = Discipline.objects.filter(
            Q(name__icontains=q) | Q(description__icontains=q)
        )
        replies = Reply.objects.filter(
            Q(message__icontains=q)
        )

        return Response({
            'queries': QuerySerializer(queries, many=True).data,
            'threads': ThreadSerializer(threads, many=True).data,
            'disciplines': DisciplineSerializer(disciplines, many=True).data,
            'replies': ReplySerializer(replies, many=True).data,
        })


class UserViewSet(viewsets.ModelViewSet):
    """
    Provides API access for Django's User model.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
