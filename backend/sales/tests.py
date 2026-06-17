from django.contrib.auth import get_user_model
from datetime import date
from rest_framework import status
from rest_framework.test import APITestCase

from sales.models import Budget, BudgetCategory, BudgetPeriodEntry, Opportunity, Opportunity_Stage


class TestAccountFormSettingsAPI(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='settings-admin',
            email='settings@example.com',
            password='StrongPass123!',
            employeeid='EMP001',
            role='admin',
        )

    def test_get_returns_empty_account_when_nothing_saved(self):
        response = self.client.get('/form-settings/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'account': {}})

    def test_authenticated_put_persists_account_settings(self):
        payload = {
            'account': {
                'opportunities': ['Printer', 'RFID'],
                'productCategories': [
                    {
                        'category': 'RFID',
                        'subdivisions': [{'category': 'Readers'}],
                    }
                ],
            }
        }

        self.client.force_authenticate(user=self.user)
        save_response = self.client.put('/form-settings/', payload, format='json')
        fetch_response = self.client.get('/form-settings/')

        self.assertEqual(save_response.status_code, status.HTTP_200_OK)
        self.assertEqual(save_response.data['message'], 'Success')
        self.assertEqual(fetch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(fetch_response.data['account'], payload['account'])
class TestMonthlyRankCarryForward(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.admin = User.objects.create_user(
            username='rank-admin',
            email='rank-admin@example.com',
            password='StrongPass123!',
            employeeid='EMP900',
            role='admin',
        )
        self.user = User.objects.create_user(
            username='rank-user',
            email='rank-user@example.com',
            password='StrongPass123!',
            employeeid='EMP901',
            role='user',
        )

        self.budget = Budget.objects.create(
            user=self.admin,
            title='FY 2026 Budget',
            revenue_target=100000,
            target_deal_count=12,
            start_date=date(2026, 4, 1),
            end_date=date(2027, 3, 31),
        )
        self.category = BudgetCategory.objects.create(
            budget=self.budget,
            name='Core Sales',
            order=0,
        )
        BudgetPeriodEntry.objects.create(
            budget=self.budget,
            category=self.category,
            subcategory=None,
            user=self.user,
            month='June',
            allocated=5000,
        )
        BudgetPeriodEntry.objects.create(
            budget=self.budget,
            category=self.category,
            subcategory=None,
            user=self.user,
            month='July',
            allocated=6000,
        )

        june_b = Opportunity.objects.create(
            user=self.user,
            account_name='Carry Forward Account',
            opportunity='Printer',
            hardware_amount=2500,
        )
        Opportunity_Stage.objects.create(
            add_opportunity=june_b,
            ranks='Rank B',
            last_update=date(2026, 6, 15),
        )

        june_a = Opportunity.objects.create(
            user=self.user,
            account_name='Won In June',
            opportunity='Scanner',
            hardware_amount=3200,
        )
        Opportunity_Stage.objects.create(
            add_opportunity=june_a,
            ranks='Rank A',
            last_update=date(2026, 6, 20),
        )

    def test_user_current_month_carries_open_pipeline_forward(self):
        self.client.force_authenticate(user=self.user)

        june_response = self.client.get('/budgets/current-month/?year=2026&month=June')
        july_response = self.client.get('/budgets/current-month/?year=2026&month=July')

        self.assertEqual(june_response.status_code, status.HTTP_200_OK)
        self.assertEqual(july_response.status_code, status.HTTP_200_OK)

        self.assertEqual(june_response.data['month_rank_b_count'], 1)
        self.assertEqual(june_response.data['month_achieved'], 3200.0)
        self.assertEqual(july_response.data['month_rank_b_count'], 1)
        self.assertEqual(july_response.data['month_achieved'], 0.0)

    def test_admin_summary_uses_month_end_snapshot_for_pipeline(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get('/admin-budget-summary/?year=2026&month=July')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['month_rank_b_count'], 1)
        self.assertEqual(response.data['month_rank_c_count'], 0)
        self.assertEqual(response.data['month_rank_d_count'], 0)
        self.assertEqual(response.data['month_rank_e_count'], 0)

    def test_header_stats_monthly_graph_carries_pipeline_only(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get('/header-stats/?year=2026&month=July')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['funnel']['rank_a'], 0)
        self.assertEqual(response.data['funnel']['rank_b'], 1)
        self.assertEqual(response.data['funnel']['rank_c'], 0)
        self.assertEqual(response.data['funnel']['rank_d'], 0)
        self.assertEqual(response.data['funnel']['rank_e'], 0)
