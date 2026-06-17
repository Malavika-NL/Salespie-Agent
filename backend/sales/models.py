# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
import datetime
import random
from django.utils import timezone
# Create your models here.

# models.py
from django.contrib.auth.models import UserManager

class CustomUserManager(UserManager):
    def authenticate(self, email, password):
        try:
            user = self.get(email=email)
            if user.check_password(password):
                return user
            return None
        except self.model.DoesNotExist:
            return None

class User(AbstractUser):
    employeeid = models.CharField(max_length=10, default='')
    role = models.CharField(max_length=255, default='')
    email = models.EmailField(unique=True)
    # Use email for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'employeeid', 'role']

    # Ensure to override the manager with custom methods
    objects = CustomUserManager()

    def __str__(self):
        return self.email  # Display email instead of username

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }


class AddAccountData(models.Model):
    #account_holder = models.CharField(max_length=255, blank=True, null=True)
    account_name = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    vertical = models.CharField(max_length=100, blank=True, null=True)
    vertical_sub = models.CharField(max_length=100, blank=True, null=True)
    pic = models.CharField(max_length=255, blank=True, null=True)
    designation = models.CharField(max_length=100,default='', blank=True, null=True)
    business = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    mobile_number = models.CharField(max_length=120,default='', blank=True, null=True)
    email_id = models.CharField(max_length=120,default='', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    acct_created_date = models.DateField(default=datetime.date.today)
    last_update_date = models.DateField(default=datetime.date.today)
    user = models.ForeignKey(User, on_delete=models.CASCADE)



    def __str__(self):
        return self.account_name


class Contact(models.Model):  # Child Model
    CATEGORY_CHOICES = [
        ('plant_head', 'Plant Head'),
        ('purchase_head', 'Purchase Head'),
        ('it_head', 'IT Head'),
        ('quality_head', 'Quality Head'),
        ('production_head', 'Production Head'),
        ('plant_pic', 'Plant PIC'),
        ('purchase_pic', 'Purchase PIC'),
        ('it_pic', 'IT PIC'),
        ('quality_pic', 'Quality PIC'),
        ('production_pic', 'Production PIC'),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='plant_head', blank=True, null=True)
    name = models.CharField(max_length=100,default='', blank=True, null=True)
    designation = models.CharField(max_length=100,default='', blank=True, null=True)
    mobile_no = models.CharField(max_length=15,default='', blank=True, null=True)
    email_id = models.EmailField(default='', blank=True, null=True)
    add_account_data = models.ForeignKey(
        AddAccountData, 
        on_delete=models.CASCADE, 
        related_name='contacts'  # Reverse access to all contacts for an account
    )

    def __str__(self):
        return f"{self.name} - {self.category}"
class VisitingCard(models.Model):
    """
    Temporary store for OCR-scanned card data.
    Flow: Image → EasyOCR → Groq → VisitingCard (review) → AddAccountData + Contact
    """
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('processed', 'Processed'),
        ('saved',     'Saved to Contact'),
    ]

    # Parsed card fields
    person_name  = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    email        = models.EmailField(max_length=255, blank=True, null=True)
    phone        = models.CharField(max_length=50, blank=True, null=True)
    designation  = models.CharField(max_length=255, blank=True, null=True)
    address      = models.TextField(blank=True, null=True)

    # Extra contact fields
    region       = models.CharField(max_length=100, blank=True, null=True)
    location     = models.CharField(max_length=255, blank=True, null=True)
    vertical     = models.CharField(max_length=100, blank=True, null=True)

    # Image and raw OCR text
    image        = models.ImageField(upload_to='visiting_cards/', blank=True, null=True)
    raw_text     = models.TextField(blank=True, null=True)

    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Link back to the created account after saving
    account      = models.ForeignKey(
        'AddAccountData',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='visiting_cards'
    )

    created_by   = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Visiting Card"
        verbose_name_plural = "Visiting Cards"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.person_name or 'Unknown'} — {self.company_name or 'Unknown Company'}"



