# serializers.py
from rest_framework import serializers
from .models import AddTaskData, GlobalCategory, GlobalSubCategory, User,AddAccountData,Opportunity,AddTargetData, VisitingCard
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

class ManagerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100)
    password = serializers.CharField(max_length=68, min_length=6)

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')

        # Fixed email and password
        fixed_email = 'admin@example.com'  # Set your fixed email here
        fixed_password = 'adminpassword123'  # Set your fixed password here

        if not email or not password:
            raise ValidationError('Email and password are required.')

        # Check if the provided email and password match the fixed values
        if email != fixed_email or password != fixed_password:
            raise ValidationError('Invalid email or password.')

        # Generate JWT tokens
        refresh = RefreshToken.for_user(None)  # You can return a specific user here
        attrs['access_token'] = str(refresh.access_token)
        attrs['refresh_token'] = str(refresh)

        return attrs













from rest_framework.exceptions import ValidationError

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(max_length=68, min_length=6, write_only=True)
#     employeeid = serializers.CharField(max_length=10)
#     role = serializers.CharField(max_length=50)
#     email = serializers.EmailField(max_length=100)

#     class Meta:
#         model = User
#         fields = ['username', 'password', 'employeeid', 'role', 'email']

#     def validate(self, attrs):
#         username = attrs.get('username', '')
#         password = attrs.get('password', '')
#         email = attrs.get('email', '')

#         try:
#             # Check if username is alphanumeric
#             if not username.isalnum():
#                 raise ValidationError(
#                     {'username': 'Username should only contain alphanumeric characters.'}
#                 )

#             # Email validation (optional: check if email already exists)
#             if User.objects.filter(email=email).exists():
#                 raise ValidationError({'email': 'Email is already in use.'})

#             # Password validation conditions
#             if len(password) < 6:
#                 raise ValidationError({'password': 'Password must be at least 6 characters long.'})

#             if not any(char.isupper() for char in password):
#                 raise ValidationError({'password': 'Password must contain at least one uppercase letter.'})

#             if not any(char.islower() for char in password):
#                 raise ValidationError({'password': 'Password must contain at least one lowercase letter.'})

#             if not any(char.isdigit() for char in password):
#                 raise ValidationError({'password': 'Password must contain at least one number.'})

#             if not any(char in "!@#$%^&*()-_=+[]{}|;:',.<>?/" for char in password):
#                 raise ValidationError({
#                     'password': 'Password must contain at least one special character (!@#$%^&*()-_=+[]{}|;:\',.<>?/).'
#                 })

#         except ValidationError as e:
#             # Handle the exception and raise with details
#             raise ValidationError(e.detail) from None

#         return attrs

#     def create(self, validated_data):
#         try:
#             return User.objects.create_user(**validated_data)
#         except Exception as e:
#             raise serializers.ValidationError({'error': str(e)})


from rest_framework.exceptions import ValidationError
from django.contrib.auth.validators import UnicodeUsernameValidator
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model() 
class RegisterSerializer(serializers.ModelSerializer):
    # Override username field to remove Django's default alphanumeric validator
    username = serializers.CharField(
        max_length=150,
        validators=[]  # ← removes Django's built-in UnicodeUsernameValidator
    )
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    employeeid = serializers.CharField(max_length=10)
    role = serializers.CharField(max_length=50)
    email = serializers.EmailField(max_length=100)

    class Meta:
        model = User
        fields = ['username', 'password', 'employeeid', 'role', 'email']

    def validate(self, attrs):
        username = attrs.get('username', '')
        password = attrs.get('password', '')
        email = attrs.get('email', '')

        # Remove the isalnum() check since we're allowing all characters now
        # Or keep your own custom rule here if needed

        if User.objects.filter(username__iexact=username).exists():
            raise ValidationError({'username': 'Username is already in use.'})

        if User.objects.filter(email=email).exists():
            raise ValidationError({'email': 'Email is already in use.'})

        if len(password) < 6:
            raise ValidationError({'password': 'Password must be at least 6 characters long.'})

        if not any(char.isupper() for char in password):
            raise ValidationError({'password': 'Password must contain at least one uppercase letter.'})

        if not any(char.islower() for char in password):
            raise ValidationError({'password': 'Password must contain at least one lowercase letter.'})

        if not any(char.isdigit() for char in password):
            raise ValidationError({'password': 'Password must contain at least one number.'})

        if not any(char in "!@#$%^&*()-_=+[]{}|;:',.<>?/" for char in password):
            raise ValidationError({
                'password': 'Password must contain at least one special character (!@#$%^&*()-_=+[]{}|;:\',.<>?/).'
            })

        return attrs

    def create(self, validated_data):
        try:
            return User.objects.create_user(**validated_data)
        except Exception as e:
            raise serializers.ValidationError({'error': str(e)})





# serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=150, required=False, allow_blank=True)
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)
    password = serializers.CharField(max_length=68, min_length=6)

    def validate(self, attrs):
        email = str(attrs.get('email', '')).strip()
        username = str(attrs.get('username', '')).strip()
        password = attrs.get('password', '')
        identifier = email or username

        if not identifier or not password:
            raise ValidationError('Email/username and password are required.')

        auth_kwargs = {'password': password}
        if '@' in identifier:
            auth_kwargs['email'] = identifier
        else:
            auth_kwargs['username'] = identifier

        user = authenticate(**auth_kwargs)

        if not user and username and email and username != email:
            fallback_kwargs = {'password': password}
            if 'email' in auth_kwargs:
                fallback_kwargs['username'] = username
            else:
                fallback_kwargs['email'] = email
            user = authenticate(**fallback_kwargs)

        if not user:
            raise ValidationError('Invalid email/username or password.')

        attrs['user'] = user
        attrs['email'] = user.email
        attrs['username'] = user.username
        return attrs







class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model() 

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'role', 'employeeid']
# serializers.py
# serializers.py
from django.contrib.auth import get_user_model

User = get_user_model()  # ← add this

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150, validators=[])
    role = serializers.CharField(max_length=50, required=False)
    employeeid = serializers.CharField(max_length=10, required=False)

    class Meta:
        model = User  # ← now uses your custom model
        fields = ['id', 'username', 'email', 'role', 'employeeid']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
        }




from rest_framework import serializers
from .models import AddAccountData, Contact, FinanceInformation, CompanyDetails


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'category', 'name', 'designation', 'mobile_no', 'email_id']


class FinanceInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceInformation
        fields = ['id', 'turn_over', 'account_resumable', 'credits']


class CompanyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyDetails
        fields = ['id', 'company_type', 'account_type', 'company_scale']

class AddAccountDataSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True)
    finance = FinanceInformationSerializer(many=True)
    company = CompanyDetailsSerializer(many=True)
    user = serializers.CharField(source='user.username', read_only=True)
    

    class Meta:
        model = AddAccountData
        fields = [
            'id',  'account_name', 'department', 'vertical', 'vertical_sub', 'pic',
            'designation', 'business', 'region', 'mobile_number', 'email_id', 'location', 'state',
            'city', 'address', 'acct_created_date', 'user', 'contacts', 'finance', 'company'
        ]
        read_only_fields = ['user']

    def create(self, validated_data):
        contacts_data = validated_data.pop('contacts', [])
        finance_data = validated_data.pop('finance', [])
        company_data = validated_data.pop('company', [])

        account = AddAccountData.objects.create(**validated_data)

        for contact_data in contacts_data:
            Contact.objects.create(add_account_data=account, **contact_data)

        for finance_item in finance_data:
            FinanceInformation.objects.create(add_account_data=account, **finance_item)

        for company_item in company_data:
            CompanyDetails.objects.create(add_account_data=account, **company_item)

        return account

    def update(self, instance, validated_data):
        # Handle nested updates
        contacts_data = validated_data.pop('contacts', [])
        finance_data = validated_data.pop('finance', [])
        company_data = validated_data.pop('company', [])

        # Update simple fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update contacts
        if contacts_data:
            instance.contacts.all().delete()  # Delete existing contacts
            for contact_data in contacts_data:
                Contact.objects.create(add_account_data=instance, **contact_data)

        # Update finance information
        if finance_data:
            instance.finance.all().delete()  # Delete existing finance entries
            for finance_item in finance_data:
                FinanceInformation.objects.create(add_account_data=instance, **finance_item)

        # Update company details
        if company_data:
            instance.company.all().delete()  # Delete existing company entries
            for company_item in company_data:
                CompanyDetails.objects.create(add_account_data=instance, **company_item)

        return instance

class VisitingCardSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VisitingCard
        fields = [
            'id', 'person_name', 'company_name', 'email', 'phone',
            'designation', 'address', 'region', 'location', 'vertical',
            'raw_text', 'status', 'account',
            'image', 'image_url', 'created_at', 'created_by',
        ]
        read_only_fields = ['created_at', 'created_by', 'status', 'account']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None








from rest_framework import serializers
from . models import Opportunity, Opportunity_Stage, Opportunity_Pic, Opportunity_Events, Opportunity_Tasks,Opportunity_Followup
from django.utils import timezone



class OpportunityStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity_Stage
        fields = ['id', 'stages', 'ranks','lost_reason','last_update']


class OpportunityPicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity_Pic
        fields = ['id', 'pic_department', 'pic_name', 'pic_designation', 'pic_email', 'pic_phnone', 'pic_phntwo']


class OpportunityEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity_Events
        fields = ['id', 'start_date', 'end_date', 'start_time', 'end_time', 'event', 'remark']


class OpportunityTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity_Tasks
        fields = ['id', 'task', 'assign_to', 'start_date', 'end_date', 'status']

class OpportunityFollowupSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Opportunity_Followup
        fields = ['id', 'followup', 'followup_topic', 'start_date', 'end_date', 'remark']

# class OpportunitySerializer(serializers.ModelSerializer):
#     opportunity_stages = OpportunityStageSerializer(many=True)  # Make optional
#     opportunity_pic = OpportunityPicSerializer(many=True)  # Make optional
#     opportunity_event = OpportunityEventsSerializer(many=True)
#     opportunity_task = OpportunityTasksSerializer(many=True)
#     user = serializers.CharField(source='user.username', read_only=True)
    

#     class Meta:
#         model = Opportunity
#         fields = [
#             'id',  'account_name', 'opportunity', 'make', 'sub_make',
#             'sub_make_brand', 'pic', 'contact_person', 'designation', 'department', 'mobile_number',
#             'email_id', 'location', 'state', 'city', 'address',  'qty',
#             'values', 'exp_closure_date', 'exp_po_date', 'remarks', 'opportunity_description',
#             'hardware_amount', 'software_amount', 'consumables_amount', 'automation_amount',
#             'solution_amount', 'maintenance_amount', 'others_amount', 'total_amount','acct_created_date',
#             'status', 'vertical','last_update','user', 'opportunity_stages', 'opportunity_pic', 
#             'opportunity_event', 'opportunity_task'
#         ]
#         read_only_fields = ['user']

#     def create(self, validated_data):
#         stages_data = validated_data.pop('opportunity_stages', [])
#         pics_data = validated_data.pop('opportunity_pic', [])
#         events_data = validated_data.pop('opportunity_event', [])
#         tasks_data = validated_data.pop('opportunity_task', [])

#         opportunity = Opportunity.objects.create(**validated_data)

#         # Handle optional related data (if any)
#         for stage_data in stages_data:
#             Opportunity_Stage.objects.create(add_opportunity=opportunity, **stage_data)

#         for pic_data in pics_data:
#             Opportunity_Pic.objects.create(add_opportunity=opportunity, **pic_data)

#         for event_data in events_data:
#             Opportunity_Events.objects.create(add_opportunity=opportunity, **event_data)

#         for task_data in tasks_data:
#             Opportunity_Tasks.objects.create(add_opportunity=opportunity, **task_data)

#         return opportunity

    
#     def update(self, instance, validated_data):
#         # Handle nested updates
#         stages_data = validated_data.pop('opportunity_stages', [])
#         pics_data = validated_data.pop('opportunity_pic', [])
#         events_data = validated_data.pop('opportunity_event', [])
#         tasks_data = validated_data.pop('opportunity_task', [])

#         # Update simple fields
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

       
#         if stages_data:
#             instance.opportunity_stages.all().delete()  
#             for stage_data in stages_data:
#                 Opportunity_Stage.objects.create(add_opportunity=instance, **stage_data)

       
#         if pics_data:
#             instance.opportunity_pic.all().delete() 
#             for pic_data in pics_data:
#                 Opportunity_Pic.objects.create(add_opportunity=instance, **pic_data)

     
#         if events_data:
#             instance.opportunity_event.all().delete()  
#             for event_data in events_data:
#                 Opportunity_Events.objects.create(add_opportunity=instance, **event_data)


#         if tasks_data:
#             instance.opportunity_task.all().delete() 
#             for task_data in tasks_data:
#                 Opportunity_Tasks.objects.create(add_opportunity=instance, **task_data)

#         return instance

