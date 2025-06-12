from django.shortcuts import render
from django.views.generic import DetailView

from .models import Article

def display_blog(request):
    articles = Article.objects.all()

    return render(request, "blog/blog.html", {"articles": articles})

class ArticleDetailView(DetailView):
    model = Article

    def  get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        current_article = self.object
        context["suggested_articles"] = Article.objects.exclude(pk=current_article.pk).order_by('-pub_date')[:2]
        return context
