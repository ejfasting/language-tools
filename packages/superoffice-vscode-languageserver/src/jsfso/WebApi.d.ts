import * as base from './WebApiBase.js';
import { AxiosRequestConfig } from 'axios';
export * from './Day_js.js';
export * from './SoApiConstants.js';
import { IQuoteAgent, QuoteAgent } from './QuoteAgent.js';
export { QuoteAgent };
import { IErpSyncAgent, ErpSyncAgent } from './ErpSyncAgent.js';
export { ErpSyncAgent };
import { IResourceAgent, ResourceAgent } from './ResourceAgent.js';
export { ResourceAgent };
import { IContactAgent, ContactAgent } from './ContactAgent.js';
export { ContactAgent };
import { IPersonAgent, PersonAgent } from './PersonAgent.js';
export { PersonAgent };
import { ISaleAgent, SaleAgent } from './SaleAgent.js';
export { SaleAgent };
import { IPhoneListAgent, PhoneListAgent } from './PhoneListAgent.js';
export { PhoneListAgent };
import { IProjectAgent, ProjectAgent } from './ProjectAgent.js';
export { ProjectAgent };
import { IAppointmentAgent, AppointmentAgent } from './AppointmentAgent.js';
export { AppointmentAgent };
import { IForeignSystemAgent, ForeignSystemAgent } from './ForeignSystemAgent.js';
export { ForeignSystemAgent };
import { IDocumentAgent, DocumentAgent } from './DocumentAgent.js';
export { DocumentAgent };
import { IListAgent, ListAgent } from './ListAgent.js';
export { ListAgent };
import { IBLOBAgent, BLOBAgent } from './BLOBAgent.js';
export { BLOBAgent };
import { INavigatorAgent, NavigatorAgent } from './NavigatorAgent.js';
export { NavigatorAgent };
import { IMDOAgent, MDOAgent } from './MDOAgent.js';
export { MDOAgent };
import { IConfigurationAgent, ConfigurationAgent } from './ConfigurationAgent.js';
export { ConfigurationAgent };
import { IViewStateAgent, ViewStateAgent } from './ViewStateAgent.js';
export { ViewStateAgent };
import { IAssociateAgent, AssociateAgent } from './AssociateAgent.js';
export { AssociateAgent };
import { IDiagnosticsAgent, DiagnosticsAgent } from './DiagnosticsAgent.js';
export { DiagnosticsAgent };
import { ITooltipsAgent, TooltipsAgent } from './TooltipsAgent.js';
export { TooltipsAgent };
import { IPreviewsAgent, PreviewsAgent } from './PreviewsAgent.js';
export { PreviewsAgent };
import { ISelectionAgent, SelectionAgent } from './SelectionAgent.js';
export { SelectionAgent };
import { IEMailAgent, EMailAgent } from './EMailAgent.js';
export { EMailAgent };
import { IFindAgent, FindAgent } from './FindAgent.js';
export { FindAgent };
import { IWebhookAgent, WebhookAgent } from './WebhookAgent.js';
export { WebhookAgent };
import { ISentryAgent, SentryAgent } from './SentryAgent.js';
export { SentryAgent };
import { IUserDefinedFieldInfoAgent, UserDefinedFieldInfoAgent } from './UserDefinedFieldInfoAgent.js';
export { UserDefinedFieldInfoAgent };
import { IReportAgent, ReportAgent } from './ReportAgent.js';
export { ReportAgent };
import { ISaintAgent, SaintAgent } from './SaintAgent.js';
export { SaintAgent };
import { IBatchAgent, BatchAgent } from './BatchAgent.js';
export { BatchAgent };
import { IRelationAgent, RelationAgent } from './RelationAgent.js';
export { RelationAgent };
import { IArchiveAgent, ArchiveAgent } from './ArchiveAgent.js';
export { ArchiveAgent };
import { IAudienceAgent, AudienceAgent } from './AudienceAgent.js';
export { AudienceAgent };
import { IPreferenceAgent, PreferenceAgent } from './PreferenceAgent.js';
export { PreferenceAgent };
import { ILicenseAgent, LicenseAgent } from './LicenseAgent.js';
export { LicenseAgent };
import { IUserAgent, UserAgent } from './UserAgent.js';
export { UserAgent };
import { IReplicationAgent, ReplicationAgent } from './ReplicationAgent.js';
export { ReplicationAgent };
import { ITimeZoneAgent, TimeZoneAgent } from './TimeZoneAgent.js';
export { TimeZoneAgent };
import { IMessagingAgent, MessagingAgent } from './MessagingAgent.js';
export { MessagingAgent };
import { IImportAgent, ImportAgent } from './ImportAgent.js';
export { ImportAgent };
import { IFreeTextAgent, FreeTextAgent } from './FreeTextAgent.js';
export { FreeTextAgent };
import { INumberAllocationAgent, NumberAllocationAgent } from './NumberAllocationAgent.js';
export { NumberAllocationAgent };
import { ICustomerServiceAgent, CustomerServiceAgent } from './CustomerServiceAgent.js';
export { CustomerServiceAgent };
import { IPocketAgent, PocketAgent } from './PocketAgent.js';
export { PocketAgent };
import { IDashboardAgent, DashboardAgent } from './DashboardAgent.js';
export { DashboardAgent };
import { IDashAgent, DashAgent } from './DashAgent.js';
export { DashAgent };
import { ITargetsAgent, TargetsAgent } from './TargetsAgent.js';
export { TargetsAgent };
import { IFavouriteAgent, FavouriteAgent } from './FavouriteAgent.js';
export { FavouriteAgent };
import { IDatabaseAgent, DatabaseAgent } from './DatabaseAgent.js';
export { DatabaseAgent };
import { IBulkUpdateAgent, BulkUpdateAgent } from './BulkUpdateAgent.js';
export { BulkUpdateAgent };
import { IMarketingAgent, MarketingAgent } from './MarketingAgent.js';
export { MarketingAgent };
import { ICRMScriptAgent, CRMScriptAgent } from './CRMScriptAgent.js';
export { CRMScriptAgent };
import { ITicketAgent, TicketAgent } from './TicketAgent.js';
export { TicketAgent };
import { IDatabaseTableAgent, DatabaseTableAgent } from './DatabaseTableAgent.js';
export { DatabaseTableAgent };
import { IChatAgent, ChatAgent } from './ChatAgent.js';
export { ChatAgent };
import { IAIAgent, AIAgent } from './AIAgent.js';
export { AIAgent };
import { IDocumentMigrationAgent, DocumentMigrationAgent } from './DocumentMigrationAgent.js';
export { DocumentMigrationAgent };
import { IWorkflowAgent, WorkflowAgent } from './WorkflowAgent.js';
export { WorkflowAgent };
import { IContactRestApi, ContactRestApi } from './ContactRestApi.js';
export { ContactRestApi };
import { IPersonRestApi, PersonRestApi } from './PersonRestApi.js';
export { PersonRestApi };
import { ISaleRestApi, SaleRestApi } from './SaleRestApi.js';
export { SaleRestApi };
import { IProjectRestApi, ProjectRestApi } from './ProjectRestApi.js';
export { ProjectRestApi };
import { IAppointmentRestApi, AppointmentRestApi } from './AppointmentRestApi.js';
export { AppointmentRestApi };
import { IDocumentRestApi, DocumentRestApi } from './DocumentRestApi.js';
export { DocumentRestApi };
import { WebApiStatus, WebApiRequestOptions, WebApiOptions, ResourceParsing } from './WebApiBase.js';
export { WebApiStatus, WebApiRequestOptions, WebApiOptions, ResourceParsing };
import { PriceList, Product, QuoteAlternative, ErpSyncConnectorEntity, ContactEntity, PreviewContact, ConsentPerson, PersonEntity, PersonImage, SaleEntity, SaleStakeholder, SaleSummary, ProjectEntity, ProjectEventEntity, ProjectMember, AppointmentEntity, SuggestedAppointmentEntity, TaskListItem, ForeignAppEntity, DocumentEntity, DocumentPreview, SuggestedDocumentEntity, TemplateVariablesParameters, AmountClassEntity, TaskMenu, CurrencyEntity, DocumentTemplateEntity, ExtAppEntity, HeadingEntity, HierarchyEntity, ListEntity, ListItemEntity, ProjectTypeEntity, RelationDefinitionEntity, ResourceEntity, SaleStageEntity, SaleTypeEntity, TicketCategoryEntity, TicketPriorityEntity, TicketStatusEntity, TicketTypeEntity, WebPanelEntity, BlobEntity, ConfigurableScreenDelta, DiaryViewEntity, SystemEventEntity, MailMergeSettings, MailMergeTask, SelectionEntity, EMailAccount, EMailAddress, EMailAppointment, EMailAttachment, EMailConnectionInfo, EMailConnectionInfoExtended, EMailCustomHeader, EMailEntity, EMailEnvelope, EMailFolder, EMailSOInfo, Webhook, UserDefinedFieldInfo, ReportEntity, ReportLabelLayoutEntity, SaintConfiguration, StatusMonitor, StatusMonitorPeriods, ContactRelationEntity, ArchiveListResult, AudienceLayoutEntity, Preference, PreferenceDescription, PreferenceDescriptionLine, RoleEntity, ServiceAuth, UntrustedCredentials, User, Satellite, RefCountEntity, CustomerCenterConfig, MailboxEntity, SmsConfig, Dashboard, DashboardTile, Dash, DashCollection, DashTheme, DashTile, DashTileDefinition, PreviewDash, PreviewDashTile, TargetAssignment, TargetDimension, TargetGroup, TargetRevision, TargetRevisionHistory, FormEntity, FormSubmissionEntity, ShipmentMessageBlockEntity, ShipmentMessageEntity, CRMScriptEntity, TriggerScriptEntity, AttachmentEntity, TicketEntity, TicketMessageEntity, ChatSessionEntity, ChatTopicAgent, ChatTopicEntity, DocumentMigrationItemList, DocumentTemplateMigrationList, EmailFlow, WorkflowEvent, WorkflowEventResult, WorkflowFilter, WorkflowGoal, WorkflowStepOption, WorkflowTrigger } from './Carriers.js';
export { PriceList, Product, QuoteAlternative, ErpSyncConnectorEntity, ContactEntity, PreviewContact, ConsentPerson, PersonEntity, PersonImage, SaleEntity, SaleStakeholder, SaleSummary, ProjectEntity, ProjectEventEntity, ProjectMember, AppointmentEntity, SuggestedAppointmentEntity, TaskListItem, ForeignAppEntity, DocumentEntity, DocumentPreview, SuggestedDocumentEntity, TemplateVariablesParameters, AmountClassEntity, TaskMenu, CurrencyEntity, DocumentTemplateEntity, ExtAppEntity, HeadingEntity, HierarchyEntity, ListEntity, ListItemEntity, ProjectTypeEntity, RelationDefinitionEntity, ResourceEntity, SaleStageEntity, SaleTypeEntity, TicketCategoryEntity, TicketPriorityEntity, TicketStatusEntity, TicketTypeEntity, WebPanelEntity, BlobEntity, ConfigurableScreenDelta, DiaryViewEntity, SystemEventEntity, MailMergeSettings, MailMergeTask, SelectionEntity, EMailAccount, EMailAddress, EMailAppointment, EMailAttachment, EMailConnectionInfo, EMailConnectionInfoExtended, EMailCustomHeader, EMailEntity, EMailEnvelope, EMailFolder, EMailSOInfo, Webhook, UserDefinedFieldInfo, ReportEntity, ReportLabelLayoutEntity, SaintConfiguration, StatusMonitor, StatusMonitorPeriods, ContactRelationEntity, ArchiveListResult, AudienceLayoutEntity, Preference, PreferenceDescription, PreferenceDescriptionLine, RoleEntity, ServiceAuth, UntrustedCredentials, User, Satellite, RefCountEntity, CustomerCenterConfig, MailboxEntity, SmsConfig, Dashboard, DashboardTile, Dash, DashCollection, DashTheme, DashTile, DashTileDefinition, PreviewDash, PreviewDashTile, TargetAssignment, TargetDimension, TargetGroup, TargetRevision, TargetRevisionHistory, FormEntity, FormSubmissionEntity, ShipmentMessageBlockEntity, ShipmentMessageEntity, CRMScriptEntity, TriggerScriptEntity, AttachmentEntity, TicketEntity, TicketMessageEntity, ChatSessionEntity, ChatTopicAgent, ChatTopicEntity, DocumentMigrationItemList, DocumentTemplateMigrationList, EmailFlow, WorkflowEvent, WorkflowEventResult, WorkflowFilter, WorkflowGoal, WorkflowStepOption, WorkflowTrigger };
/**
 * SuperOffice REST API - configure base URL and authentication here, then get the Rest endpoints you want to use.
 */