class OpportunitySerializer(serializers.ModelSerializer):
    # Keep nested sections optional so older/newer frontend payloads don't fail validation.
    opportunity_stages   = OpportunityStageSerializer(many=True, required=False)
    opportunity_pic      = OpportunityPicSerializer(many=True, required=False)
    opportunity_event    = OpportunityEventsSerializer(many=True, required=False)
    opportunity_task     = OpportunityTasksSerializer(many=True, required=False)
    opportunity_followup = OpportunityFollowupSerializer(many=True, required=False)  # NEW

    # Frontend supports dynamic options from settings; don't enforce static model choices here.
    opportunity = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    sales_type  = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    # Managed by backend defaults/logic.
    last_update = serializers.DateField(read_only=True)
    acct_created_date = serializers.DateField(read_only=True)

    user = serializers.CharField(source='user.username', read_only=True)
 
    class Meta:
        model  = Opportunity
        fields = [
            'id', 'account_name', 'opportunity', 'make', 'sub_make',
            'sub_make_brand', 'pic', 'contact_person', 'designation', 'department',
            'mobile_number', 'email_id', 'location', 'state', 'city', 'address',
            'description',
            'qty', 'values', 'exp_closure_date', 'exp_po_date', 'remarks',
            'opportunity_description', 'hardware_amount', 'software_amount',
            'consumables_amount', 'automation_amount', 'implementation_amount', 'solution_amount',
            'maintenance_amount', 'others_amount', 'total_amount', 'acct_created_date',
            'status', 'vertical', 'last_update', 'user',
            'opportunity_stages', 'opportunity_pic',
            'opportunity_event', 'opportunity_task',
            'sales_type', 'sales_type_value',
            'opportunity_followup',                                           # NEW
        ]
        read_only_fields = ['user', 'last_update', 'acct_created_date']

    @staticmethod
    def _normalize_stage_payload(stage_data):
        normalized = dict(stage_data)
        if not normalized.get('last_update'):
            normalized['last_update'] = timezone.localdate()
        return normalized
 
    def create(self, validated_data):
        stages_data   = validated_data.pop('opportunity_stages',   [])
        pics_data     = validated_data.pop('opportunity_pic',      [])
        events_data   = validated_data.pop('opportunity_event',    [])
        tasks_data    = validated_data.pop('opportunity_task',     [])
        followups_data = validated_data.pop('opportunity_followup', [])  # NEW
 
        opportunity = Opportunity.objects.create(**validated_data)
 
        for stage_data in stages_data:
            Opportunity_Stage.objects.create(
                add_opportunity=opportunity,
                **self._normalize_stage_payload(stage_data),
            )
        for pic_data     in pics_data:     Opportunity_Pic.objects.create(add_opportunity=opportunity, **pic_data)
        for event_data   in events_data:   Opportunity_Events.objects.create(add_opportunity=opportunity, **event_data)
        for task_data    in tasks_data:    Opportunity_Tasks.objects.create(add_opportunity=opportunity, **task_data)
        for followup_data in followups_data:                                 # NEW
            Opportunity_Followup.objects.create(add_opportunity=opportunity, **followup_data)
 
        return opportunity
 
    def update(self, instance, validated_data):
        stages_data    = validated_data.pop('opportunity_stages',   [])
        pics_data      = validated_data.pop('opportunity_pic',      [])
        events_data    = validated_data.pop('opportunity_event',    [])
        tasks_data     = validated_data.pop('opportunity_task',     [])
        followups_data = validated_data.pop('opportunity_followup', [])  # NEW
 
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
 
        if stages_data:
            instance.opportunity_stages.all().delete()
            for stage_data in stages_data:
                Opportunity_Stage.objects.create(
                    add_opportunity=instance,
                    **self._normalize_stage_payload(stage_data),
                )
 
        if pics_data:
            instance.opportunity_pic.all().delete()
            for pic_data in pics_data:
                Opportunity_Pic.objects.create(add_opportunity=instance, **pic_data)
 
        if events_data:
            instance.opportunity_event.all().delete()
            for event_data in events_data:
                Opportunity_Events.objects.create(add_opportunity=instance, **event_data)
 
        if tasks_data:
            instance.opportunity_task.all().delete()
            for task_data in tasks_data:
                Opportunity_Tasks.objects.create(add_opportunity=instance, **task_data)
 
        if followups_data:                                                   # NEW
            instance.opportunity_followup.all().delete()
            for followup_data in followups_data:
                Opportunity_Followup.objects.create(add_opportunity=instance, **followup_data)
 
        return instance













from rest_framework import serializers
from .models import AddTargetData, TargetContact
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

class TargetContactSerializer(serializers.ModelSerializer):
    category = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    email_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = TargetContact
        fields = ['category', 'name', 'designation', 'mobile_no', 'email_id']  # Removed space from 'email_id'

    def validate_category(self, value):
        raw = (value or '').strip()
        if not raw:
            return ''
        if raw in dict(TargetContact.CATEGORY_CHOICES):
            return raw

        # Accept legacy human labels and normalize to DB code.
        lowered = raw.lower()
        for code, label in TargetContact.CATEGORY_CHOICES:
            if lowered == label.lower():
                return code
        return ''

    def validate_email_id(self, value):
        email = (value or '').strip()
        if not email:
            return ''
        try:
            validate_email(email)
            return email
        except DjangoValidationError:
            # Keep request successful even for non-email placeholders.
            return ''

