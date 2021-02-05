from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'), # shows home page
    path('predict', views.predict),    # accepts input (in JSON), makes and returns predictions (JSON)
    path('symptoms', views.symptoms),  # returns JSON data for the stacked bar chart on Home page
]