export interface IRestApi extends base.WebApiBase {
    /** The Contact Service. The service implements all services working with the Contact object */
    getContactRestApi(resourceParsing?: base.ResourceParsing): IContactRestApi;
    /** The Person Service. The service implements all services working with the Person object. */
    getPersonRestApi(resourceParsing?: base.ResourceParsing): IPersonRestApi;
    /** The Sale Entity contains the sale amount, currency, and sale members. Sales are linked to contacts, persons, and/or projects. */
    getSaleRestApi(resourceParsing?: base.ResourceParsing): ISaleRestApi;
    /** The Project Service. The service implements all services working with the Project object */
    getProjectRestApi(resourceParsing?: base.ResourceParsing): IProjectRestApi;
    /** Appointments appear in the diary, and have links to a Contact/Person and possibly a Project or Sale. They have start and end time+date. */
    getAppointmentRestApi(resourceParsing?: base.ResourceParsing): IAppointmentRestApi;
    /**  */
    getDocumentRestApi(resourceParsing?: base.ResourceParsing): IDocumentRestApi;
}
/**
 * SuperOffice Agents API - configure base URL and authentication here, then get the agents you want to use.
 */
export interface IAgentsApi extends base.WebApiBase {
    /** Services for the Quote Management feature, part of the Sale module */
    getQuoteAgent(resourceParsing?: base.ResourceParsing): IQuoteAgent;
    /** Services for the ERP Integration Services feature */
    getErpSyncAgent(resourceParsing?: base.ResourceParsing): IErpSyncAgent;
    /** String resource substitution management. */
    getResourceAgent(resourceParsing?: base.ResourceParsing): IResourceAgent;
    /** Contact (company) data services. */
    getContactAgent(resourceParsing?: base.ResourceParsing): IContactAgent;
    /** Person data services. */
    getPersonAgent(resourceParsing?: base.ResourceParsing): IPersonAgent;
    /** Sale data services */
    getSaleAgent(resourceParsing?: base.ResourceParsing): ISaleAgent;
    /** Collection of all services for searching for person or contact (company) phone numbers. */
    getPhoneListAgent(resourceParsing?: base.ResourceParsing): IPhoneListAgent;
    /** Collection of all services that works with Project data. */
    getProjectAgent(resourceParsing?: base.ResourceParsing): IProjectAgent;
    /** Collection of all services that works with Appointment data. */
    getAppointmentAgent(resourceParsing?: base.ResourceParsing): IAppointmentAgent;
    /** Collection of all services that works with Foreign key data (Key/Value pairs) */
    getForeignSystemAgent(resourceParsing?: base.ResourceParsing): IForeignSystemAgent;
    /** Collection of all services that works with Document data. This is services for the document information, not the physical document themselves. These are handled by the BLOB service methods. */
    getDocumentAgent(resourceParsing?: base.ResourceParsing): IDocumentAgent;
    /** Collection of all services that works with Lists. These are typical lists of data shown in dropdown list, checkbox lists, etc. */
    getListAgent(resourceParsing?: base.ResourceParsing): IListAgent;
    /** Collection of all services that works with binary objects (BLOBS), e.g. Images and documents. */
    getBLOBAgent(resourceParsing?: base.ResourceParsing): IBLOBAgent;
    /** Navigator stuff. */
    getNavigatorAgent(resourceParsing?: base.ResourceParsing): INavigatorAgent;
    /** MDO Lists, reading, searching, and item lookup. */
    getMDOAgent(resourceParsing?: base.ResourceParsing): IMDOAgent;
    /** User interface configuration - XMLs and other elements such as inter-client URLs */
    getConfigurationAgent(resourceParsing?: base.ResourceParsing): IConfigurationAgent;
    /** User interface view state, history, currentXXX values */
    getViewStateAgent(resourceParsing?: base.ResourceParsing): IViewStateAgent;
    /** Associate utilities, notes, not user admininstration */
    getAssociateAgent(resourceParsing?: base.ResourceParsing): IAssociateAgent;
    /** Diagnostics, usage data collection, caches and flushing */
    getDiagnosticsAgent(resourceParsing?: base.ResourceParsing): IDiagnosticsAgent;
    /** Tooltip system, hint to text transformation */
    getTooltipsAgent(resourceParsing?: base.ResourceParsing): ITooltipsAgent;
    /** Get preview strings from a hint */
    getPreviewsAgent(resourceParsing?: base.ResourceParsing): IPreviewsAgent;
    /** Selections, entities, members and tasks */
    getSelectionAgent(resourceParsing?: base.ResourceParsing): ISelectionAgent;
    /** Email connection, reading, sending */
    getEMailAgent(resourceParsing?: base.ResourceParsing): IEMailAgent;
    /** Find functions */
    getFindAgent(resourceParsing?: base.ResourceParsing): IFindAgent;
    /** Webhook definitions - webhooks signal other systems about events inside NetServer */
    getWebhookAgent(resourceParsing?: base.ResourceParsing): IWebhookAgent;
    /** Data and function right queries */
    getSentryAgent(resourceParsing?: base.ResourceParsing): ISentryAgent;
    /** Returns information about user-defined fields, like field type, field size, field label text, default value. Does not return the actual values in the user-defined fields. The values are returned on the entity objects. */
    getUserDefinedFieldInfoAgent(resourceParsing?: base.ResourceParsing): IUserDefinedFieldInfoAgent;
    /** Run reports, set favourites, labels */
    getReportAgent(resourceParsing?: base.ResourceParsing): IReportAgent;
    /** Administration and maintenance of SAINT counters and statuses */
    getSaintAgent(resourceParsing?: base.ResourceParsing): ISaintAgent;
    /** Start, stop and monitor predefined batch tasks */
    getBatchAgent(resourceParsing?: base.ResourceParsing): IBatchAgent;
    /** Contact/Person relations */
    getRelationAgent(resourceParsing?: base.ResourceParsing): IRelationAgent;
    /** ArchiveList functions of all kinds */
    getArchiveAgent(resourceParsing?: base.ResourceParsing): IArchiveAgent;
    /** Services specific to the Audience client */
    getAudienceAgent(resourceParsing?: base.ResourceParsing): IAudienceAgent;
    /** Preferences, user interface tab configuration */
    getPreferenceAgent(resourceParsing?: base.ResourceParsing): IPreferenceAgent;
    /** License query, download, activation */
    getLicenseAgent(resourceParsing?: base.ResourceParsing): ILicenseAgent;
    /** User administration */
    getUserAgent(resourceParsing?: base.ResourceParsing): IUserAgent;
    /** Replication/Travel administration */
    getReplicationAgent(resourceParsing?: base.ResourceParsing): IReplicationAgent;
    /** TimeZone maintenance */
    getTimeZoneAgent(resourceParsing?: base.ResourceParsing): ITimeZoneAgent;
    /** SMS and other external messaging systems */
    getMessagingAgent(resourceParsing?: base.ResourceParsing): IMessagingAgent;
    /** This agent can be used to import data into the system */
    getImportAgent(resourceParsing?: base.ResourceParsing): IImportAgent;
    /** This agent can be used to manage the free text system */
    getFreeTextAgent(resourceParsing?: base.ResourceParsing): IFreeTextAgent;
    /** This agent can be used to manage number allocation */
    getNumberAllocationAgent(resourceParsing?: base.ResourceParsing): INumberAllocationAgent;
    /** Agent used for Customer Service methods */
    getCustomerServiceAgent(resourceParsing?: base.ResourceParsing): ICustomerServiceAgent;
    /** Agent with Pocket specific functionality */
    getPocketAgent(resourceParsing?: base.ResourceParsing): IPocketAgent;
    /** Agent lets you configure dashboard tiles and retrieve dashboard data */
    getDashboardAgent(resourceParsing?: base.ResourceParsing): IDashboardAgent;
    /** Agent that lets you configure dashboard tiles and retrieve dashboard data */
    getDashAgent(resourceParsing?: base.ResourceParsing): IDashAgent;
    /** Agent lets you configure targets, and retrieve targets */
    getTargetsAgent(resourceParsing?: base.ResourceParsing): ITargetsAgent;
    /** Agent used for retrieveing and setting favourites */
    getFavouriteAgent(resourceParsing?: base.ResourceParsing): IFavouriteAgent;
    /** Database schema queries and changes */
    getDatabaseAgent(resourceParsing?: base.ResourceParsing): IDatabaseAgent;
    /** Agent used for bulk update methods */
    getBulkUpdateAgent(resourceParsing?: base.ResourceParsing): IBulkUpdateAgent;
    /** Agent used for Marketing functions, such as Forms */
    getMarketingAgent(resourceParsing?: base.ResourceParsing): IMarketingAgent;
    /** Manage and execute CRMScript functions. */
    getCRMScriptAgent(resourceParsing?: base.ResourceParsing): ICRMScriptAgent;
    /** Agent used for Ticket functions */
    getTicketAgent(resourceParsing?: base.ResourceParsing): ITicketAgent;
    /** Agent used for CRUD operations on database tables. Read, add, update, delete rows in tables. */
    getDatabaseTableAgent(resourceParsing?: base.ResourceParsing): IDatabaseTableAgent;
    /** Chat functions. Manage chat channels, sessions and messages. */
    getChatAgent(resourceParsing?: base.ResourceParsing): IChatAgent;
    /** AI services, such as Translation, Statistics, Sentiment analysis, backed by calls to Public Cloud providers */
    getAIAgent(resourceParsing?: base.ResourceParsing): IAIAgent;
    /** Agent used to support migrating documents between different document-plugins, as single documents or batches. */
    getDocumentMigrationAgent(resourceParsing?: base.ResourceParsing): IDocumentMigrationAgent;
    /** Agent lets you configure workflow automation */
    getWorkflowAgent(resourceParsing?: base.ResourceParsing): IWorkflowAgent;
}
/**
 * WebApi Agents connection - configure base URL and authentication here, then get the agents you want to use.
 */