class AddTargetDataSerializer(serializers.ModelSerializer):
    targetcontacts = TargetContactSerializer(many=True, required=False)
    user = serializers.CharField(source='user.username', read_only=True)
    email_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mobile_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)


    class Meta:
        model = AddTargetData
        fields = '__all__'
        read_only_fields = ['last_update_date', 'user']

    def to_internal_value(self, data):
        # Backward compatibility for old frontend payload keys.
        if hasattr(data, 'copy'):
            mutable = data.copy()
        else:
            mutable = dict(data)
        mutable.pop('account_holder', None)
        mutable.pop('finance', None)
        mutable.pop('company', None)
        mutable.pop('last_update', None)
        return super().to_internal_value(mutable)

    def validate_email_id(self, value):
        email = (value or '').strip()
        if not email:
            return ''
        try:
            validate_email(email)
            return email
        except DjangoValidationError:
            return ''

    def validate_mobile_number(self, value):
        digits_only = ''.join(ch for ch in (value or '') if ch.isdigit())
        return digits_only[:10]

    def create(self, validated_data):
        contacts_data = validated_data.pop('targetcontacts', [])  
        add_target_data = AddTargetData.objects.create(**validated_data)

        for contact_data in contacts_data:
            TargetContact.objects.create(add_target_data=add_target_data, **contact_data)

        return add_target_data

    def update(self, instance, validated_data):
        contacts_data = validated_data.pop('targetcontacts', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if contacts_data is not None:
            instance.targetcontacts.all().delete()  
            for contact_data in contacts_data:
                TargetContact.objects.create(add_target_data=instance, **contact_data)

        return instance


from .models import AddTaskData


from rest_framework import serializers
from .models import AddTaskData

from rest_framework import serializers
from .models import AddTaskData

class AddTaskDataSerializer(serializers.ModelSerializer):
    assignedto_username = serializers.CharField(source='assignedto.username', read_only=True)  # Get username of assigned user
    


    class Meta:
        model = AddTaskData
        fields = [
            'id',
            'task',
            'description',
            'priority',
            'start_date',
            'end_date',
            'assignedto',  # This will hold the user's ID
            'assignedto_username',  # This will hold the username of the assigned user
            'status',
            'outcome',
            'last_update_date',
            'is_accepted',
            'assigned_by',  # This will hold the username of the creator
        ]
        read_only_fields = ['assigned_by', 'last_update_date']

    def to_representation(self, instance):
        # Get the representation from the parent class
        representation = super().to_representation(instance)
        
        # If the assigned_by field is empty, set it to the username of the user who created the task
        if not representation.get('assigned_by'):
            representation['assigned_by'] = instance.assigned_by if instance.assigned_by else 'N/A'
        
        return representation
  # Mark fields that should not be edited


class AddTaskDataUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddTaskData
        fields = ['status','outcome']




from rest_framework import serializers
from .models import AddTaskData

class TaskAcceptStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddTaskData
        fields = ['is_accepted']  # Only the `is_accepted` field can be updated





from rest_framework import serializers
from . models import Lead, Lead_Pic, Lead_Stage



class LeadStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity_Stage
        fields = ['id', 'stages', 'ranks','lost_reason']


class LeadPicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity_Pic
        fields = ['id', 'pic_department', 'pic_name', 'pic_designation', 'pic_email', 'pic_phnone', 'pic_phntwo']




from django.contrib.auth import get_user_model
User = get_user_model()

class LeadSerializer(serializers.ModelSerializer):
    assign_to = serializers.SlugRelatedField(
        slug_field='username', queryset=User.objects.all(), allow_null=True
    )
    user = serializers.SlugRelatedField(
        slug_field='username', read_only=True
    )
    lead_stages = LeadStageSerializer(many=True, required=False)  # Make optional
    lead_pic = LeadPicSerializer(many=True, required=False)  # Make optional

    class Meta:
        model = Lead
        fields = [
            'id', 'assign_to', 'user', 'account_name', 'lead', 'make', 'sub_make',
            'sub_make_brand', 'pic', 'vertical', 'business_type', 'designation', 
            'department', 'mobile_number', 'location', 'state','city', 'address', 'qty', 
            'values', 'remarks', 'hardware_amount', 'software_amount', 
            'consumables_amount', 'automation_amount', 'solution_amount', 
            'maintenance_amount', 'others_amount', 'total_amount', 
            'last_update', 'lead_stages', 'lead_pic', 'status','description','acct_created_date','email_id'
        ]
        read_only_fields = ['user', 'last_update','acct_created_date']  # Keep 'user' read-only

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user:
            validated_data["user"] = request.user  # Assign authenticated user

        lead_stages_data = validated_data.pop('lead_stages', [])
        lead_pics_data = validated_data.pop('lead_pic', [])

        lead = Lead.objects.create(**validated_data)

        for lead_stage_data in lead_stages_data:
            Lead_Stage.objects.create(add_lead=lead, **lead_stage_data)

        for lead_pic_data in lead_pics_data:
            Lead_Pic.objects.create(add_lead=lead, **lead_pic_data)

        return lead


    
    def update(self, instance, validated_data):
        # Handle nested updates
        lead_stages_data = validated_data.pop('lead_stages', [])
        lead_pics_data = validated_data.pop('lead_pic', [])
       

        # Update simple fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

       
        if lead_stages_data:
            instance.lead_stages.all().delete()  
            for lead_stage_data in lead_stages_data:
                Lead_Stage.objects.create(add_lead=instance, **lead_stage_data)

       
        if lead_pics_data:
            instance.lead_pic.all().delete() 
            for lead_pic_data in lead_pics_data:
                Lead_Pic.objects.create(add_lead=instance, **lead_pic_data)

     
        

        return instance
    

# budget/serializers.py====================================================================================================
# from rest_framework import serializers
# from .models import Budget, BudgetAllocation, SpendEntry


# class SpendEntrySerializer(serializers.ModelSerializer):
#     recorded_by_name = serializers.SerializerMethodField()

#     class Meta:
#         model  = SpendEntry
#         fields = [
#             'id', 'budget', 'allocation', 'description', 'amount',
#             'spend_date', 'approval_status', 'reference_no',
#             'recorded_by', 'recorded_by_name', 'created_at', 'updated_at',
#         ]
#         read_only_fields = ['id', 'recorded_by', 'created_at', 'updated_at']

#     def get_recorded_by_name(self, obj):
#         if obj.recorded_by:
#             return obj.recorded_by.get_full_name() or obj.recorded_by.username
#         return None

#     def create(self, validated_data):
#         validated_data['recorded_by'] = self.context['request'].user
#         return super().create(validated_data)


# class BudgetAllocationSerializer(serializers.ModelSerializer):
#     spent_amount    = serializers.SerializerMethodField()
#     utilization_pct = serializers.SerializerMethodField()
#     status          = serializers.SerializerMethodField()

#     class Meta:
#         model  = BudgetAllocation
#         fields = [
#             'id', 'budget', 'category_name', 'allocated_amount',
#             'spent_amount', 'utilization_pct', 'status',
#             'notes', 'created_at', 'updated_at',
#         ]
#         read_only_fields = ['id', 'spent_amount', 'utilization_pct', 'status', 'created_at', 'updated_at']

#     def get_spent_amount(self, obj):
#         return float(obj.spent_amount)

#     def get_utilization_pct(self, obj):
#         return obj.utilization_pct

#     def get_status(self, obj):
#         return obj.status

#     def validate(self, attrs):
#         """Ensure category name is unique within the budget (on create)."""
#         budget        = attrs.get('budget')
#         category_name = attrs.get('category_name')
#         instance      = self.instance

#         qs = BudgetAllocation.objects.filter(budget=budget, category_name=category_name)
#         if instance:
#             qs = qs.exclude(pk=instance.pk)
#         if qs.exists():
#             raise serializers.ValidationError(
#                 {'category_name': 'This category already exists for the selected budget.'}
#             )
#         return attrs


# class BudgetListSerializer(serializers.ModelSerializer):
#     """Lightweight serializer for the list view."""
#     spent_amount     = serializers.SerializerMethodField()
#     remaining_amount = serializers.SerializerMethodField()
#     utilization_pct  = serializers.SerializerMethodField()
#     status           = serializers.SerializerMethodField()
#     created_by_name  = serializers.SerializerMethodField()

#     class Meta:
#         model  = Budget
#         fields = [
#             'id', 'name', 'total_amount', 'currency', 'period',
#             'fiscal_year', 'quarter', 'month',
#             'spent_amount', 'remaining_amount', 'utilization_pct', 'status',
#             'revenue_target', 'target_deal_count',
#             'created_by_name', 'created_at',
#         ]

#     def get_spent_amount(self, obj):     return float(obj.spent_amount)
#     def get_remaining_amount(self, obj): return float(obj.remaining_amount)
#     def get_utilization_pct(self, obj):  return obj.utilization_pct
#     def get_status(self, obj):           return obj.status

#     def get_created_by_name(self, obj):
#         if obj.created_by:
#             return obj.created_by.get_full_name() or obj.created_by.username
#         return '—'


# class BudgetDetailSerializer(serializers.ModelSerializer):
#     """Full serializer for create / update / retrieve."""
#     allocations      = BudgetAllocationSerializer(many=True, read_only=True)
#     spent_amount     = serializers.SerializerMethodField()
#     remaining_amount = serializers.SerializerMethodField()
#     utilization_pct  = serializers.SerializerMethodField()
#     status           = serializers.SerializerMethodField()
#     created_by_name  = serializers.SerializerMethodField()

#     class Meta:
#         model  = Budget
#         fields = [
#             'id', 'name', 'total_amount', 'currency', 'period',
#             'fiscal_year', 'quarter', 'month',
#             'revenue_target', 'target_deal_count', 'max_budget_per_deal',
#             'notes',
#             'allocations',
#             'spent_amount', 'remaining_amount', 'utilization_pct', 'status',
#             'created_by', 'created_by_name', 'created_at', 'updated_at',
#         ]
#         read_only_fields = [
#             'id', 'spent_amount', 'remaining_amount', 'utilization_pct',
#             'status', 'created_by', 'created_at', 'updated_at',
#         ]

#     def get_spent_amount(self, obj):     return float(obj.spent_amount)
#     def get_remaining_amount(self, obj): return float(obj.remaining_amount)
#     def get_utilization_pct(self, obj):  return obj.utilization_pct
#     def get_status(self, obj):           return obj.status

#     def get_created_by_name(self, obj):
#         if obj.created_by:
#             return obj.created_by.get_full_name() or obj.created_by.username
#         return '—'

#     def validate(self, attrs):
#         period  = attrs.get('period',  getattr(self.instance, 'period',  None))
#         quarter = attrs.get('quarter', getattr(self.instance, 'quarter', None))
#         month   = attrs.get('month',   getattr(self.instance, 'month',   None))

#         if period == 'quarterly' and not quarter:
#             raise serializers.ValidationError({'quarter': 'Quarter is required for quarterly budgets.'})
#         if period == 'monthly' and not month:
#             raise serializers.ValidationError({'month': 'Month is required for monthly budgets.'})
#         return attrs

#     def create(self, validated_data):
#         validated_data['created_by'] = self.context['request'].user
#         return super().create(validated_data)


# # ── Summary / Dashboard serializers (read-only) ──────────────────────────────

# class CategorySpendSerializer(serializers.Serializer):
#     id              = serializers.IntegerField()
#     category_name   = serializers.CharField()
#     allocated       = serializers.FloatField()
#     spent           = serializers.FloatField()
#     utilization_pct = serializers.FloatField()
#     status          = serializers.CharField()


# class BudgetSummarySerializer(serializers.Serializer):
#     total_budget        = serializers.FloatField()
#     total_spent         = serializers.FloatField()
#     total_remaining     = serializers.FloatField()
#     utilization_pct     = serializers.FloatField()
#     revenue_generated   = serializers.FloatField()
#     roi_ratio           = serializers.FloatField()
#     deals_closed        = serializers.IntegerField()
#     target_deals        = serializers.IntegerField()
#     burn_rate_monthly   = serializers.FloatField()
#     forecast_overspend  = serializers.FloatField()
#     cost_per_deal       = serializers.FloatField()
#     cost_per_lead       = serializers.FloatField()
#     pipeline_value      = serializers.FloatField()


# class BudgetAlertSerializer(serializers.Serializer):
#     id       = serializers.IntegerField()
#     message  = serializers.CharField()
#     sub      = serializers.CharField()
#     severity = serializers.CharField()


# class ComparisonItemSerializer(serializers.Serializer):
#     label    = serializers.CharField()
#     value    = serializers.CharField()
#     positive = serializers.BooleanField()   

# from rest_framework import serializers
# from .models import Budget, BudgetCategory, BudgetSnapshot
 
 
# class BudgetCategorySerializer(serializers.ModelSerializer):
#     remaining       = serializers.ReadOnlyField()
#     utilization_pct = serializers.ReadOnlyField()
#     display_name    = serializers.SerializerMethodField()  # ← NEW
 
#     class Meta:
#         model  = BudgetCategory
#         fields = [
#             'id', 'category', 'category_label', 'icon', 'is_custom',  'allocated', 'spent',
#             'remaining', 'utilization_pct', 'alert_threshold', 'display_name',
#         ]
#     def get_display_name(self, obj):
#         return obj.get_display_name()
 
# class BudgetSnapshotSerializer(serializers.ModelSerializer):
#     class Meta:
#         model  = BudgetSnapshot
#         fields = '__all__'
 
 
# class BudgetSerializer(serializers.ModelSerializer):
#     categories = BudgetCategorySerializer(many=True, required=False)
#     snapshots  = BudgetSnapshotSerializer(many=True, read_only=True)
#     user       = serializers.CharField(source='user.username', read_only=True)
 
#     # Computed totals
#     total_spent     = serializers.SerializerMethodField()
#     total_remaining = serializers.SerializerMethodField()
#     overall_utilization_pct = serializers.SerializerMethodField()
 
#     class Meta:
#         model  = Budget
#         fields = [
#             'id', 'user', 'title', 'total_budget', 'period', 'currency',
#             'start_date', 'end_date', 'revenue_target', 'target_deal_count',
#             'max_budget_per_deal', 'notes', 'created_at', 'updated_at',
#             'categories', 'snapshots',
#             'total_spent', 'total_remaining', 'overall_utilization_pct',
#         ]
#         read_only_fields = ['user', 'created_at', 'updated_at']
 
#     def get_total_spent(self, obj):
#         return sum(float(c.spent) for c in obj.categories.all())
 
#     def get_total_remaining(self, obj):
#         return float(obj.total_budget) - self.get_total_spent(obj)
 
#     def get_overall_utilization_pct(self, obj):
#         if obj.total_budget == 0:
#             return 0
#         return round((self.get_total_spent(obj) / float(obj.total_budget)) * 100, 1)
 
#     def create(self, validated_data):
#         categories_data = validated_data.pop('categories', [])
#         budget = Budget.objects.create(**validated_data)
#         for cat_data in categories_data:
#             BudgetCategory.objects.create(budget=budget, **cat_data)
#         return budget
 
#     def update(self, instance, validated_data):
#         categories_data = validated_data.pop('categories', [])
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()
#         if categories_data:
#             instance.categories.all().delete()
#             for cat_data in categories_data:
#                 BudgetCategory.objects.create(budget=instance, **cat_data)
#         return instance
    


from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Budget, BudgetCategory, BudgetPeriodEntry, BudgetSnapshot,BudgetSubCategory
 
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name'] 
 
class BudgetSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = BudgetSubCategory
        fields = ['id', 'name', 'order'] 
class BudgetPeriodEntrySerializer(serializers.ModelSerializer):
    category_id   = serializers.IntegerField(source='category.id', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_id   = serializers.IntegerField(source='subcategory.id', read_only=True, allow_null=True)
    subcategory_name = serializers.SerializerMethodField()
    variance      = serializers.FloatField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
 
    class Meta:
        model  = BudgetPeriodEntry
        fields = ['id', 'category_id', 'category_name','subcategory_id', 'subcategory_name', 'month','user_id', 'allocated', 'variance']
    def get_subcategory_id(self, obj):
        if obj.subcategory is not None:
            return obj.subcategory.id
        return None

    def get_subcategory_name(self, obj):
        if obj.subcategory is not None:
            return obj.subcategory.name
        return None
 
class BudgetCategorySerializer(serializers.ModelSerializer):
    subcategories   = BudgetSubCategorySerializer(many=True, read_only=True)
    total_allocated = serializers.FloatField(read_only=True)
   
 
    class Meta:
        model  = BudgetCategory
        fields = ['id', 'name', 'alert_threshold', 'order','subcategories', 'total_allocated']
 
 
class BudgetListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    categories              = BudgetCategorySerializer(many=True, read_only=True)
    period_entries          = BudgetPeriodEntrySerializer(many=True, read_only=True)
    computed_total_budget   = serializers.FloatField(read_only=True)
    total_budget            = serializers.FloatField(source='computed_total_budget', read_only=True)
    user = SimpleUserSerializer(read_only=True)
    class Meta:
        model  = Budget
        fields = [
            'id', 'user',  'title', 'period', 'quarter','selected_month',  'currency','username','total_budget',
             'computed_total_budget',  'start_date', 'end_date',
            'revenue_target', 'target_deal_count', 'max_budget_per_deal',
            'deals_closed', 'notes','period_entries',
            'categories', 'created_at',]

class SalesPersonSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'role']
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class TeamBudgetSummarySerializer(serializers.ModelSerializer):
    sales_person = serializers.CharField(source='user.username', read_only=True)
    budget_this_fy = serializers.FloatField(source='computed_total_budget', read_only=True)
    this_quarter = serializers.FloatField(source='current_quarter_target', read_only=True)
    this_month = serializers.FloatField(source='current_month_target', read_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'sales_person', 'budget_this_fy', 'this_quarter', 'this_month']        

 
class BudgetWriteSerializer(serializers.ModelSerializer):
    # These names must exactly match what the frontend sends
    user_id = serializers.IntegerField(write_only=True, required=False)
    categories    = serializers.ListField(child=serializers.DictField(), write_only=True, required=False, default=list)
    period_entries = serializers.ListField(child=serializers.DictField(), write_only=True, required=False, default=list)
    rename_fy_title = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model  = Budget
        fields = [
            'id', 'title', 'period', 'quarter','selected_month', 'currency','user_id',
             'start_date', 'end_date',
            'revenue_target', 'target_deal_count', 'max_budget_per_deal',
            'notes',
            'categories',      # ← matches frontend key exactly
            'period_entries',  # ← matches frontend key exactly
            'rename_fy_title',
        ]

    # def _save_categories_and_entries(self, budget, categories_data, entries_data):
    #     processed_category_ids = []
    #     category_map_by_index = {}

    #     # Step 1: Create or update categories
    #     for i, cat_data in enumerate(categories_data):
    #         cat_id   = cat_data.get('id')
    #         cat_name = str(cat_data.get('name', '')).strip()
    #         if not cat_name:
    #             continue

    #         if cat_id:
    #             try:
    #                 category = BudgetCategory.objects.get(id=cat_id, budget=budget)
    #                 category.name            = cat_name
    #                 category.alert_threshold = cat_data.get('alert_threshold', 80)
    #                 category.order           = i
    #                 category.save()
    #             except BudgetCategory.DoesNotExist:
    #                 category = BudgetCategory.objects.create(
    #                     budget=budget, name=cat_name,
    #                     alert_threshold=cat_data.get('alert_threshold', 80), order=i
    #                 )
    #         else:
    #             category = BudgetCategory.objects.create(
    #                 budget=budget, name=cat_name,
    #                 alert_threshold=cat_data.get('alert_threshold', 80), order=i
    #             )

    #         processed_category_ids.append(category.id)
    #         category_map_by_index[i] = category

    #     # Step 2: Delete removed categories (entries cascade-delete automatically)
    #     budget.categories.exclude(id__in=processed_category_ids).delete()

    #     # Step 3: Save period entries
    #     processed_entry_pks = []
    #     for entry_data in entries_data:
    #         month = entry_data.get('month')
    #         if not month:
    #             continue

    #         # Find category — prefer category_index, fallback to category_id
    #         category = None
    #         cat_index = entry_data.get('category_index')
    #         cat_id    = entry_data.get('category_id')

    #         if cat_index is not None:
    #             category = category_map_by_index.get(int(cat_index))
    #         elif cat_id is not None:
    #             category = category_map_by_index.get(
    #                 next((i for i, c in category_map_by_index.items() if c.id == int(cat_id)), None)
    #             )

    #         if not category:
    #             continue

    #         entry, _ = BudgetPeriodEntry.objects.update_or_create(
    #             budget=budget,
    #             category=category,
    #             month=month,
    #             defaults={
    #                 'allocated': entry_data.get('allocated', 0),
    #                 'spent':     entry_data.get('spent', 0),
    #             }
    #         )
    #         processed_entry_pks.append(entry.pk)

    #     # Delete entries no longer in the payload
    #     budget.period_entries.exclude(pk__in=processed_entry_pks).delete()
    # def _save_categories_and_entries(self, budget, categories_data, entries_data):
    #     processed_category_ids = []
    #     category_map_by_index  = {}   # {index: BudgetCategory}
    #     subcategory_map        = {}   # {(category_id, sub_name): BudgetSubCategory}
 
    #     # ── Step 1: Create / update categories ───────────────────────────────
    #     for i, cat_data in enumerate(categories_data):
    #         cat_id   = cat_data.get('id')
    #         cat_name = str(cat_data.get('name', '')).strip()
    #         if not cat_name:
    #             continue
 
    #         if cat_id:
    #             try:
    #                 category = BudgetCategory.objects.get(id=cat_id, budget=budget)
    #                 category.name            = cat_name
    #                 category.alert_threshold = cat_data.get('alert_threshold', 80)
    #                 category.order           = i
    #                 category.save()
    #             except BudgetCategory.DoesNotExist:
    #                 category = BudgetCategory.objects.create(
    #                     budget=budget, name=cat_name,
    #                     alert_threshold=cat_data.get('alert_threshold', 80), order=i
    #                 )
    #         else:
    #             category = BudgetCategory.objects.create(
    #                 budget=budget, name=cat_name,
    #                 alert_threshold=cat_data.get('alert_threshold', 80), order=i
    #             )
 
    #         processed_category_ids.append(category.id)
    #         category_map_by_index[i] = category
 
    #         # ── Step 2: Create / update subcategories for this category ──────
    #         subs_data = cat_data.get('subcategories', [])
    #         processed_sub_ids = []
    #         for j, sub_data in enumerate(subs_data):
    #             sub_id   = sub_data.get('id')
    #             sub_name = str(sub_data.get('name', '')).strip()
    #             if not sub_name:
    #                 continue
 
    #             if sub_id:
    #                 try:
    #                     sub = BudgetSubCategory.objects.get(id=sub_id, category=category)
    #                     sub.name  = sub_name
    #                     sub.order = j
    #                     sub.save()
    #                 except BudgetSubCategory.DoesNotExist:
    #                     sub = BudgetSubCategory.objects.create(category=category, name=sub_name, order=j)
    #             else:
    #                 sub, _ = BudgetSubCategory.objects.get_or_create(
    #                     category=category, name=sub_name,
    #                     defaults={'order': j}
    #                 )
    #                 sub.order = j
    #                 sub.save()
 
    #             processed_sub_ids.append(sub.id)
    #             subcategory_map[(category.id, sub_name)] = sub
    #             subcategory_map[(category.id, sub.id)]   = sub
 
    #         # Delete removed subcategories (period entries cascade via SET_NULL)
    #         category.subcategories.exclude(id__in=processed_sub_ids).delete()
 
    #     # Delete removed categories
    #     budget.categories.exclude(id__in=processed_category_ids).delete()
 
    #     # ── Step 3: Save period entries ───────────────────────────────────────
    #     processed_entry_pks = []
    #     for entry_data in entries_data:
    #         month = entry_data.get('month')
    #         if not month:
    #             continue
 
    #         # Resolve category
    #         category  = None
    #         cat_index = entry_data.get('category_index')
    #         cat_id    = entry_data.get('category_id')
 
    #         if cat_index is not None:
    #             category = category_map_by_index.get(int(cat_index))
    #         elif cat_id is not None:
    #             category = next(
    #                 (c for c in category_map_by_index.values() if c.id == int(cat_id)), None
    #             )
 
    #         if not category:
    #             continue
 
    #         # Resolve subcategory (optional)
    #         subcategory = None
    #         sub_id   = entry_data.get('subcategory_id')
    #         sub_name = entry_data.get('subcategory_name', '').strip()
    #         if sub_id:
    #             subcategory = subcategory_map.get((category.id, int(sub_id)))
    #         elif sub_name:
    #             subcategory = subcategory_map.get((category.id, sub_name))
 
    #         entry, _ = BudgetPeriodEntry.objects.update_or_create(
    #             budget=budget,
    #             category=category,
    #             subcategory=subcategory,
    #             month=month,
    #             defaults={
    #                 'allocated': entry_data.get('allocated', 0),
    #                 'spent':     entry_data.get('spent', 0),
    #             }
    #         )
    #         processed_entry_pks.append(entry.pk)
 
    #     # Delete entries no longer in the payload
    #     budget.period_entries.exclude(pk__in=processed_entry_pks).delete()
    # def _save_categories_and_entries(self, budget, categories_data, entries_data):
    #     from .models import BudgetCategory, BudgetSubCategory, BudgetPeriodEntry

    #     # ── STEP 1: Sync Categories ─────────────────────────────────────────────
    #     existing_categories = {
    #         cat.name: cat
    #         for cat in BudgetCategory.objects.filter(budget=budget)
    #     }

    #     incoming_cat_names = [cat_data.get('name', '') for cat_data in categories_data]

    #     # Delete categories no longer in payload (cascades to subcategories + entries)
    #     for old_name, old_cat in existing_categories.items():
    #         if old_name not in incoming_cat_names:
    #             old_cat.delete()

    #     created_categories = []

    #     for i, cat_data in enumerate(categories_data):
    #         cat_name     = cat_data.get('name', '')
    #         subcats_data = cat_data.get('subcategories', [])

    #         if cat_name in existing_categories:
    #             # UPDATE existing category
    #             category                 = existing_categories[cat_name]
    #             category.alert_threshold = cat_data.get('alert_threshold', 80)
    #             category.order           = i
    #             category.save()
    #         else:
    #             # CREATE new category
    #             category = BudgetCategory.objects.create(
    #                 budget          = budget,
    #                 name            = cat_name,
    #                 alert_threshold = cat_data.get('alert_threshold', 80),
    #                 order           = i,
    #             )

    #         created_categories.append(category)

    #         # ── STEP 2: Sync Subcategories ──────────────────────────────────────
    #         existing_subs = {
    #             sub.name: sub
    #             for sub in BudgetSubCategory.objects.filter(category=category)
    #         }

    #         incoming_sub_names = [s.get('name', '') for s in subcats_data]

    #         # Delete subcategories no longer in payload
    #         for old_sub_name, old_sub in existing_subs.items():
    #             if old_sub_name not in incoming_sub_names:
    #                 old_sub.delete()

    #         # Update or create subcategories
    #         # Also build a name→instance map for resolving entries later
    #         subcat_name_to_instance = {}

    #         for si, sub_data in enumerate(subcats_data):
    #             sub_name = sub_data.get('name', '')

    #             if sub_name in existing_subs:
    #                 sub       = existing_subs[sub_name]
    #                 sub.order = sub_data.get('order', si)
    #                 sub.save()
    #             else:
    #                 sub = BudgetSubCategory.objects.create(
    #                     category = category,
    #                     name     = sub_name,
    #                     order    = sub_data.get('order', si),
    #                 )

    #             subcat_name_to_instance[sub_name] = sub

    #         # Store on category object so we can look it up in Step 3
    #         category._subcat_map = subcat_name_to_instance

    #     # ── STEP 3: Sync Period Entries ─────────────────────────────────────────
    #     # Build lookup of existing entries using subcategory_id (FK, not name)
    #     # Key: (category_id, month, subcategory_id)
    #     existing_entries = {
    #         (entry.category_id, entry.month, entry.subcategory_id): entry
    #         for entry in BudgetPeriodEntry.objects.filter(budget=budget)
    #     }

    #     incoming_entry_keys = set()

    #     for entry_data in entries_data:
    #         cat_index   = entry_data.get('category_index', 0)
    #         month       = entry_data.get('month', '')
    #         subcat_name = entry_data.get('subcategory_name', '')
    #         allocated   = entry_data.get('allocated', 0)
    #         spent       = entry_data.get('spent', 0)

    #         # Resolve category_index → BudgetCategory instance
    #         if 0 <= cat_index < len(created_categories):
    #             category = created_categories[cat_index]
    #         else:
    #             print(f"[_save_categories_and_entries] WARNING: "
    #                 f"category_index {cat_index} out of range. Skipping.")
    #             continue

    #         # Resolve subcategory name → BudgetSubCategory instance (get the FK id)
    #         subcat_map = getattr(category, '_subcat_map', {})
    #         subcat_instance = subcat_map.get(subcat_name)

    #         if subcat_instance is None:
    #             print(f"[_save_categories_and_entries] WARNING: "
    #                 f"subcategory '{subcat_name}' not found in category "
    #                 f"'{category.name}'. Skipping entry.")
    #             continue

    #         subcat_id  = subcat_instance.id
    #         lookup_key = (category.id, month, subcat_id)
    #         incoming_entry_keys.add(lookup_key)

    #         if lookup_key in existing_entries:
    #             # UPDATE existing entry
    #             entry           = existing_entries[lookup_key]
    #             entry.allocated = allocated
    #             entry.spent     = spent
    #             entry.save()
    #         else:
    #             # CREATE new entry
    #             BudgetPeriodEntry.objects.create(
    #                 budget      = budget,
    #                 category    = category,
    #                 subcategory = subcat_instance,   # FK instance
    #                 month       = month,
    #                 allocated   = allocated,
    #                 spent       = spent,
    #             )

    #     # Delete period entries no longer in the payload
    #     for existing_key, existing_entry in existing_entries.items():
    #         if existing_key not in incoming_entry_keys:
    #             existing_entry.delete()

    def _save_categories_and_entries(self, budget, categories_data, entries_data):
        from .models import BudgetCategory, BudgetSubCategory, BudgetPeriodEntry, User

        # ── STEP 1: Sync Categories ─────────────────────────────────────────────
        existing_categories = {
            cat.name: cat
            for cat in BudgetCategory.objects.filter(budget=budget)
        }
        incoming_cat_names = [cat_data.get('name', '') for cat_data in categories_data]

        # Delete categories no longer in payload
        for old_name, old_cat in existing_categories.items():
            if old_name not in incoming_cat_names:
                old_cat.delete()

        # This list MUST store actual Model instances
        created_categories = []

        for i, cat_data in enumerate(categories_data):
            cat_name = cat_data.get('name', '')
            subcats_data = cat_data.get('subcategories', [])

            if cat_name in existing_categories:
                # UPDATE existing instance
                category = existing_categories[cat_name]
                category.order = i
                category.save()
            else:
                # CREATE new instance
                category = BudgetCategory.objects.create(
                    budget=budget, 
                    name=cat_name, 
                    order=i
                )

            # Build a map of subcategories for this specific category instance
            existing_subs = {sub.name: sub for sub in BudgetSubCategory.objects.filter(category=category)}
            incoming_sub_names = [s.get('name', '') for s in subcats_data]

            for old_sub_name, old_sub in existing_subs.items():
                if old_sub_name not in incoming_sub_names:
                    old_sub.delete()

            subcat_name_to_instance = {}
            for si, sub_data in enumerate(subcats_data):
                sub_name = sub_data.get('name', '')
                if sub_name in existing_subs:
                    sub = existing_subs[sub_name]
                    sub.order = sub_data.get('order', si)
                    sub.save()
                else:
                    sub = BudgetSubCategory.objects.create(
                        category=category, 
                        name=sub_name, 
                        order=sub_data.get('order', si)
                    )
                subcat_name_to_instance[sub_name] = sub
            
            # Attach the map to the object so we can use it in Step 3
            category._subcat_map = subcat_name_to_instance
            created_categories.append(category)

        # ── STEP 2: Sync Period Entries ─────────────────────────────────────────
        existing_entries = {
            (entry.category_id, entry.month, entry.subcategory_id, entry.user_id): entry
            for entry in BudgetPeriodEntry.objects.filter(budget=budget)
        }

        incoming_entry_keys = set()

        for entry_data in entries_data:
            cat_index = entry_data.get('category_index')
            month = entry_data.get('month', '')
            subcat_name = entry_data.get('subcategory_name', '')
            user_id = entry_data.get('user_id')
            allocated = entry_data.get('allocated', 0)

            # 1. Validation: Get Category instance from our list
            try:
                category_instance = created_categories[int(cat_index)]
            except (IndexError, TypeError, ValueError):
                continue

            # 2. Validation: Get Subcategory instance from the map we built in Step 1
            subcat_map = getattr(category_instance, '_subcat_map', {})
            subcat_instance = subcat_map.get(subcat_name)
            
            if not subcat_instance:
                continue

            # 3. Validation: Get User instance
            try:
                user_instance = User.objects.get(id=user_id)
            except User.DoesNotExist:
                continue

            # Build unique key for this assignment
            lookup_key = (category_instance.id, month, subcat_instance.id, user_instance.id)
            incoming_entry_keys.add(lookup_key)

            if lookup_key in existing_entries:
                # UPDATE
                entry = existing_entries[lookup_key]
                entry.allocated = allocated
                entry.save()
            else:
                # CREATE
                BudgetPeriodEntry.objects.create(
                    budget=budget,
                    category=category_instance, # Passing the Instance, not a dict
                    subcategory=subcat_instance, # Passing the Instance
                    user=user_instance,         # Passing the Instance
                    month=month,
                    allocated=allocated
                )

        # ── STEP 3: Cleanup ──
        # Delete period entries that are no longer in the frontend matrix
        for existing_key, existing_entry in existing_entries.items():
            if existing_key not in incoming_entry_keys:
                existing_entry.delete()

    # def create(self, validated_data):
    #     categories_data = validated_data.pop('categories', [])
    #     entries_data    = validated_data.pop('period_entries', [])
    #     budget          = Budget.objects.create(**validated_data)
    #     self._save_categories_and_entries(budget, categories_data, entries_data)
    #     return budget

    # def update(self, instance, validated_data):
    #     categories_data = validated_data.pop('categories', [])
    #     entries_data    = validated_data.pop('period_entries', [])
    #     for attr, val in validated_data.items():
    #         setattr(instance, attr, val)
    #     instance.save()
    #     self._save_categories_and_entries(instance, categories_data, entries_data)
    #     return instance

    def _apply_financial_year_title(self, validated_data, instance=None):
        # Keep titles scoped to the current record only.
        # Do not auto-copy or auto-rename other budgets in the same FY.
        validated_data.pop('rename_fy_title', False)
        title = validated_data.get('title', getattr(instance, 'title', ''))
        if title is not None:
            validated_data['title'] = str(title).strip()
        return False

    def _rename_financial_year_budgets(self, budget, enabled):
        from django.db.models import Q

        if not enabled or not budget.start_date or not budget.end_date or not budget.title:
            return
        Budget.objects.filter(
            Q(start_date=budget.start_date, end_date=budget.end_date)
            | (
                Q(start_date__isnull=True)
                & Q(end_date__isnull=True)
                & Q(created_at__date__gte=budget.start_date)
                & Q(created_at__date__lte=budget.end_date)
            )
        ).exclude(pk=budget.pk).update(title=budget.title)

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])
        entries_data    = validated_data.pop('period_entries', [])
        rename_fy_title = self._apply_financial_year_title(validated_data)
        budget          = Budget.objects.create(**validated_data)
        self._rename_financial_year_budgets(budget, rename_fy_title)
        self._save_categories_and_entries(budget, categories_data, entries_data)
        return budget
 
    def update(self, instance, validated_data):
        """
        Update scalar fields on the budget instance, then
        sync categories and period entries in place (no delete/recreate).
        """
        # Pop nested data before updating scalar fields
        categories_data = validated_data.pop('categories', [])
        entries_data    = validated_data.pop('period_entries', [])
        rename_fy_title = self._apply_financial_year_title(validated_data, instance)

        # Update all scalar fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._rename_financial_year_budgets(instance, rename_fy_title)

        # Sync categories + entries in place
        self._save_categories_and_entries(instance, categories_data, entries_data)

        return instance
 
class BudgetDashboardSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    categories      = BudgetCategorySerializer(many=True, read_only=True)
    period_entries  = BudgetPeriodEntrySerializer(many=True, read_only=True)
    computed_total_budget = serializers.FloatField(read_only=True)
    total_budget    = serializers.FloatField(source='computed_total_budget', read_only=True)
    deals_closed = serializers.IntegerField(read_only=True)

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return ''
    class Meta:
        model  = Budget
        fields = [
            'id', 'title', 'period', 'quarter','selected_month', 'currency','total_budget','user_id','user_name',
            'computed_total_budget', 'revenue_target', 'target_deal_count',            
            'total_allocated', 
            'max_budget_per_deal', 'deals_closed','start_date', 'end_date',
            'notes', 'created_at',
            'categories', 'period_entries',
        ]
 

class GlobalSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = GlobalSubCategory
        fields = ['id', 'name', 'order']

class GlobalCategorySerializer(serializers.ModelSerializer):
    subcategories = GlobalSubCategorySerializer(many=True, read_only=True)
    class Meta:
        model  = GlobalCategory
        fields = ['id', 'name', 'order', 'subcategories']

#  forgot password==

from django.core.mail import send_mail
from django.conf import settings
import random
 
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
 
    def validate_email(self, value):
        User = get_user_model()
        if not User.objects.filter(email=value).exists():
            # Security: don't reveal whether email exists
            # We still return success on the frontend
            return value
        return value
 
 
