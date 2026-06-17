from django.contrib import admin

# Register your models here.
from .models import User,AddAccountData,Opportunity,AddTargetData,AddTaskData,CompanyDetails,Contact,FinanceInformation,Opportunity_Events,Opportunity_Pic,Opportunity_Stage,Opportunity_Tasks
from .models import Lead

admin.site.register(Lead)
admin.site.register(User)
admin.site.register(AddAccountData)
#admin.site.register(Opportunity)
admin.site.register(AddTargetData)
admin.site.register(AddTaskData)
# admin.site.register(AddLeadData)
admin.site.register(FinanceInformation)
admin.site.register(Contact)
admin.site.register(CompanyDetails)
admin.site.register(Opportunity_Tasks)
admin.site.register(Opportunity_Events)
admin.site.register(Opportunity_Pic)
admin.site.register(Opportunity_Stage)




@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    
    list_display = (
        'user', 'account_name', 'opportunity', 'make', 'sub_make',
            'sub_make_brand', 'pic', 'contact_person', 'designation', 'department', 'mobile_number',
            'email_id', 'location', 'state', 'city', 'address',  'qty',
            'values', 'exp_closure_date', 'exp_po_date', 'remarks', 
            'hardware_amount', 'software_amount', 'consumables_amount', 'automation_amount',
            'solution_amount', 'maintenance_amount', 'others_amount', 'total_amount',
            'status', 'vertical','last_update',
    )
    
    list_filter = ('state', 'city', 'status', 'last_update')
    
    search_fields = ( 'opportunity', 'mobile_number', 'email_id', 'state', 'city')
    
    list_editable = ('status', 'total_amount')
    ordering = ('-last_update',)