export declare class WebApi extends base.WebApiBase implements IAgentsApi, IRestApi {
    constructor(baseUrl?: string, languageCode?: string, cultureCode?: string);
    constructor(baseUrl?: string, resourceParsing?: base.ResourceParsing);
    constructor(baseUrl: string, resourceManager: any);
    constructor(baseUrl: string, config: AxiosRequestConfig, resourceManager: any);
    constructor(baseUrl: string, config: AxiosRequestConfig, resourceParsing?: base.ResourceParsing);
    constructor(baseUrl: string, config: AxiosRequestConfig, languageCode?: string, cultureCode?: string);
    constructor(options: base.WebApiOptions, config?: AxiosRequestConfig);
    /** Define global options for webapi agents. Once called, you don't need to pass baseUrl to agents.
     *  This configuration also happens first time an agent is constructed.
     */
    static configure(baseUrlOrOptions: string | base.WebApiOptions, configOrOptions?: AxiosRequestConfig | base.WebApiOptions, resourceManagerOrOptions?: any): void;
    /** Authenticate with Basic username:password value. Will not work in CRM Online. */
    authenticateWithPassword(username: string, password: string): void;
    /** Authenticate with SOTicket value. */
    authenticateWithTicket(ticket: string): void;
    /** Authenticate with Bearer token */
    authenticateWithToken(token: string): void;
    /** Set SO-AppToken header when talking to CRM Online */
    applicationToken(token: string): void;
    /** The Contact Service. The service implements all services working with the Contact object */
    getContactRestApi(resourceParsing?: base.ResourceParsing): IContactRestApi;
    /** The Person Service. The service implements all services working with the Person object. */
    getPersonRestApi(resourceParsing?: base.ResourceParsing): IPersonRestApi;
    /** The Sale Entity contains the sale amount, currency, and sale members. Sales are linked to contacts, persons, and/or projects. */
    getSaleRestApi(resourceParsing?: base.ResourceParsing): ISaleRestApi;
    /** The Project Service. The service implements all services working with the Project object */
    getProjectRestApi(resourceParsing?: base.ResourceParsing): IProjectRestApi;
    /** Appointments appear in the diary, and have links to a Contact/Person and possibly a Project or Sale. They have start and end time+date. */
    getAppointmentRestApi(resourceParsing?: base.ResourceParsing): IAppointmentRestApi;
    /**  */
    getDocumentRestApi(resourceParsing?: base.ResourceParsing): IDocumentRestApi;
    /** Services for the Quote Management feature, part of the Sale module */
    getQuoteAgent(resourceParsing?: base.ResourceParsing): IQuoteAgent;
    /** Services for the ERP Integration Services feature */
    getErpSyncAgent(resourceParsing?: base.ResourceParsing): IErpSyncAgent;
    /** String resource substitution management. */
    getResourceAgent(resourceParsing?: base.ResourceParsing): IResourceAgent;
    /** Contact (company) data services. */
    getContactAgent(resourceParsing?: base.ResourceParsing): IContactAgent;
    /** Person data services. */
    getPersonAgent(resourceParsing?: base.ResourceParsing): IPersonAgent;
    /** Sale data services */
    getSaleAgent(resourceParsing?: base.ResourceParsing): ISaleAgent;
    /** Collection of all services for searching for person or contact (company) phone numbers. */
    getPhoneListAgent(resourceParsing?: base.ResourceParsing): IPhoneListAgent;
    /** Collection of all services that works with Project data. */
    getProjectAgent(resourceParsing?: base.ResourceParsing): IProjectAgent;
    /** Collection of all services that works with Appointment data. */
    getAppointmentAgent(resourceParsing?: base.ResourceParsing): IAppointmentAgent;
    /** Collection of all services that works with Foreign key data (Key/Value pairs) */
    getForeignSystemAgent(resourceParsing?: base.ResourceParsing): IForeignSystemAgent;
    /** Collection of all services that works with Document data. This is services for the document information, not the physical document themselves. These are handled by the BLOB service methods. */
    getDocumentAgent(resourceParsing?: base.ResourceParsing): IDocumentAgent;
    /** Collection of all services that works with Lists. These are typical lists of data shown in dropdown list, checkbox lists, etc. */
    getListAgent(resourceParsing?: base.ResourceParsing): IListAgent;
    /** Collection of all services that works with binary objects (BLOBS), e.g. Images and documents. */
    getBLOBAgent(resourceParsing?: base.ResourceParsing): IBLOBAgent;
    /** Navigator stuff. */
    getNavigatorAgent(resourceParsing?: base.ResourceParsing): INavigatorAgent;
    /** MDO Lists, reading, searching, and item lookup. */
    getMDOAgent(resourceParsing?: base.ResourceParsing): IMDOAgent;
    /** User interface configuration - XMLs and other elements such as inter-client URLs */
    getConfigurationAgent(resourceParsing?: base.ResourceParsing): IConfigurationAgent;
    /** User interface view state, history, currentXXX values */
    getViewStateAgent(resourceParsing?: base.ResourceParsing): IViewStateAgent;
    /** Associate utilities, notes, not user admininstration */
    getAssociateAgent(resourceParsing?: base.ResourceParsing): IAssociateAgent;
    /** Diagnostics, usage data collection, caches and flushing */
    getDiagnosticsAgent(resourceParsing?: base.ResourceParsing): IDiagnosticsAgent;
    /** Tooltip system, hint to text transformation */
    getTooltipsAgent(resourceParsing?: base.ResourceParsing): ITooltipsAgent;
    /** Get preview strings from a hint */
    getPreviewsAgent(resourceParsing?: base.ResourceParsing): IPreviewsAgent;
    /** Selections, entities, members and tasks */
    getSelectionAgent(resourceParsing?: base.ResourceParsing): ISelectionAgent;
    /** Email connection, reading, sending */
    getEMailAgent(resourceParsing?: base.ResourceParsing): IEMailAgent;
    /** Find functions */
    getFindAgent(resourceParsing?: base.ResourceParsing): IFindAgent;
    /** Webhook definitions - webhooks signal other systems about events inside NetServer */
    getWebhookAgent(resourceParsing?: base.ResourceParsing): IWebhookAgent;
    /** Data and function right queries */
    getSentryAgent(resourceParsing?: base.ResourceParsing): ISentryAgent;
    /** Returns information about user-defined fields, like field type, field size, field label text, default value. Does not return the actual values in the user-defined fields. The values are returned on the entity objects. */
    getUserDefinedFieldInfoAgent(resourceParsing?: base.ResourceParsing): IUserDefinedFieldInfoAgent;
    /** Run reports, set favourites, labels */
    getReportAgent(resourceParsing?: base.ResourceParsing): IReportAgent;
    /** Administration and maintenance of SAINT counters and statuses */
    getSaintAgent(resourceParsing?: base.ResourceParsing): ISaintAgent;
    /** Start, stop and monitor predefined batch tasks */
    getBatchAgent(resourceParsing?: base.ResourceParsing): IBatchAgent;
    /** Contact/Person relations */
    getRelationAgent(resourceParsing?: base.ResourceParsing): IRelationAgent;
    /** ArchiveList functions of all kinds */
    getArchiveAgent(resourceParsing?: base.ResourceParsing): IArchiveAgent;
    /** Services specific to the Audience client */
    getAudienceAgent(resourceParsing?: base.ResourceParsing): IAudienceAgent;
    /** Preferences, user interface tab configuration */
    getPreferenceAgent(resourceParsing?: base.ResourceParsing): IPreferenceAgent;
    /** License query, download, activation */
    getLicenseAgent(resourceParsing?: base.ResourceParsing): ILicenseAgent;
    /** User administration */
    getUserAgent(resourceParsing?: base.ResourceParsing): IUserAgent;
    /** Replication/Travel administration */
    getReplicationAgent(resourceParsing?: base.ResourceParsing): IReplicationAgent;
    /** TimeZone maintenance */
    getTimeZoneAgent(resourceParsing?: base.ResourceParsing): ITimeZoneAgent;
    /** SMS and other external messaging systems */
    getMessagingAgent(resourceParsing?: base.ResourceParsing): IMessagingAgent;
    /** This agent can be used to import data into the system */
    getImportAgent(resourceParsing?: base.ResourceParsing): IImportAgent;
    /** This agent can be used to manage the free text system */
    getFreeTextAgent(resourceParsing?: base.ResourceParsing): IFreeTextAgent;
    /** This agent can be used to manage number allocation */
    getNumberAllocationAgent(resourceParsing?: base.ResourceParsing): INumberAllocationAgent;
    /** Agent used for Customer Service methods */
    getCustomerServiceAgent(resourceParsing?: base.ResourceParsing): ICustomerServiceAgent;
    /** Agent with Pocket specific functionality */
    getPocketAgent(resourceParsing?: base.ResourceParsing): IPocketAgent;
    /** Agent lets you configure dashboard tiles and retrieve dashboard data */
    getDashboardAgent(resourceParsing?: base.ResourceParsing): IDashboardAgent;
    /** Agent that lets you configure dashboard tiles and retrieve dashboard data */
    getDashAgent(resourceParsing?: base.ResourceParsing): IDashAgent;
    /** Agent lets you configure targets, and retrieve targets */
    getTargetsAgent(resourceParsing?: base.ResourceParsing): ITargetsAgent;
    /** Agent used for retrieveing and setting favourites */
    getFavouriteAgent(resourceParsing?: base.ResourceParsing): IFavouriteAgent;
    /** Database schema queries and changes */
    getDatabaseAgent(resourceParsing?: base.ResourceParsing): IDatabaseAgent;
    /** Agent used for bulk update methods */
    getBulkUpdateAgent(resourceParsing?: base.ResourceParsing): IBulkUpdateAgent;
    /** Agent used for Marketing functions, such as Forms */
    getMarketingAgent(resourceParsing?: base.ResourceParsing): IMarketingAgent;
    /** Manage and execute CRMScript functions. */
    getCRMScriptAgent(resourceParsing?: base.ResourceParsing): ICRMScriptAgent;
    /** Agent used for Ticket functions */
    getTicketAgent(resourceParsing?: base.ResourceParsing): ITicketAgent;
    /** Agent used for CRUD operations on database tables. Read, add, update, delete rows in tables. */
    getDatabaseTableAgent(resourceParsing?: base.ResourceParsing): IDatabaseTableAgent;
    /** Chat functions. Manage chat channels, sessions and messages. */
    getChatAgent(resourceParsing?: base.ResourceParsing): IChatAgent;
    /** AI services, such as Translation, Statistics, Sentiment analysis, backed by calls to Public Cloud providers */
    getAIAgent(resourceParsing?: base.ResourceParsing): IAIAgent;
    /** Agent used to support migrating documents between different document-plugins, as single documents or batches. */
    getDocumentMigrationAgent(resourceParsing?: base.ResourceParsing): IDocumentMigrationAgent;
    /** Agent lets you configure workflow automation */
    getWorkflowAgent(resourceParsing?: base.ResourceParsing): IWorkflowAgent;
}
//# sourceMappingURL=WebApi.d.ts.map