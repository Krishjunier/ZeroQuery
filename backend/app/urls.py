from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet, BadgeViewSet, DisciplineViewSet,
    QueryViewSet, ThreadViewSet, ReplyViewSet,
    TagViewSet, VoteViewSet, NotificationViewSet,
    GlobalSearchView, UserViewSet
)

router = DefaultRouter()
router.register(r'userprofiles', UserProfileViewSet)
router.register(r'badges', BadgeViewSet)
router.register(r'disciplines', DisciplineViewSet)
router.register(r'queries', QueryViewSet)
router.register(r'threads', ThreadViewSet)
router.register(r'replies', ReplyViewSet)
router.register(r'tags', TagViewSet)
router.register(r'votes', VoteViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('search/', GlobalSearchView.as_view(), name='global-search'),
]