class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
 
    def validate(self, attrs):
        from .models import PasswordResetOTP
        User = get_user_model()
 
        email = attrs.get('email')
        otp = attrs.get('otp')
 
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or OTP.')
 
        otp_obj = PasswordResetOTP.objects.filter(
            user=user, otp=otp, is_used=False
        ).order_by('-created_at').first()
 
        if not otp_obj or not otp_obj.is_valid():
            raise serializers.ValidationError('Invalid or expired OTP.')
 
        attrs['user'] = user
        attrs['otp_obj'] = otp_obj
        return attrs
 
 
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(max_length=68, min_length=6)
    confirm_password = serializers.CharField(max_length=68, min_length=6)
 
    def validate(self, attrs):
        from .models import PasswordResetOTP
        User = get_user_model()
 
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError('Passwords do not match.')
 
        email = attrs.get('email')
        otp = attrs.get('otp')
 
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid request.')
 
        otp_obj = PasswordResetOTP.objects.filter(
            user=user, otp=otp, is_used=False
        ).order_by('-created_at').first()
 
        if not otp_obj or not otp_obj.is_valid():
            raise serializers.ValidationError('Invalid or expired OTP. Please request a new one.')
 
        attrs['user'] = user
        attrs['otp_obj'] = otp_obj
        return attrs
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=68, min_length=6)
    new_password = serializers.CharField(max_length=68, min_length=6)
    confirm_password = serializers.CharField(max_length=68, min_length=6)
 
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError('New passwords do not match.')
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError('New password must be different from the old password.')
        return attrs
     

