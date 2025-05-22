from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Article:
    title = models.CharField(max_length=200)
    content = models.TextField()
    pub_date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
