from django.contrib import admin
from .models import Article

class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'pub_date', 'user')  # colonnes visibles
    search_fields = ('title', 'content')  # champ de recherche
    list_filter = ('pub_date',)  # filtres à droite


admin.site.register(Article, ArticleAdmin)