class FinanceInformation(models.Model):
    turn_over = models.IntegerField( blank=True, null=True)
    account_resumable = models.IntegerField( blank=True, null=True)
    credits = models.IntegerField( blank=True, null=True)
    add_account_data = models.ForeignKey(
        AddAccountData, 
        on_delete=models.CASCADE, 
        related_name='finance'
    )



class CompanyDetails(models.Model):
    company_type = models.CharField(max_length=100, blank=True, null=True)
    account_type = models.CharField(max_length=100, blank=True, null=True)
    company_scale = models.CharField(max_length=100, blank=True, null=True)
    add_account_data = models.ForeignKey(
        AddAccountData, 
        on_delete=models.CASCADE, 
        related_name='company'  # Reverse access to all contacts for an account
    )

    

class Opportunity(models.Model):
    SALES_TYPE_CHOICES = [
        ("Repeat", "Repeat"),
        ("Upselling", "Upselling"),
        ("Cross selling", "Cross selling"),
    ]
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    #account_holder = models.CharField(max_length=255, blank=True, null=True)
    account_name = models.CharField(max_length=255, blank=True, null=True)
    # Keep this free-text to support original/dynamic opportunity categories.
    opportunity = models.CharField(max_length=255, blank=True, null=True)
    make = models.CharField(max_length=255, blank=True, null=True)
    sub_make = models.CharField(max_length=255, blank=True, null=True)
    sub_make_brand = models.CharField(max_length=255, blank=True, null=True)
    pic = models.CharField(max_length=255, blank=True, null=True)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    designation = models.CharField(max_length=255,default='', blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    mobile_number = models.CharField(max_length=10,default='', blank=True, null=True)
    email_id = models.CharField(max_length=255,default='', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    opportunity_description = models.CharField(max_length=255, blank=True, null=True)
    qty = models.CharField(max_length=255, blank=True, null=True)
    values = models.IntegerField(default=0, blank=True, null=True)
    exp_closure_date = models.CharField(max_length=255, blank=True, null=True)
    exp_po_date = models.CharField(max_length=255, blank=True, null=True)
    acct_created_date = models.DateField(default=datetime.date.today)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    #stage = models.CharField(max_length=255)
    #lost_reason = models.CharField(max_length=255, blank=True, null=True)
    hardware_amount = models.IntegerField(default=0, blank=True, null=True)
    software_amount = models.IntegerField(default=0, blank=True, null=True)
    consumables_amount = models.IntegerField(default=0, blank=True, null=True)
    automation_amount = models.IntegerField(default=0, blank=True, null=True)
    implementation_amount = models.IntegerField(default=0, blank=True, null=True)
    solution_amount = models.IntegerField(default=0, blank=True, null=True)
    maintenance_amount = models.IntegerField(default=0, blank=True, null=True)
    others_amount = models.IntegerField(default=0, blank=True, null=True)
    total_amount = models.IntegerField(default=0, blank=True, null=True)
    status = models.CharField(max_length=255 , blank=True, null=True)
    vertical =  models.CharField(max_length=255 , blank=True, null=True)
    sales_type = models.CharField(max_length=50, choices=SALES_TYPE_CHOICES, blank=True, null=True)
    sales_type_value = models.IntegerField(default=0, blank=True, null=True)
    last_update =  models.DateField(default=datetime.date.today)
    def save(self, *args, **kwargs):
        self.total_amount = (
            self.hardware_amount + self.software_amount + self.consumables_amount +
            self.automation_amount + self.implementation_amount + self.solution_amount +
            self.others_amount
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.account_name
    


class Opportunity_Stage(models.Model):
    stages = models.CharField(max_length=255, blank=True, null=True)
    ranks = models.CharField(max_length=255, blank=True, null=True)
    lost_reason = models.CharField(max_length=255, blank=True, null=True)
    last_update =  models.DateField(default=datetime.date.today)
    add_opportunity = models.ForeignKey(
        Opportunity, 
        on_delete=models.CASCADE, 
        related_name='opportunity_stages'
    )


class Opportunity_Pic(models.Model):
    pic_department = models.CharField(max_length=255, blank=True, null=True)
    pic_name = models.CharField(max_length=255, blank=True, null=True)
    pic_designation = models.CharField(max_length=255, blank=True, null=True)
    pic_email = models.CharField(max_length=255, blank=True, null=True)
    pic_phnone = models.CharField(max_length=255, blank=True, null=True)
    pic_phntwo = models.CharField(max_length=255, blank=True, null=True)
    add_opportunity = models.ForeignKey(
        Opportunity, 
        on_delete=models.CASCADE, 
        related_name='opportunity_pic'
    )


class Opportunity_Events(models.Model):
    start_date = models.CharField(max_length=255, blank=True, null=True)
    end_date = models.CharField(max_length=255, blank=True, null=True)
    start_time = models.CharField(max_length=255, blank=True, null=True)
    end_time = models.CharField(max_length=255, blank=True, null=True)
    event = models.CharField(max_length=255, blank=True, null=True)
    remark = models.CharField(max_length=255, blank=True, null=True)
    add_opportunity = models.ForeignKey(
        Opportunity, 
        on_delete=models.CASCADE, 
        related_name='opportunity_event'
    )


class Opportunity_Tasks(models.Model):
    task = models.CharField(max_length=255, blank=True, null=True)
    assign_to = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.CharField(max_length=255, blank=True, null=True)
    end_date = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    add_opportunity = models.ForeignKey(
        Opportunity, 
        on_delete=models.CASCADE, 
        related_name='opportunity_task'
    )

class Opportunity_Followup(models.Model):
    followup       = models.CharField(max_length=255, blank=True, null=True)
    followup_topic = models.CharField(max_length=255, blank=True, null=True)
    start_date     = models.CharField(max_length=255, blank=True, null=True)
    end_date       = models.CharField(max_length=255, blank=True, null=True)
    remark         = models.CharField(max_length=255, blank=True, null=True)
    add_opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='opportunity_followup'
    )
 
    def __str__(self):
        return f"{self.followup} — {self.add_opportunity.account_name}"

class AddTargetData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_name = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    vertical = models.CharField(max_length=100, blank=True, null=True)
    vertical_sub = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    pic = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=100, default='', blank=True, null=True)
    activity = models.CharField(max_length=100, blank=True, null=True)
    activity_date =  models.CharField(max_length=255, blank=True, null=True)
    next_action = models.CharField(max_length=100, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    next_action_date =  models.CharField(max_length=255, blank=True, null=True)
    mobile_number = models.CharField(max_length=10, default='', blank=True, null=True)
    email_id = models.EmailField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, default='', blank=True, null=True)
    business = models.CharField(max_length=100, blank=True, null=True)
    acct_created_date = models.DateField(default=datetime.date.today)
    last_update_date = models.DateField(default=datetime.date.today)

    def __str__(self):
        return self.account_name
    


class TargetContact(models.Model):  # Child Model
    CATEGORY_CHOICES = [
        ('plant_head', 'Plant Head'),
        ('purchase_head', 'Purchase Head'),
        ('it_head', 'IT Head'),
        ('quality_head', 'Quality Head'),
        ('production_head', 'Production Head'),
        ('plant_pic', 'Plant PIC'),
        ('purchase_pic', 'Purchase PIC'),
        ('it_pic', 'IT PIC'),
        ('quality_pic', 'Quality PIC'),
        ('production_pic', 'Production PIC'),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='plant_head', blank=True, null=True)
    name = models.CharField(max_length=100,default='', blank=True, null=True)
    designation = models.CharField(max_length=100,default='', blank=True, null=True)
    mobile_no = models.CharField(max_length=15,default='', blank=True, null=True)
    email_id = models.EmailField(default='', blank=True, null=True)
    add_target_data = models.ForeignKey(
        AddTargetData, 
        on_delete=models.CASCADE, 
        related_name='targetcontacts'  # Reverse access to all contacts for an account
    )

    def __str__(self):
        return f"{self.name} - {self.category}"


class AddTaskData(models.Model):
    

    task = models.CharField(max_length=200)
    description = models.CharField(max_length=255)
    priority = models.CharField(max_length=10)
    start_date = models.DateField()  # Changed to DateField
    end_date = models.DateField()    
    assignedto = models.ForeignKey(User, on_delete=models.CASCADE)
    assigned_by = models.CharField(max_length=255,default='')
    status = models.CharField(max_length=50,default='Pending')
    outcome = models.CharField(max_length=255,blank=True, null=True)
    last_update_date  = models.DateField(default=datetime.date.today)
    is_accepted = models.CharField(max_length=255,default='No')

    def __str__(self):
        return self.task
    



class Lead(models.Model):
    
    STATUS_CHOICES = [
        ('new_lead','New Lead'),
        ('follow_up', 'Follow Up'),
        ('marketing_review', 'Marketing Review'),
        ('cold_call', 'Cold Call')
       
    ]





    assign_to = models.ForeignKey(User,on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="account_holder_leads", null=True, blank=True)
    account_name = models.CharField(max_length=255, blank=True, null=True)
    lead = models.CharField(max_length=255, blank=True, null=True)
    make = models.CharField(max_length=255, blank=True, null=True)
    sub_make = models.CharField(max_length=255, blank=True, null=True)
    sub_make_brand = models.CharField(max_length=255, blank=True, null=True)
    pic = models.CharField(max_length=255, blank=True, null=True)
    vertical =  models.CharField(max_length=255 , blank=True, null=True)
    business_type =  models.CharField(max_length=255 , blank=True, null=True)
    designation = models.CharField(max_length=255,default='', blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    mobile_number = models.CharField(max_length=10,default='', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    qty = models.CharField(max_length=255, blank=True, null=True)
    values = models.IntegerField(default=0, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new_lead', blank=True, null=True)
    email_id = models.EmailField(max_length=255, blank=True, null=True)
    hardware_amount = models.IntegerField(default=0, blank=True, null=True)
    software_amount = models.IntegerField(default=0, blank=True, null=True)
    consumables_amount = models.IntegerField(default=0, blank=True, null=True)
    automation_amount = models.IntegerField(default=0, blank=True, null=True)
    solution_amount = models.IntegerField(default=0, blank=True, null=True)
    maintenance_amount = models.IntegerField(default=0, blank=True, null=True)
    others_amount = models.IntegerField(default=0, blank=True, null=True)
    total_amount = models.IntegerField(default=0, blank=True, null=True)
    last_update = models.DateField(default=datetime.date.today)
    acct_created_date = models.DateField(default=datetime.date.today)
    def save(self, *args, **kwargs):
        
        self.total_amount = (
            self.hardware_amount + self.software_amount + self.consumables_amount +
            self.automation_amount + self.solution_amount + self.maintenance_amount +
            self.others_amount
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.account_name
    


class Lead_Stage(models.Model):
    stages = models.CharField(max_length=255, blank=True, null=True)
    ranks = models.CharField(max_length=255, blank=True, null=True)
    lost_reason = models.CharField(max_length=255, blank=True, null=True)
    add_lead = models.ForeignKey(
        Lead, 
        on_delete=models.CASCADE, 
        related_name='lead_stages'
    )


class Lead_Pic(models.Model):
    pic_department = models.CharField(max_length=255, blank=True, null=True)
    pic_name = models.CharField(max_length=255, blank=True, null=True)
    pic_designation = models.CharField(max_length=255, blank=True, null=True)
    pic_email = models.CharField(max_length=255, blank=True, null=True)
    pic_phnone = models.CharField(max_length=255, blank=True, null=True)
    pic_phntwo = models.CharField(max_length=255, blank=True, null=True)
    add_lead = models.ForeignKey(
        Lead, 
        on_delete=models.CASCADE, 
        related_name='lead_pic'
    )

# budget/models.py======================================================================================================
# from django.db import models
# from django.conf import settings
# from django.core.validators import MinValueValidator
# from django.utils import timezone


# class Budget(models.Model):
#     """
#     Top-level budget for a period (monthly / quarterly / annual).
#     """

#     PERIOD_CHOICES = [
#         ('monthly',   'Monthly'),
#         ('quarterly', 'Quarterly'),
#         ('annual',    'Annual'),
#     ]

#     QUARTER_CHOICES = [('Q1', 'Q1'), ('Q2', 'Q2'), ('Q3', 'Q3'), ('Q4', 'Q4')]

#     MONTH_CHOICES = [
#         ('January', 'January'), ('February', 'February'), ('March', 'March'),
#         ('April', 'April'),     ('May', 'May'),           ('June', 'June'),
#         ('July', 'July'),       ('August', 'August'),     ('September', 'September'),
#         ('October', 'October'), ('November', 'November'), ('December', 'December'),
#     ]

#     CURRENCY_CHOICES = [
#         ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP'), ('INR', 'INR'),
#         ('AED', 'AED'), ('SGD', 'SGD'), ('AUD', 'AUD'), ('CAD', 'CAD'),
#     ]

#     # ── Core fields ──────────────────────────────────────────────
#     name         = models.CharField(max_length=255)
#     total_amount = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
#     currency     = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
#     period       = models.CharField(max_length=10, choices=PERIOD_CHOICES)
#     fiscal_year  = models.PositiveIntegerField()
#     quarter      = models.CharField(max_length=2, choices=QUARTER_CHOICES, blank=True, null=True)
#     month        = models.CharField(max_length=12, choices=MONTH_CHOICES, blank=True, null=True)

#     # ── Target fields ─────────────────────────────────────────────
#     revenue_target      = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
#     target_deal_count   = models.PositiveIntegerField(null=True, blank=True)
#     max_budget_per_deal = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

#     # ── Meta ──────────────────────────────────────────────────────
#     notes      = models.TextField(blank=True)
#     created_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         related_name='budgets_created',
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = 'Budget'
#         verbose_name_plural = 'Budgets'

#     def __str__(self):
#         return f'{self.name} ({self.fiscal_year})'

#     # ── Computed helpers ─────────────────────────────────────────
#     @property
#     def spent_amount(self):
#         """Sum of all approved/actual spend entries linked to this budget."""
#         return self.spend_entries.aggregate(
#             total=models.Sum('amount')
#         )['total'] or 0

#     @property
#     def remaining_amount(self):
#         return float(self.total_amount) - float(self.spent_amount)

#     @property
#     def utilization_pct(self):
#         if not self.total_amount:
#             return 0
#         return round(float(self.spent_amount) / float(self.total_amount) * 100, 2)

#     @property
#     def status(self):
#         pct = self.utilization_pct
#         if pct > 100:  return 'over_budget'
#         if pct > 80:   return 'near_limit'
#         return 'on_track'


# class BudgetAllocation(models.Model):
#     """
#     Splits a Budget into named categories (e.g. Marketing, Travel).
#     """
#     budget           = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='allocations')
#     category_name    = models.CharField(max_length=100)
#     allocated_amount = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
#     notes            = models.TextField(blank=True)
#     created_at       = models.DateTimeField(auto_now_add=True)
#     updated_at       = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['category_name']
#         unique_together = [('budget', 'category_name')]

#     def __str__(self):
#         return f'{self.budget.name} → {self.category_name}'

#     @property
#     def spent_amount(self):
#         return self.spend_entries.aggregate(
#             total=models.Sum('amount')
#         )['total'] or 0

#     @property
#     def utilization_pct(self):
#         if not self.allocated_amount:
#             return 0
#         return round(float(self.spent_amount) / float(self.allocated_amount) * 100, 2)

#     @property
#     def status(self):
#         pct = self.utilization_pct
#         if pct > 100: return 'over_budget'
#         if pct > 80:  return 'near_limit'
#         return 'on_track'


# class SpendEntry(models.Model):
#     """
#     An actual spend / expense record against a budget (and optionally an allocation).
#     """
#     APPROVAL_CHOICES = [
#         ('pending',  'Pending'),
#         ('approved', 'Approved'),
#         ('rejected', 'Rejected'),
#     ]

#     budget     = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='spend_entries')
#     allocation = models.ForeignKey(
#         BudgetAllocation, on_delete=models.SET_NULL,
#         null=True, blank=True, related_name='spend_entries',
#     )
#     description   = models.CharField(max_length=255)
#     amount        = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
#     spend_date    = models.DateField(default=timezone.now)
#     approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default='approved')
#     reference_no  = models.CharField(max_length=100, blank=True)   # invoice / PO number
#     recorded_by   = models.ForeignKey(
#         settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
#         null=True, related_name='spend_entries_recorded',
#     )
#     created_at    = models.DateTimeField(auto_now_add=True)
#     updated_at    = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-spend_date', '-created_at']

#     def __str__(self):
#         return f'{self.description} — {self.amount} ({self.budget.name})'


# from django.db import models
# import datetime
 
# class Budget(models.Model):
#     PERIOD_CHOICES = [
#         ('annual',    'Annual'),
#         ('quarterly', 'Quarterly'),
#         ('monthly',   'Monthly'),
#     ]
#     CURRENCY_CHOICES = [
#         ('INR', '₹ INR'),
#         ('USD', '$ USD'),
#         ('EUR', '€ EUR'),
#         ('GBP', '£ GBP'),
#     ]
 
#     user             = models.ForeignKey('User', on_delete=models.CASCADE, related_name='budgets')
#     title            = models.CharField(max_length=255)
#     total_budget     = models.DecimalField(max_digits=15, decimal_places=2, default=0)
#     period           = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='annual')
#     currency         = models.CharField(max_length=5,  choices=CURRENCY_CHOICES, default='INR')
#     start_date       = models.DateField(default=datetime.date.today)
#     end_date         = models.DateField(blank=True, null=True)
#     revenue_target   = models.DecimalField(max_digits=15, decimal_places=2, default=0)
#     target_deal_count= models.IntegerField(default=0)
#     max_budget_per_deal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
#     notes            = models.TextField(blank=True, null=True)
#     created_at       = models.DateTimeField(auto_now_add=True)
#     updated_at       = models.DateTimeField(auto_now=True)
 
#     def __str__(self):
#         return f"{self.title} ({self.period})"
 
 
# class BudgetCategory(models.Model):
#     CATEGORY_CHOICES = [
#         ('marketing',   'Marketing'),
#         ('tools',       'Tools & Software'),
#         ('travel',      'Travel'),
#         ('events',      'Events'),
#         ('headcount',   'Headcount / Commissions'),
#         ('other',       'Other'),
#     ]
 
#     budget         = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='categories')
#     category        = models.CharField(max_length=100)  # ← Changed: Increased from 50, removed choices
#     category_label  = models.CharField(max_length=100, blank=True, null=True)  # ← NEW
#     icon            = models.CharField(max_length=10, default='📦')  # ← NEW
#     is_custom       = models.BooleanField(default=False)  # ← NEW
#     allocated      = models.DecimalField(max_digits=12, decimal_places=2, default=0)
#     spent          = models.DecimalField(max_digits=12, decimal_places=2, default=0)
#     alert_threshold= models.IntegerField(default=80)   # % at which to warn
 
#     def __str__(self):
#         return f"{self.budget.title} — {self.category}"
 
#     @property
#     def remaining(self):
#         return float(self.allocated) - float(self.spent)
 
#     @property
#     def utilization_pct(self):
#         if self.allocated == 0:
#             return 0
#         return round((float(self.spent) / float(self.allocated)) * 100, 1)
    
#     def get_display_name(self):
#         if self.category_label:
#             return self.category_label
#         return self.category.replace('_', ' ').title()
 
 
# class BudgetSnapshot(models.Model):
#     # \"\"\"Monthly/quarterly snapshots for period comparison.\"\"\"
#     budget          = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='snapshots')
#     period_label    = models.CharField(max_length=50)   # e.g. "Q1 2025"
#     total_spent     = models.DecimalField(max_digits=15, decimal_places=2, default=0)
#     revenue_generated = models.DecimalField(max_digits=15, decimal_places=2, default=0)
#     deals_closed    = models.IntegerField(default=0)
#     recorded_at     = models.DateField(default=datetime.date.today)
 
#     def __str__(self):
#         return f"{self.budget.title} — {self.period_label}"
    

from django.db import models
from django.contrib.auth import get_user_model
 
User = get_user_model()
 
FY_MONTH_CHOICES = [
    ('April', 'April'), ('May', 'May'), ('June', 'June'),
    ('July', 'July'), ('August', 'August'), ('September', 'September'),
    ('October', 'October'), ('November', 'November'), ('December', 'December'),
    ('January', 'January'), ('February', 'February'), ('March', 'March'),
]
 
PERIOD_CHOICES = [
    ('annual', 'Annual'),
    ('quarterly', 'Quarterly'),
    ('monthly', 'Monthly'),
]
 
QUARTER_CHOICES = [
    ('Q1', 'Q1 — Apr, May, Jun'),
    ('Q2', 'Q2 — Jul, Aug, Sep'),
    ('Q3', 'Q3 — Oct, Nov, Dec'),
    ('Q4', 'Q4 — Jan, Feb, Mar'),
]
 
CURRENCY_CHOICES = [('INR', 'INR'), ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP')]
 
 
class Budget(models.Model):
    user                = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    title               = models.CharField(max_length=255)
    period              = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='annual')
    quarter             = models.CharField(max_length=5, choices=QUARTER_CHOICES, blank=True, null=True)
    selected_month      = models.CharField(max_length=20, choices=FY_MONTH_CHOICES, blank=True, null=True)
    currency            = models.CharField(max_length=5, choices=CURRENCY_CHOICES, default='INR')
    # total_budget        = models.DecimalField(max_digits=20, decimal_places=2)
    start_date          = models.DateField(blank=True, null=True)
    end_date            = models.DateField(blank=True, null=True)
    revenue_target      = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    target_deal_count   = models.IntegerField(default=0)
    max_budget_per_deal = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    notes               = models.TextField(blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)
 
    class Meta:
        ordering = ['-created_at']
 
    def __str__(self):
        return self.title
    
    @property
    def current_month_target(self):
        import datetime
        current_month = datetime.datetime.now().strftime('%B')
        entries = self.period_entries.filter(month=current_month)
        return sum(float(e.allocated) for e in entries)

    @property
    def current_quarter_target(self):
        import datetime
        now = datetime.datetime.now()
        month_name = now.strftime('%B')
        
        q_map = {
            'Q1': ['April', 'May', 'June'],
            'Q2': ['July', 'August', 'September'],
            'Q3': ['October', 'November', 'December'],
            'Q4': ['January', 'February', 'March']
        }
        # Find which quarter the current month belongs to
        curr_q = next((q for q, months in q_map.items() if month_name in months), 'Q1')
        entries = self.period_entries.filter(month__in=q_map[curr_q])
        return sum(float(e.allocated) for e in entries)

    @property
    def deals_closed(self):
        try:
            from sales.models import Opportunity_Stage
            return Opportunity_Stage.objects.filter(
                add_opportunity__user=self.user,
                ranks='Rank A'
            ).values('add_opportunity').distinct().count()
        except Exception:
            return 0
    @property
    def computed_total_budget(self):
        """Sum of all period entry allocations — replaces the old total_budget field."""
        return sum(float(pe.allocated) for pe in self.period_entries.all())
        
 
    @property
    def total_allocated(self):
        return sum(c.total_allocated for c in self.categories.all())
 
    
 
 
class BudgetCategory(models.Model):
    
    budget          = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='categories')
    name            = models.CharField(max_length=100,default='Uncategorized')          # user-defined, e.g. "Digital Marketing"
    alert_threshold = models.IntegerField(default=80)           # alert at X%
    order           = models.IntegerField(default=0)
 
    class Meta:
        ordering = ['order', 'id']
        unique_together = ('budget', 'name')
 
    def __str__(self):
        return f"{self.budget.title} — {self.name}"
 
    @property
    def total_allocated(self):
        return sum(float(pe.allocated) for pe in self.period_entries.all())
 

class BudgetSubCategory(models.Model):
    """NEW: Subcategories belong to a BudgetCategory (e.g. Hardware → Scanner)."""
    category = models.ForeignKey(BudgetCategory, on_delete=models.CASCADE, related_name='subcategories')
    name     = models.CharField(max_length=100)
    order    = models.IntegerField(default=0)
 
    class Meta:
        ordering = ['order', 'id']
        unique_together = ('category', 'name')
 
    def __str__(self):
        return f"{self.category.name} / {self.name}"
 
class BudgetPeriodEntry(models.Model):
    """
    Stores the allocated + actual spend for a specific category in a specific month.
    One row per (budget, category, month).
    """
    budget    = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='period_entries')
    category  = models.ForeignKey(BudgetCategory, on_delete=models.CASCADE, related_name='period_entries')
    subcategory = models.ForeignKey(BudgetSubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='period_entries')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_budget_entries', null=True)
    month     = models.CharField(max_length=20, choices=FY_MONTH_CHOICES)
    allocated = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    
 
    class Meta:
        unique_together = ('budget', 'category','subcategory', 'month','user')
        ordering = ['month']
 
    def __str__(self):
        sub = f" / {self.subcategory.name}" if self.subcategory else ""
        return f"{self.budget.title} / {self.category.name}{sub} / {self.month}"
 
    @property
    def variance(self):
        return float(self.allocated) - float(self.spent)
 
 
 
class BudgetSnapshot(models.Model):
    budget             = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='snapshots')
    period_label       = models.CharField(max_length=100)
    total_spent        = models.DecimalField(max_digits=20, decimal_places=2)
    revenue_generated  = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    deals_closed       = models.IntegerField(default=0)
    snapshot_date      = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        ordering = ['-snapshot_date']
class GlobalCategory(models.Model):
    user  = models.ForeignKey(User, on_delete=models.CASCADE, related_name='global_categories')
    name  = models.CharField(max_length=100)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        unique_together = ('user', 'name')

    def __str__(self):
        return self.name


class GlobalSubCategory(models.Model):
    category = models.ForeignKey(GlobalCategory, on_delete=models.CASCADE, related_name='subcategories')
    name     = models.CharField(max_length=100)
    order    = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        unique_together = ('category', 'name')

    def __str__(self):
        return f"{self.category.name} / {self.name}"

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_otps')
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
 
    def is_valid(self):
        """OTP is valid for 10 minutes"""
        expiry = self.created_at + datetime.timedelta(minutes=10)
        return not self.is_used and timezone.now() < expiry
 
    def __str__(self):
        return f"OTP for {self.user.email}"
 
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class OwnedModel(models.Model):
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='%(class)s_set',
        null=True, blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  # ← critical: no DB table for this base class

class Resume(OwnedModel):
    """
    Stores AI-parsed resume data.
    Flow: File (PDF/DOCX) → Text Extraction (pdfplumber/PyMuPDF/EasyOCR)
          → Groq AI → Resume → Edit/Export
    """
 
    # Parsed fields
    name        = models.CharField(max_length=255, blank=True, null=True)
    email       = models.EmailField(max_length=255, blank=True, null=True)
    phone       = models.CharField(max_length=50,  blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    address     = models.TextField(blank=True, null=True)
 
    # Raw extracted text (from pdfplumber / PyMuPDF / EasyOCR)
    raw_text = models.TextField(
        blank=True, null=True,
        help_text="Raw text extracted from the uploaded PDF or DOCX"
    )
 
    # Uploaded file
    file = models.FileField(
        upload_to='resumes/',
        blank=True, null=True,
        help_text="Original uploaded resume file (PDF or DOCX)"
    )
 
    # Processing status
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('processed', 'Processed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
 
    class Meta:
        verbose_name        = "Resume"
        verbose_name_plural = "Resumes"
        ordering            = ['-created_at']
 
    def __str__(self):
        return f"{self.name or 'Unknown'} — {self.designation or 'No Designation'}"


from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PerformanceTarget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='performance_quotas')
    fiscal_year = models.IntegerField(default=2024)
    # The target amount (e.g., 3,000,000 for 30 Lakhs)
    sales_target = models.DecimalField(max_digits=20, decimal_places=2, default=0) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'fiscal_year')

    def __str__(self):
        return f"{self.user.username} - {self.fiscal_year} Target"


class FormSettingsStore(models.Model):
    key = models.CharField(max_length=32, unique=True, default='default')
    account = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.key
