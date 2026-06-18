"""
URL configuration for spplus project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from sales import views
from django.urls import path,include

from rest_framework.routers import DefaultRouter
from sales.views import  AccountViewSet, AddAccountDataListCreateView, AddAccountDataDetailView,OpportunityViewSet,OpportunityDataListCreateView,OpportunityDataDetailView,AddTargetDataListCreateView,AddTargetDataDetailView,LeadViewSet,TaskViewSet,AddTaskDataListCreateView,UserListView,ManagerLoginAPIView
from sales.views import AutofillAccountDataViewSet, EditTaskStatusOutcomeView, OpportunityCategoryTotal, TaskAcceptStatusUpdateView, TaskAssignedByMeListView, TodaysTaskListView, admin_monthwise_rank_a_summary,  list_user_submitted_tasks, monthwise_rank_a_summary, move_lead_to_destination, user_stage_summary_view, user_vertical_summary_view
from sales.views import  RankASumView
from sales.views import stage_summary_view
from sales.views import vertical_summary_view
from sales.views import MonthlyTotalAmountView
from sales.views import UserOpportunityCategoryTotal
from sales.views import UserRankASumView
from sales.views import  AddAccountDataListCreateView, AddAccountDataDetailView, FetchMatchingOpportunitiesAPIView,LeadViewSet,LeadDetailView,LeadListCreateView,LeadsViewSet

from django.urls import path,include
from sales import views
from rest_framework.routers import DefaultRouter
from sales.views import TaskViewSet

from rest_framework.routers import DefaultRouter
from sales import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.cache import never_cache
from django.urls import path, re_path,include
from django.views.generic import TemplateView
from django.contrib import admin
from sales.views import AddTargetDataViewSet
# from sales.views import (
#     BudgetViewSet,
#     BudgetAllocationViewSet,
#     SpendEntryViewSet,
#     BudgetSummaryView,
#     CategorySpendView,
#     BudgetAlertView,
#     BudgetComparisonView,
# )
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name = 'sales'


router = DefaultRouter()
# router.register(r'show-all-account-data', AccountViewSet, basename='accountdata')
# router.register(r'show-all-opportunity-data', OpportunityViewSet, basename='oportunitydata')
router.register(r'autofill-accounts-data', AutofillAccountDataViewSet, basename='autofillaccountsdata')
router.register(r'show-all-target-data', AddTargetDataViewSet, basename='targetdata')
router.register(r'show-all-lead-data', LeadViewSet, basename='leaddata')
router.register(r'show-all-lead', LeadsViewSet, basename='leadsdata')
# router.register(r'show-all-task-data', TaskViewSet, basename='taskdata')
router.register(r'tasks', TaskViewSet, basename='task')

# router.register(r'budgets',     BudgetViewSet,           basename='budget')
# router.register(r'allocations', BudgetAllocationViewSet, basename='allocation')
# router.register(r'spend',       SpendEntryViewSet,       basename='spend')



urlpatterns = [
    path('api/ai-agent/', include('ai_agent.urls')),
    path('ai-agent/', include('ai_agent.urls')),

    path('register/',views.RegisterView.as_view(),name="register"),
    path('api/register/', views.RegisterView.as_view(), name="api-register"),
    path('api/users/', UserListView.as_view(), name='api-user-list'),
    path('api/users/<int:pk>/', views.UserDetailView.as_view(), name='api-user-detail'),
    path('login/',views.LoginAPIView.as_view(),name="login"),
    path('api/login/', views.LoginAPIView.as_view(), name="api-login"),
    path('logout/', views.LogoutAPIView.as_view(), name="logout"),
    path('api/logout/', views.LogoutAPIView.as_view(), name="api-logout"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('manager/login/', ManagerLoginAPIView.as_view(), name='manager-login'),
    path('api/manager/login/', ManagerLoginAPIView.as_view(), name='api-manager-login'),
    path('api/header-stats/', views.HeaderStatsView.as_view(), name='api-header-stats'),
    path('form-settings/', views.AccountFormSettingsAPIView.as_view(), name='form-settings'),
    path('account-form-settings/', views.AccountFormSettingsAPIView.as_view(), name='account-form-settings'),
    path('settings/form-fields/', views.AccountFormSettingsAPIView.as_view(), name='settings-form-fields'),
    # path('demo/', views.print_frontend_data, name='print_frontend_data'),

    path('show-all-account-data/', AccountViewSet.as_view({'get': 'list'}), name='accountdata-list'),
    path('show-account-data/<int:pk>/', AccountViewSet.as_view({'get': 'retrieve'}), name='accountdata-detail'),
    path('update-account/<int:pk>/', AccountViewSet.as_view({'put': 'update'}), name='accountdata-update'),
    path('delete-account/<int:pk>/', AccountViewSet.as_view({'delete': 'destroy'}), name='accountdata-delete'),

    path('account-data/', AddAccountDataListCreateView.as_view(), name='account-data-list-create'),
    path('account-data/<int:pk>/', AddAccountDataDetailView.as_view(), name='account-data-detail'),
    path('fetch-matching-opportunities/', FetchMatchingOpportunitiesAPIView.as_view(), name='fetch-matching-opportunities'),

    path('opportunities/', OpportunityViewSet.as_view({'get': 'list'}), name='opportunity-list'),
    path('opportunities/<int:pk>/', OpportunityViewSet.as_view({'get': 'retrieve'}), name='opportunity-detail'),
    path('opportunities/update/<int:pk>/', OpportunityViewSet.as_view({'put': 'update'}), name='opportunity-update'),
    path('opportunities/delete/<int:pk>/', OpportunityViewSet.as_view({'delete': 'destroy'}), name='opportunity-delete'),

    path('opportunity-data/', OpportunityDataListCreateView.as_view(), name='opportunity-data-list-create'),
    path('opportunity-data/<int:pk>/', OpportunityDataDetailView.as_view(), name='opportunity-data-detail'),


    path('target-data/', AddTargetDataListCreateView.as_view(), name='target-data-list-create'),
    path('target-data/<int:pk>/', AddTargetDataDetailView.as_view(), name='target-data-detail'),
    
    
    path('leads/', LeadViewSet.as_view({'get': 'list'}), name='lead-list'),
    path('leads/<int:pk>/', LeadViewSet.as_view({'get': 'retrieve'}), name='lead-detail'),
    path('leads/update/<int:pk>/', LeadViewSet.as_view({'put': 'update'}), name='lead-update'),
    path('leads/delete/<int:pk>/', LeadViewSet.as_view({'delete': 'destroy'}), name='lead-delete'),

    
    path('lead-data/', LeadListCreateView.as_view(), name='lead-data-list-create'),
    path('lead-data/<int:pk>/', LeadDetailView.as_view(), name='lead-data-detail'),
    path('move-lead/<int:lead_id>/',move_lead_to_destination, name='move-lead'),


    path('show-all-task-data/', TaskViewSet.as_view({'get': 'list'}), name='task-list'),
    path('tasks/delete/<int:pk>/', TaskViewSet.as_view({'delete': 'destroy'}), name='task-delete'),
    path('task-data/', AddTaskDataListCreateView.as_view(), name='task-data-list-create'),
    path('tasks/<int:pk>/', EditTaskStatusOutcomeView.as_view(), name='edit_task_status_outcome'),
    path('task/<int:pk>/accept/', TaskAcceptStatusUpdateView.as_view(), name='task-accept-status-update'),
    path('tasks/assigned-by-me/', TaskAssignedByMeListView.as_view(), name='task-assigned-by-me'),
    path('tasks/submitted-by-user/', list_user_submitted_tasks, name='user-submitted-tasks'),
    path('todaystasks/', TodaysTaskListView.as_view(), name='todays-task-list'),


    path('opportunity-category-total/', OpportunityCategoryTotal.as_view(), name='opportunity-category-total'),#admin
    path('user-opportunity-category-total/', UserOpportunityCategoryTotal.as_view(), name='user-opportunity-category-total'),#user


    path('rank-a-sum/', RankASumView.as_view(), name='rank_a_sum'),#admin
    path('user-rank-a-sum/', UserRankASumView.as_view(), name='user_rank_a_sum'),#user



    path('opportunities/stage-summary/', stage_summary_view, name='stage-summary'),#admin
    path('user/opportunities/stage-summary/', user_stage_summary_view, name='user-stage-summary'),#user


    path('opportunities/vertical-summary/', vertical_summary_view, name='vertical-summary'),#admin
    path('user/opportunities/vertical-summary/', user_vertical_summary_view, name='Uservertical-summary'),#user



    path('admin_monthly-total-amount/', admin_monthwise_rank_a_summary, name='admin-monthly-total-amount'),#admin
    path('monthly-total-amount/', monthwise_rank_a_summary, name='monthly-total-amount'),#user
    path('api/', include('sales.urls')),
    # # GET /api/budget/summary/?period=annual
    # path('summary/',         BudgetSummaryView.as_view(),    name='budget-summary'),
 
    # # GET /api/budget/category-spend/?period=annual
    # path('category-spend/',  CategorySpendView.as_view(),    name='budget-category-spend'),
 
    # # GET /api/budget/alerts/
    # path('alerts/',          BudgetAlertView.as_view(),      name='budget-alerts'),
 
    # # GET /api/budget/comparison/?period=annual
    # path('comparison/',      BudgetComparisonView.as_view(), name='budget-comparison'),

    path('', never_cache(TemplateView.as_view(template_name='index.html'))),

    path('', include(router.urls)),
    
    path('admin/', admin.site.urls),
    path('', include('sales.urls')),

    # Catch-all route for React routing
   re_path(r'^.*$', never_cache(TemplateView.as_view(template_name='index.html')), name='react-app'),
    
    
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