from .models import Resume
 
class ResumeSerializer(serializers.ModelSerializer):
    file_url        = serializers.SerializerMethodField()
    created_by_info = serializers.SerializerMethodField()

    class Meta:
        model  = Resume
        fields = [
            'id',
            'name', 'email', 'phone', 'designation', 'address',
            'raw_text',
            'status',
            'file', 'file_url',
            'created_at', 'created_by', 'created_by_info',
        ]
        read_only_fields = [
            'created_at', 'created_by', 'created_by_info',
            'status', 'raw_text',
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None

    def get_created_by_info(self, obj):
        if not obj.created_by:
            return None
        return {
            'id':       obj.created_by.id,
            'username': obj.created_by.username,
            'email':    obj.created_by.email,
        }
    

from rest_framework import serializers
from .models import PerformanceTarget, User


class PerformanceTargetWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceTarget
        fields = ['id', 'user', 'fiscal_year', 'sales_target']

# class PerformanceAttainmentReportSerializer(serializers.Serializer):
#     user_id = serializers.IntegerField()
#     username = serializers.CharField()
#     full_name = serializers.CharField()
    
#     # Financial Data (Targets vs Actuals)
#     target = serializers.FloatField()
#     actual_sales = serializers.FloatField()
#     sales_success_rate = serializers.FloatField() # Calculation: (Actual / Target) * 100
    
#     # Funnel Data (Process Efficiency)
#     total_leads = serializers.IntegerField()
#     converted_leads = serializers.IntegerField()
#     funnel_conv_rate = serializers.FloatField()   # Calculation: (Converted / Total) * 100

class PerformanceAttainmentReportSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    full_name = serializers.CharField()
    
    # Financial Data (Targets vs Actuals)
    target = serializers.FloatField()
    actual_sales = serializers.FloatField()
    sales_success_rate = serializers.FloatField()
    
    # Funnel Data (Process Efficiency)
    total_leads = serializers.IntegerField()
    converted_leads = serializers.IntegerField()
    funnel_conv_rate = serializers.FloatField()
    
    # ✅ NEW FY metadata
    fy_year = serializers.IntegerField(required=False)
    fy_label = serializers.CharField(required=False)
