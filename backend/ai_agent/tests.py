from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, TestCase

from sales.models import AddAccountData

from .nlp.company_extractor import CompanyExtractor
from .nlp.field_mapper import FieldMapper
from .services import OfflineAccountAgentService
from .services.offline_voice_crm import OfflineVoiceCRMService
from .utils.text_normalizer import normalize_agent_text


class OfflineAccountAgentServiceTests(SimpleTestCase):
    def setUp(self):
        self.service = OfflineAccountAgentService()

    def test_extracts_company_name_from_create_account_phrase(self):
        company_name = self.service.extract_account_name(
            "Create account for ABC Technologies phone number 9876543210"
        )

        self.assertEqual(company_name, "ABC Technologies")

    def test_extracts_company_name_from_company_named_phrase(self):
        company_name = self.service.extract_account_name(
            "The company named Acme Pvt Ltd email sales@acme.com"
        )

        self.assertEqual(company_name, "Acme Pvt Ltd")

    def test_extracts_company_name_from_quoted_phrase(self):
        company_name = self.service.extract_account_name(
            'Please add a new client called "Blue Ocean Systems" with mobile 9988776655'
        )

        self.assertEqual(company_name, "Blue Ocean Systems")

    def test_normalizer_merges_letters_and_numbers(self):
        normalized = normalize_agent_text("Create account for A B C Technologies mobile nine eight seven six")

        self.assertIn("ABC", normalized)
        self.assertIn("9876", normalized)

    def test_field_mapper_extracts_core_fields(self):
        mapper = FieldMapper()

        payload = mapper.extract_fields(
            "Create account for Acme Technologies mobile 9876543210 email sales@acme.com address Industrial Area Pune"
        )

        self.assertEqual(payload["account_name"], "Acme Technologies")
        self.assertEqual(payload["mobile_number"], "9876543210")
        self.assertEqual(payload["email_id"], "sales@acme.com")

    def test_company_extractor_fallback_works_without_custom_model(self):
        extractor = CompanyExtractor(prefer_custom_model=False)

        company = extractor.extract_company_name("Please register company named Nova Systems with phone 9988776655")

        self.assertEqual(company, "Nova Systems")


class OfflineVoiceCRMServiceTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(
            email="voice-agent@example.com",
            username="voice-agent",
            password="testpass123",
            employeeid="EMP001",
            role="sales",
        )
        self.service = OfflineVoiceCRMService()

    def test_resolves_noisy_company_name_to_existing_crm_account(self):
        AddAccountData.objects.create(
            user=self.user,
            account_name="Acme Technologies Pvt Ltd",
            mobile_number="9876543210",
            email_id="sales@acmetech.com",
            address="Pune",
        )

        resolved = self.service._resolve_company_name_with_crm(
            self.user,
            "create account for acmi technologies private limited email sales@acmetech.com",
            {
                "account_name": "Acmi Technologies Private Limited",
                "email_id": "sales@acmetech.com",
                "website": "",
            },
        )

        self.assertEqual(resolved["account_name"], "Acme Technologies Pvt Ltd")

    def test_domain_hint_can_resolve_company_name_when_transcript_is_short(self):
        AddAccountData.objects.create(
            user=self.user,
            account_name="Blue Ocean Systems",
            email_id="info@blueoceansystems.com",
            mobile_number="9988776655",
            address="Mumbai",
        )

        resolved = self.service._resolve_company_name_with_crm(
            self.user,
            "create account for blue ocean email info@blueoceansystems.com",
            {
                "account_name": "Blue Ocean",
                "email_id": "info@blueoceansystems.com",
                "website": "",
            },
        )

        self.assertEqual(resolved["account_name"], "Blue Ocean Systems")
