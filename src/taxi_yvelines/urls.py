from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("blog/", include("blog.urls")),
    path("core/", include("core.urls")),
    path("", include("booking.urls")),
    path('admin/', admin.site.urls),
]
