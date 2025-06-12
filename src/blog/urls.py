from django.urls import path
from . import views
from .views import ArticleDetailView


urlpatterns = [
    path("", views.display_blog, name="blog"),
    path('<int:pk>/', ArticleDetailView.as_view(), name="article_detail")
]
