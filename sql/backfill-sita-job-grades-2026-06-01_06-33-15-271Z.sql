-- ════════════════════════════════════════════════════════════════════
-- Backfill SITA job_profiles.job_grade_id from exqi-export source data.
-- Generated: 2026-06-01T06:33:15.452Z
-- Snapshot file: backups\job_profiles-grade-pre-backfill-2026-06-01_06-33-15-271Z.json
-- ════════════════════════════════════════════════════════════════════
-- Safe to re-run: every UPDATE has WHERE job_grade_id IS NULL so
-- already-set rows are never overwritten.
-- ════════════════════════════════════════════════════════════════════

BEGIN;

UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 1 AND job_grade_id IS NULL; -- E2  Head of Department: End User Computing
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 2 AND job_grade_id IS NULL; -- D5  Senior Manager: Commercial Proposal
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 3 AND job_grade_id IS NULL; -- D2  Consultant Client Relationship Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 4 AND job_grade_id IS NULL; -- D1  Consultant: Commercial Proposal
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 5 AND job_grade_id IS NULL; -- E5  Executive Corporate Strategy
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 6 AND job_grade_id IS NULL; -- D3  Lead Consultant: End User Computing (MOD 612)
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 7 AND job_grade_id IS NULL; -- D4  Consultant Commercial Design and Packaging Infrastructures.
UPDATE job_profiles SET job_grade_id = 25 WHERE job_profile_id = 8 AND job_grade_id IS NULL; -- E3  Head of Department Information Security Services
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 9 AND job_grade_id IS NULL; -- C2  Advanced Operational: Service Management Technologies (Aspec
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 11 AND job_grade_id IS NULL; -- D3  Senior DevOps Engineer
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 12 AND job_grade_id IS NULL; -- D1  Manager: Data Centre Operations
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 13 AND job_grade_id IS NULL; -- D2  Manager: General Support Services
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 14 AND job_grade_id IS NULL; -- D1  Consultant Product Certification (MOD 612)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 15 AND job_grade_id IS NULL; -- C5  Specialist: EUC Switch and WI-FI LAN Engineer
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 16 AND job_grade_id IS NULL; -- E1  Technical Lead: Service Delivery Management, Architecture an
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 17 AND job_grade_id IS NULL; -- D2  Senior Cloud Operations Engineer
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 18 AND job_grade_id IS NULL; -- D3  Lead Consultant: System Testing
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 19 AND job_grade_id IS NULL; -- C5  Senior Specialist: LAN Monitoring and Evaluation
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 20 AND job_grade_id IS NULL; -- C1  Advanced Operational: Services Billing Support
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 21 AND job_grade_id IS NULL; -- C2  Junior: Software Developer - UNIFACE (Legacy System)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 22 AND job_grade_id IS NULL; -- D2  Consultant EUC Information System Security Operations
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 24 AND job_grade_id IS NULL; -- D1  Manager: Strategic Clients (SAPS & DOD)
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 25 AND job_grade_id IS NULL; -- C3  Billing Officer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 26 AND job_grade_id IS NULL; -- C5  Supervisor Billing and Accounts Receivable
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 27 AND job_grade_id IS NULL; -- E1  Professional: Governance and Business Support Services.
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 28 AND job_grade_id IS NULL; -- C4  Supervisor: Fixed Assets
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 29 AND job_grade_id IS NULL; -- D4  Senior Manager : Panels and Transversal Contracts
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 31 AND job_grade_id IS NULL; -- C5  Technical Writer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 32 AND job_grade_id IS NULL; -- D5  Senior Manager: Employee Relations and Health Managment
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 33 AND job_grade_id IS NULL; -- D2  Manager: IT Service Desk
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 35 AND job_grade_id IS NULL; -- D2  Manager Vetting Services (MOD 612)
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 36 AND job_grade_id IS NULL; -- C3  Physical Security Controller
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 37 AND job_grade_id IS NULL; -- E5  Chief Digital Officer
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 38 AND job_grade_id IS NULL; -- D1  Consultant: End User Computing Services
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 40 AND job_grade_id IS NULL; -- C1  Data Centre Operator
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 41 AND job_grade_id IS NULL; -- C5  Total Rewards Officer
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 42 AND job_grade_id IS NULL; -- D1  Management Accountant
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 43 AND job_grade_id IS NULL; -- E1  Technical Lead: Information Security Architecture and Develo
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 45 AND job_grade_id IS NULL; -- D5  Senior Manager: Service Management - Tier 3 - Limpopo Provin
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 46 AND job_grade_id IS NULL; -- E2  HOD Customer Advocacy
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 47 AND job_grade_id IS NULL; -- D2  Consultant: HCM Analytics & Systems
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 48 AND job_grade_id IS NULL; -- B5  Operational : EUC Technician
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 49 AND job_grade_id IS NULL; -- D1  Commodity Manager : Professional Services & Travel
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 50 AND job_grade_id IS NULL; -- D4  Lead Consultant Service Management
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 51 AND job_grade_id IS NULL; -- C4  Language Editor Officer
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 52 AND job_grade_id IS NULL; -- E5  Executive: Provincial and Local Consulting
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 53 AND job_grade_id IS NULL; -- C5  IT Infrastructure Engineer
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 54 AND job_grade_id IS NULL; -- C4  Finance Officer: Provincial Finance
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 55 AND job_grade_id IS NULL; -- E5  Executive: Applications Development and Maintenance
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 57 AND job_grade_id IS NULL; -- D5  Senior Manager PLC - Tier 2
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 58 AND job_grade_id IS NULL; -- C5  Specialist Client Relationship Management (MOD 612)
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 59 AND job_grade_id IS NULL; -- E1  Provincial Manager - Tier 1
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 60 AND job_grade_id IS NULL; -- C5  Specialist Business Reporting
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 62 AND job_grade_id IS NULL; -- D3  Lead Consultant HCM Shared Services
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 63 AND job_grade_id IS NULL; -- C5  Specialist: ETDP - Reviewed 17/03/2023
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 64 AND job_grade_id IS NULL; -- C5  Technical Specialist: Software Asset Management CMDB
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 65 AND job_grade_id IS NULL; -- D4  Technical Lead: Business Services Architecture
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 68 AND job_grade_id IS NULL; -- D2  Senior Application DBA - Natural Adabas
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 69 AND job_grade_id IS NULL; -- D2  Consultant: EUC Switch and WI-FI LAN Engineer
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 70 AND job_grade_id IS NULL; -- B4  Experiential Trainee: Software Developer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 71 AND job_grade_id IS NULL; -- C5  Works Inspector
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 72 AND job_grade_id IS NULL; -- D4  Senior Manager External Reporting and Payroll
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 74 AND job_grade_id IS NULL; -- D4  Senior Manager: Infrastructure, Operations & Support
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 75 AND job_grade_id IS NULL; -- C2  Sourcing Analyst: Other ICT Projects
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 76 AND job_grade_id IS NULL; -- D4  Application Security Architect
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 77 AND job_grade_id IS NULL; -- D2  Consultant: OD, Change & Competency Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 78 AND job_grade_id IS NULL; -- D1  Senior Specialist: EUC Infrastructure Implementation
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 79 AND job_grade_id IS NULL; -- D1  Consultant : Software Certification
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 80 AND job_grade_id IS NULL; -- C4  Specialist: Networks(WAN)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 81 AND job_grade_id IS NULL; -- D1  Senior Specialist : Disaster Recovery
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 82 AND job_grade_id IS NULL; -- C1  Admin Operational Training & Development
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 83 AND job_grade_id IS NULL; -- D4  Senior Manager: Human Capital Business Partner
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 85 AND job_grade_id IS NULL; -- D1  Consultant External Communication (MOD 612)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 86 AND job_grade_id IS NULL; -- D1  Consultant: Client Contract Management (MOD 612)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 87 AND job_grade_id IS NULL; -- D1  Consultant: Implementation Support
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 88 AND job_grade_id IS NULL; -- C3  Fleet Supervisor
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 89 AND job_grade_id IS NULL; -- D2  Senior Specialist: Fixed Assets updated
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 90 AND job_grade_id IS NULL; -- D2  Consultant: OD & Change Management
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 91 AND job_grade_id IS NULL; -- D4  Senior Manager Cluster
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 92 AND job_grade_id IS NULL; -- D1  Manager Order Management
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 94 AND job_grade_id IS NULL; -- D4  Senior Manager Procurement: Order Management and Provincial 
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 95 AND job_grade_id IS NULL; -- D2  Senior: Release Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 96 AND job_grade_id IS NULL; -- D1  Manager: Strategic ICT Projects
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 97 AND job_grade_id IS NULL; -- D2  Senior Database Administrator – ADABAS
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 98 AND job_grade_id IS NULL; -- C5  Specialist: ETDP
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 102 AND job_grade_id IS NULL; -- C4  Customer Operations Support
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 103 AND job_grade_id IS NULL; -- C1  Advanced Operational: Commercial Design and Packaging
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 105 AND job_grade_id IS NULL; -- D1  Consultant: Channel Management
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 106 AND job_grade_id IS NULL; -- C2  Admin Operational: Integrity Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 107 AND job_grade_id IS NULL; -- D1  Project Manager 2024
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 108 AND job_grade_id IS NULL; -- D5  Senior Manager: Organisation Development
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 109 AND job_grade_id IS NULL; -- D3  Lead Consultant EUC Infrastructure Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 110 AND job_grade_id IS NULL; -- D3  Lead Consultant EUC Information Systems Security Operations
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 112 AND job_grade_id IS NULL; -- C2  Advanced Operational: Support
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 113 AND job_grade_id IS NULL; -- C3  Project Coordinator
UPDATE job_profiles SET job_grade_id = 10 WHERE job_profile_id = 114 AND job_grade_id IS NULL; -- B3  EUC Experiential Leaner
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 115 AND job_grade_id IS NULL; -- C5  OD, Change & Competency Management Officer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 116 AND job_grade_id IS NULL; -- D5  Senior Manager: Hosting
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 117 AND job_grade_id IS NULL; -- D1  Consultant: Service Delivery - KZN
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 119 AND job_grade_id IS NULL; -- D2  Senior Data Engineer - ADM
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 120 AND job_grade_id IS NULL; -- D5  Senior Manager: DOD Unique Non-ERP and HSS Mainframe
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 121 AND job_grade_id IS NULL; -- C4  Specialist:Channel Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 122 AND job_grade_id IS NULL; -- D2  Senior Software Developer - COBOL/IMS (Legacy System)
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 123 AND job_grade_id IS NULL; -- D4  Senior Category Manager: ICT Commodities
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 124 AND job_grade_id IS NULL; -- D2  Consultant Employee Relations
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 125 AND job_grade_id IS NULL; -- C3  Specialist: LAN Co-Ordinator
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 126 AND job_grade_id IS NULL; -- C1  Facilities Administrator
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 128 AND job_grade_id IS NULL; -- D4  Senior Manager: Budgeting and Reporting
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 129 AND job_grade_id IS NULL; -- C3  Advanced Operational Assets
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 130 AND job_grade_id IS NULL; -- C5  Business Analyst(National Consulting)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 131 AND job_grade_id IS NULL; -- D5  Assistant Company Secretary
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 132 AND job_grade_id IS NULL; -- D3  Information and Data Architect
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 133 AND job_grade_id IS NULL; -- C1  Advanced Operational: LAN Service Management Co ordinator
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 134 AND job_grade_id IS NULL; -- D2  Consultant: Remuneration and Benefits
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 135 AND job_grade_id IS NULL; -- D5  Mainframe Apps (non-DOD)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 137 AND job_grade_id IS NULL; -- D1  Manager: Accounts Payable - revised
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 138 AND job_grade_id IS NULL; -- D2  Manager Forensic Audit
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 139 AND job_grade_id IS NULL; -- D1  Consultant : System testing
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 140 AND job_grade_id IS NULL; -- D5  Senior Manager: Service Management - Tier 1
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 141 AND job_grade_id IS NULL; -- D1  Consultant: Service Management Technologies (Aspect & ITSM7)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 142 AND job_grade_id IS NULL; -- D5  Senior Manager: Network Operation Centre
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 144 AND job_grade_id IS NULL; -- C5  Database Administrator
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 146 AND job_grade_id IS NULL; -- D3  Consultant: Network Solutions Architect
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 147 AND job_grade_id IS NULL; -- D2  Senior Process Analyst
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 148 AND job_grade_id IS NULL; -- D1  Consultant: ETDP - Reviewed 17/03/2023
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 149 AND job_grade_id IS NULL; -- C5  Specialist: Information System Security
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 150 AND job_grade_id IS NULL; -- C1  Fixed Assets Officer
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 151 AND job_grade_id IS NULL; -- D2  Consultant ICT Governance
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 153 AND job_grade_id IS NULL; -- D1  Sourcing Manager : Physical Infrastructure
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 154 AND job_grade_id IS NULL; -- D1  Consultant: Configuration Management
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 155 AND job_grade_id IS NULL; -- E5  Executive IT Infrastructure (Hosting and Network Services)
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 156 AND job_grade_id IS NULL; -- C1  Admin Operational: Asset and Configuration Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 157 AND job_grade_id IS NULL; -- C5  Specialist: Implementation System
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 158 AND job_grade_id IS NULL; -- C5  Server Engineer - KZN
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 160 AND job_grade_id IS NULL; -- C5  Specialist: Information System Security (MOD612)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 162 AND job_grade_id IS NULL; -- D1  Senior Specialist: EUC Monitoring and Evaluation
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 163 AND job_grade_id IS NULL; -- C3  Payroll Officer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 164 AND job_grade_id IS NULL; -- D5  Senior Manager: Security Operation Centre (SOC)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 165 AND job_grade_id IS NULL; -- D2  Manager: Information Systems Audit
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 166 AND job_grade_id IS NULL; -- D5  Senior Manager: Employee Relations and Wellness
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 167 AND job_grade_id IS NULL; -- C3  Electrician
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 168 AND job_grade_id IS NULL; -- D4  Lead Data Architect
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 169 AND job_grade_id IS NULL; -- C4  Specialist: Production Planner (Digital Printing)
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 170 AND job_grade_id IS NULL; -- B5  Data Controller
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 171 AND job_grade_id IS NULL; -- C3  Advanced Operational: Asset
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 172 AND job_grade_id IS NULL; -- D5  Senior Manager PLC - original profile
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 173 AND job_grade_id IS NULL; -- C5  Software Developer - Websites
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 174 AND job_grade_id IS NULL; -- D4  Business Architect
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 176 AND job_grade_id IS NULL; -- E5  Executive Supply Chain Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 177 AND job_grade_id IS NULL; -- D2  Senior Software Developer
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 178 AND job_grade_id IS NULL; -- C2  Junior Business Analyst
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 179 AND job_grade_id IS NULL; -- D3  Senior Project Manager (MOD 612)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 180 AND job_grade_id IS NULL; -- D2  Senior Software Developer - Natural Adabas (Legacy Systems)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 181 AND job_grade_id IS NULL; -- D5  Senior Manager: Business Assessment Services
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 183 AND job_grade_id IS NULL; -- D1  Commodity Manager : Data, Cabling & ICT Services
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 184 AND job_grade_id IS NULL; -- D4  Senior Manager : Framework Contracts
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 185 AND job_grade_id IS NULL; -- C5  Supervisor : Treasury
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 186 AND job_grade_id IS NULL; -- C3  Payroll Specialist
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 187 AND job_grade_id IS NULL; -- D5  Lead Consultant: Performance Measurement and Evaluation
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 188 AND job_grade_id IS NULL; -- C5  Specialist: Document Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 189 AND job_grade_id IS NULL; -- D3  Manager: Accounts Payable
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 190 AND job_grade_id IS NULL; -- D4  Lead: SDDN Architect
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 191 AND job_grade_id IS NULL; -- C5  Specialist: EUC LAN Cabling Infrastructure
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 193 AND job_grade_id IS NULL; -- C4  Senior Internal Auditor Information Technology
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 194 AND job_grade_id IS NULL; -- D2  Solution Architect
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 195 AND job_grade_id IS NULL; -- C5  Supervisor Soft Services
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 196 AND job_grade_id IS NULL; -- D2  Senior: System Programmer
UPDATE job_profiles SET job_grade_id = 28 WHERE job_profile_id = 197 AND job_grade_id IS NULL; -- F1  Chief Financial Officer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 198 AND job_grade_id IS NULL; -- C5  Specialist: Service Delivery
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 199 AND job_grade_id IS NULL; -- D1  Consultant: Service Operations
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 200 AND job_grade_id IS NULL; -- D5  Senior Manager PLC - Tier 1
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 201 AND job_grade_id IS NULL; -- D1  Senior Specialist: Software Asset Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 204 AND job_grade_id IS NULL; -- D2  Senior Specialist: EUC Information System Security Operation
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 205 AND job_grade_id IS NULL; -- D2  Consultant: Information Systems Audit
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 207 AND job_grade_id IS NULL; -- D4  Lead Consultant: Technical Architecture (DOD)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 209 AND job_grade_id IS NULL; -- C5  Software Developer - APEX (Legacy System)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 210 AND job_grade_id IS NULL; -- D2  Consultant: HCM Service Management
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 211 AND job_grade_id IS NULL; -- C4  Senior Internal Auditor
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 212 AND job_grade_id IS NULL; -- D1  Consultant: EUC LAN Cabling Infrastructure
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 213 AND job_grade_id IS NULL; -- C1  Foreman
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 214 AND job_grade_id IS NULL; -- D2  Consultant Process Improvement
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 215 AND job_grade_id IS NULL; -- D2  Consultant : Unified Communications (MOD612)
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 216 AND job_grade_id IS NULL; -- C4  Specialist: Quality Assurance
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 218 AND job_grade_id IS NULL; -- D3  EUC: Lead Consultant Technical Architecture
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 219 AND job_grade_id IS NULL; -- C1  Lab and GRC Coordinator
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 220 AND job_grade_id IS NULL; -- C4  Customer Advocacy Administrator
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 221 AND job_grade_id IS NULL; -- C5  Business Analyst
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 222 AND job_grade_id IS NULL; -- D1  Manager: Provincial Facilities Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 223 AND job_grade_id IS NULL; -- D2  Senior Software Developer - UNIFACE (Legacy System)
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 224 AND job_grade_id IS NULL; -- C4  Specialist: Commercial Design and Packaging Application Deve
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 225 AND job_grade_id IS NULL; -- D2  Consultant Client Relationship Management (Provinces)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 227 AND job_grade_id IS NULL; -- C5  Wellness Officer
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 228 AND job_grade_id IS NULL; -- D4  Senior Manager: EUC (MOD 612) - Eastern Cape
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 229 AND job_grade_id IS NULL; -- C2  Auditor (MOD 612)
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 230 AND job_grade_id IS NULL; -- D4  Lead Consultant: Total Rewards
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 231 AND job_grade_id IS NULL; -- D3  Lead Consultant: Commercial Design and Packaging Advisory Se
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 232 AND job_grade_id IS NULL; -- D4  Technical Lead: DEVOPS Architecture and Systems Engineering
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 233 AND job_grade_id IS NULL; -- D3  Lead Consultant: ETDP
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 234 AND job_grade_id IS NULL; -- C5  Specialist: Configuration Management (Networks and Service M
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 235 AND job_grade_id IS NULL; -- D2  Solution Architect( ICTS and ESEID)
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 236 AND job_grade_id IS NULL; -- C3  Specialist: LAN Planning and Design
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 237 AND job_grade_id IS NULL; -- C1  Advanced Operational Server Administrator
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 239 AND job_grade_id IS NULL; -- D4  Senior Manager: Functional Application Support
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 240 AND job_grade_id IS NULL; -- E2  Chief Technical Consultant
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 241 AND job_grade_id IS NULL; -- C1  Advanced Operational Backup Administrator
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 242 AND job_grade_id IS NULL; -- D2  Senior Manager: Financial Risk, Governance and Compliance
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 243 AND job_grade_id IS NULL; -- D3  Technical Manager: Hosting - Deviation
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 244 AND job_grade_id IS NULL; -- E1  Executive Support Manager: Office of the Managing Director
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 246 AND job_grade_id IS NULL; -- D2  Senior Software Developer - Natural Adabas
UPDATE job_profiles SET job_grade_id = 30 WHERE job_profile_id = 247 AND job_grade_id IS NULL; -- F3  Managing Director
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 249 AND job_grade_id IS NULL; -- D5  Programme Manager - UPDATED
UPDATE job_profiles SET job_grade_id = 9 WHERE job_profile_id = 250 AND job_grade_id IS NULL; -- B2  Security Operation Centre Operator
UPDATE job_profiles SET job_grade_id = 9 WHERE job_profile_id = 251 AND job_grade_id IS NULL; -- B2  Office Clerk
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 252 AND job_grade_id IS NULL; -- D5  Senior Manager: Internet and Security
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 253 AND job_grade_id IS NULL; -- C5  Specialist EUC Information System Security Operations
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 254 AND job_grade_id IS NULL; -- D4  Senior Manager: Physical Security
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 255 AND job_grade_id IS NULL; -- D2  Data Architect
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 256 AND job_grade_id IS NULL; -- C4  Supervisor Accounts Payable
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 257 AND job_grade_id IS NULL; -- D2  Consultant: Risk Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 258 AND job_grade_id IS NULL; -- C5  System Administrator
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 259 AND job_grade_id IS NULL; -- D3  Advanced: Software Developer - ORACLE APEX (Legacy System)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 260 AND job_grade_id IS NULL; -- D2  Consultant Information System Security(MOD612)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 261 AND job_grade_id IS NULL; -- D5  Lead ICT Security Governance and Compliance
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 262 AND job_grade_id IS NULL; -- D1  Consultant: Hosting, Storage & Printing
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 263 AND job_grade_id IS NULL; -- D2  Consultant: Ethics and Fraud Awareness (MOD 612)
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 264 AND job_grade_id IS NULL; -- C3  Accounts Payable Officer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 265 AND job_grade_id IS NULL; -- D5  Senior Manager: System Management Services
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 266 AND job_grade_id IS NULL; -- D4  Senior Category Manager: Corporate Commodities
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 267 AND job_grade_id IS NULL; -- D4  Senior Manager tactical and basic sourcing
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 268 AND job_grade_id IS NULL; -- D2  Senior: System Programmer Reviewed 03/06/21
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 269 AND job_grade_id IS NULL; -- B4  Experiential Trainee: Mainframe Hosting
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 270 AND job_grade_id IS NULL; -- C1  Tester System Testing
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 271 AND job_grade_id IS NULL; -- D4  Senior Manager: Internal Audit and Performance Assurance (MO
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 274 AND job_grade_id IS NULL; -- D3  Advanced: Software Developer - Natural Adabas
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 275 AND job_grade_id IS NULL; -- D4  Lead Consultant: Network Solutions Architecture
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 276 AND job_grade_id IS NULL; -- E2  Provincial Manager - Tier 3
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 277 AND job_grade_id IS NULL; -- D3  Lead Consultant EUC Infrastructure Services
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 278 AND job_grade_id IS NULL; -- B4  Administrator: OD & Change Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 279 AND job_grade_id IS NULL; -- D2  Consultant: LAN Monitoring and Evaluation
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 280 AND job_grade_id IS NULL; -- D5  Lead Consultant: Performance Monitoring and Reporting
UPDATE job_profiles SET job_grade_id = 28 WHERE job_profile_id = 281 AND job_grade_id IS NULL; -- F1  Chief Operations Officer
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 282 AND job_grade_id IS NULL; -- D4  Lead Enterprise Architect
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 285 AND job_grade_id IS NULL; -- D5  Senior Manager Information Security Architecture
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 287 AND job_grade_id IS NULL; -- D3  Technical Consultant
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 288 AND job_grade_id IS NULL; -- D4  Senior Manager: Fixed Assets Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 289 AND job_grade_id IS NULL; -- C5  Specialist: Incident Management
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 290 AND job_grade_id IS NULL; -- C1  Admin : Operational Corporate Social Responsibility
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 291 AND job_grade_id IS NULL; -- D3  Advanced: Software Developer
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 292 AND job_grade_id IS NULL; -- C1  Team Leader: Printing Dispatch
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 293 AND job_grade_id IS NULL; -- B4  Experiential Trainee: Database Administrator
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 294 AND job_grade_id IS NULL; -- D1  Purchasing Manager: Order Management
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 297 AND job_grade_id IS NULL; -- D4  Lead: Interconnectivity Architect
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 298 AND job_grade_id IS NULL; -- D1  Senior Specialist Software Asset Management - Technical Cons
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 299 AND job_grade_id IS NULL; -- C5  Lab Technician
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 300 AND job_grade_id IS NULL; -- D5  Senior Manager: IT Infrastructure Services
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 301 AND job_grade_id IS NULL; -- C3  VIP Protection and Advanced Driver
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 302 AND job_grade_id IS NULL; -- D1  Senior Specialist: Server Administrator
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 303 AND job_grade_id IS NULL; -- D5  Lead Consultant: PM Stds & Reporting CoE
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 306 AND job_grade_id IS NULL; -- C5  Specialist: Technology Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 307 AND job_grade_id IS NULL; -- C5  Performance Management Officer - CPM
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 308 AND job_grade_id IS NULL; -- D5  Senior Manager: ERP Solution Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 309 AND job_grade_id IS NULL; -- D2  Consultant Integrated Change Management
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 310 AND job_grade_id IS NULL; -- C2  Practitioner: ETDP
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 312 AND job_grade_id IS NULL; -- D1  Planned Preventative Maintenance Manager
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 313 AND job_grade_id IS NULL; -- C5  Specialist: Service Management Technologies (MOD612)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 314 AND job_grade_id IS NULL; -- D1  Consultant: Service Transition
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 315 AND job_grade_id IS NULL; -- C5  Specialist: Server Administrator
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 317 AND job_grade_id IS NULL; -- B4  Experiential Trainee: Engineering Support Services
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 318 AND job_grade_id IS NULL; -- D2  Manager Compliance: Facilities Physical Security
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 320 AND job_grade_id IS NULL; -- D1  Senior Specialist: EUC Portfolio Provisioning
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 324 AND job_grade_id IS NULL; -- D3  Senior IOT Engineer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 325 AND job_grade_id IS NULL; -- D5  Senior Manager :Finance Provincial Management
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 326 AND job_grade_id IS NULL; -- C2  Executive Assistant (generic)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 327 AND job_grade_id IS NULL; -- D2  Manager: Data Centre Operations (Centurion/Beta)
UPDATE job_profiles SET job_grade_id = 25 WHERE job_profile_id = 328 AND job_grade_id IS NULL; -- E3  Chief Strategist : Networks and Internet Security
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 329 AND job_grade_id IS NULL; -- C5  Data Analyst (ERM)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 331 AND job_grade_id IS NULL; -- C5  Specialist: Organisational Change Management
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 332 AND job_grade_id IS NULL; -- B5  Agent: Service Desk
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 333 AND job_grade_id IS NULL; -- D1  Consultant: EUC Monitoring and Evaluation(MOD612)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 334 AND job_grade_id IS NULL; -- C5  Payroll Specialist - review
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 335 AND job_grade_id IS NULL; -- D1  Consultant: EUC Service Level Management & Portfolio Provisi
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 336 AND job_grade_id IS NULL; -- C5  Senior Buyer (MOD 612)
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 337 AND job_grade_id IS NULL; -- E1  Technical Lead: Infrastructure PMO
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 338 AND job_grade_id IS NULL; -- D2  Consultant: Employee Wellness
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 339 AND job_grade_id IS NULL; -- C2  Sourcing Analyst Professional Services & Travel
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 341 AND job_grade_id IS NULL; -- D2  Consultant Performance Management
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 342 AND job_grade_id IS NULL; -- D4  Lead Consultant: Network (WAN Ops) Engineer
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 343 AND job_grade_id IS NULL; -- D4  Lead Consultant: Technical Architecture
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 344 AND job_grade_id IS NULL; -- C2  Shift Leader: HSP
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 345 AND job_grade_id IS NULL; -- D2  Enterprise Architect: ICT Systems
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 347 AND job_grade_id IS NULL; -- C5  Business Process Management Officer
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 348 AND job_grade_id IS NULL; -- C1  End User Computing Technician
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 349 AND job_grade_id IS NULL; -- D1  Consultant: Implementation System
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 350 AND job_grade_id IS NULL; -- C2  Treasury Officer
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 351 AND job_grade_id IS NULL; -- C2  Admin: Functional Application Support
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 352 AND job_grade_id IS NULL; -- C5  DevOps Engineer
UPDATE job_profiles SET job_grade_id = 8 WHERE job_profile_id = 353 AND job_grade_id IS NULL; -- B1  Covid-19 Brigade
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 354 AND job_grade_id IS NULL; -- D3  Technical Manager: Disaster Recovery (Cloud)
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 355 AND job_grade_id IS NULL; -- C1  Committee Support
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 356 AND job_grade_id IS NULL; -- C4  Specialist: Production Planner
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 357 AND job_grade_id IS NULL; -- C3  Supervisor: Operations
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 358 AND job_grade_id IS NULL; -- C5  Supervisor: Human Capital Administration
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 359 AND job_grade_id IS NULL; -- D2  Financial Manager :Provinces
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 361 AND job_grade_id IS NULL; -- C5  Specialist: Service Performance Reporting
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 362 AND job_grade_id IS NULL; -- C1  Administration Officer (Hosting, Storage and printing)
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 363 AND job_grade_id IS NULL; -- E2  HOD: Talent Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 364 AND job_grade_id IS NULL; -- C5  Demand Planning Specialist Gvernment ICT Demand
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 365 AND job_grade_id IS NULL; -- C5  Internet Engineer
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 366 AND job_grade_id IS NULL; -- D4  Senior Manager: Application Training
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 368 AND job_grade_id IS NULL; -- E1  Cluster Advocate (MOD 612)
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 369 AND job_grade_id IS NULL; -- E1  Lead Consultant Business Development
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 370 AND job_grade_id IS NULL; -- D4  Manager Executive Support
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 371 AND job_grade_id IS NULL; -- D2  Lead Consultant: Financial Risk, Governance and Compliance
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 373 AND job_grade_id IS NULL; -- D3  Lead Consultant: Commercial Design and Packaging Application
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 374 AND job_grade_id IS NULL; -- D3  Lead Consultant: Server Infrastructure
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 375 AND job_grade_id IS NULL; -- D2  Consultant: Career Management and Succession Planning
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 376 AND job_grade_id IS NULL; -- C4  Information Systems Auditor
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 377 AND job_grade_id IS NULL; -- D5  Senior Manager: Talent Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 378 AND job_grade_id IS NULL; -- C5  Specialist: Service Monitoring (End to End Monitoring)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 379 AND job_grade_id IS NULL; -- D2  Consultant Project Management Training and Reporting
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 380 AND job_grade_id IS NULL; -- D3  Lead Consultant: Client Relationship Management
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 381 AND job_grade_id IS NULL; -- D5  Senior Manager: Corporate PMO
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 383 AND job_grade_id IS NULL; -- D2  Consultant: Service Performance Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 384 AND job_grade_id IS NULL; -- D2  Consultant: Network Server Administrator
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 385 AND job_grade_id IS NULL; -- E5  Executive: IT Infrastructure Services
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 386 AND job_grade_id IS NULL; -- C2  Junior DevOps Engineer
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 387 AND job_grade_id IS NULL; -- D2  Senior System Programmer - IBM z/OS
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 388 AND job_grade_id IS NULL; -- D1  Sourcing Manager : System Implementation
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 389 AND job_grade_id IS NULL; -- C5  Specialist: Service Transition
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 390 AND job_grade_id IS NULL; -- C2  Junior Auditor( Information Systems Audit )
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 391 AND job_grade_id IS NULL; -- C4  General Ledger
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 393 AND job_grade_id IS NULL; -- D4  Senior Manager: Business Process and Technology
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 395 AND job_grade_id IS NULL; -- C5  Process Analyst
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 396 AND job_grade_id IS NULL; -- D3  Lead Consultant: Functional Application Support
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 397 AND job_grade_id IS NULL; -- C5  Specialist Information and Knowledge Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 398 AND job_grade_id IS NULL; -- D1  Sourcing Manager : Transversal Contracts
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 399 AND job_grade_id IS NULL; -- C5  Corporate Services Officer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 400 AND job_grade_id IS NULL; -- C5  OD & Change Management Officer
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 401 AND job_grade_id IS NULL; -- C2  Shift Leader: Hosting Reviewed June 2023
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 402 AND job_grade_id IS NULL; -- D5  Senior Manager Applications Development and Maintenance
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 403 AND job_grade_id IS NULL; -- C2  Advanced Operational: Service Management Support (Escalation
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 404 AND job_grade_id IS NULL; -- D2  Consultant: LAN Testing
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 405 AND job_grade_id IS NULL; -- E2  Chief Information Officer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 406 AND job_grade_id IS NULL; -- D5  Senior Manager: Solution Analysis
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 407 AND job_grade_id IS NULL; -- B4  Experiential Trainee: e-Learning Material Developer
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 408 AND job_grade_id IS NULL; -- D2  Manager: Billing and Accounts Receivable - copy 1
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 409 AND job_grade_id IS NULL; -- D5  Senior Manager: Service Management - Tier 3 - (Including EUC
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 410 AND job_grade_id IS NULL; -- D1  Manager : Compliance and Secretariat
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 411 AND job_grade_id IS NULL; -- D5  Enterprise Cloud Architect
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 412 AND job_grade_id IS NULL; -- D1  Project Manager (MOD 612)
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 413 AND job_grade_id IS NULL; -- C1  Computer Operator (Mainframe) Reviewed June2023
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 415 AND job_grade_id IS NULL; -- B4  Experiential Trainee: System Analysis
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 416 AND job_grade_id IS NULL; -- D4  Senior Manager: EUC (MOD 612)
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 417 AND job_grade_id IS NULL; -- C4  Specialist Service Delivery Management Internal (GBS)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 418 AND job_grade_id IS NULL; -- D1  Project Manager Facilities
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 419 AND job_grade_id IS NULL; -- D5  Senior Manager: Technical Design
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 420 AND job_grade_id IS NULL; -- D1  Manager : Framework Contracts
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 421 AND job_grade_id IS NULL; -- D1  Consultant: Commercial Proposal Development
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 422 AND job_grade_id IS NULL; -- C1  Advanced Operational: EUC Infrastructure Implementation
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 423 AND job_grade_id IS NULL; -- D1  Senior Data Analyst
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 424 AND job_grade_id IS NULL; -- D3  Lead Consultant: External Reporting & Audit
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 425 AND job_grade_id IS NULL; -- D2  Senior Specialist IT Fixed Assets
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 426 AND job_grade_id IS NULL; -- C2  Junior System Analyst
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 427 AND job_grade_id IS NULL; -- D4  Lead Consultant: Remuneration Services
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 428 AND job_grade_id IS NULL; -- C1  Junior Engineer: Internet Services
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 429 AND job_grade_id IS NULL; -- D1  Consultant: Information and Knowledge Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 430 AND job_grade_id IS NULL; -- C5  Specialist: Design & Planning
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 432 AND job_grade_id IS NULL; -- D4  Lead Consultant: Commercial Design and Packaging Infrastruct
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 433 AND job_grade_id IS NULL; -- C5  Software Developer - Natural Adabas
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 434 AND job_grade_id IS NULL; -- D2  Senior System Analyst
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 435 AND job_grade_id IS NULL; -- C4  Infrastructure Provisioning
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 436 AND job_grade_id IS NULL; -- D4  Lead Consultant: Digital Marketing
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 437 AND job_grade_id IS NULL; -- C3  Benefits Administrator
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 438 AND job_grade_id IS NULL; -- D3  Advanced: Software Developer (AI - Artificial Intelligence)
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 439 AND job_grade_id IS NULL; -- C3  Billing and Accounts Receivable Officer
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 441 AND job_grade_id IS NULL; -- D2  Consultant: Learning and Leadership Development
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 442 AND job_grade_id IS NULL; -- D1  Senior: System Administrator
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 445 AND job_grade_id IS NULL; -- D2  Consultant: OHS
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 446 AND job_grade_id IS NULL; -- C2  Junior Database Administrator
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 448 AND job_grade_id IS NULL; -- C4  Specialist: Solution Training Material (eLearning: Moodle)(M
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 449 AND job_grade_id IS NULL; -- C5  Specialist Compliance/Policy Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 450 AND job_grade_id IS NULL; -- D1  Consultant Language Services
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 452 AND job_grade_id IS NULL; -- C5  Specialist: Messaging Administrator
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 453 AND job_grade_id IS NULL; -- C1  Technician: Data Centre Facility
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 454 AND job_grade_id IS NULL; -- D1  Manager : Corporate Commodities
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 455 AND job_grade_id IS NULL; -- E5  Executive: Service Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 456 AND job_grade_id IS NULL; -- D1  Consultant: End User Computing(MOD 612)
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 457 AND job_grade_id IS NULL; -- C4  Senior Internal Auditor - Performance Audit
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 458 AND job_grade_id IS NULL; -- D1  Senior Specialist: EUC Switch and WI-FI LAN Engineer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 459 AND job_grade_id IS NULL; -- C5  Demand Management Specialist Bid Specification
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 461 AND job_grade_id IS NULL; -- D3  Lead Consultant Client Contract Management (MOD 612)
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 462 AND job_grade_id IS NULL; -- C3  Infrastructure Engineer
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 463 AND job_grade_id IS NULL; -- C2  Security Audits and Investigations
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 464 AND job_grade_id IS NULL; -- E1  Technical Lead: Data and Switching Centre Facilities
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 465 AND job_grade_id IS NULL; -- D2  Manager: BPO Service Centre Services
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 466 AND job_grade_id IS NULL; -- D1  Sourcing Manager : Other ICT Projects
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 467 AND job_grade_id IS NULL; -- D1  Senior Specialist: EUC LAN Cabling Infrastructure
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 468 AND job_grade_id IS NULL; -- C2  Admin: Functional Application Support - IFASS DOD
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 469 AND job_grade_id IS NULL; -- D4  Lead Consultant: Network Management Systems( Systems Enginee
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 470 AND job_grade_id IS NULL; -- D5  Senior Manager: COTS Services
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 471 AND job_grade_id IS NULL; -- D3  Senior: Cloud Service Design
UPDATE job_profiles SET job_grade_id = 27 WHERE job_profile_id = 472 AND job_grade_id IS NULL; -- E5  Executive: Human Capital Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 473 AND job_grade_id IS NULL; -- C5  Executive Assistant: Office of the MD
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 476 AND job_grade_id IS NULL; -- D5  Senior Manager Architecture
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 477 AND job_grade_id IS NULL; -- D4  Lead Solution Architect
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 478 AND job_grade_id IS NULL; -- C1  Computer Operator (Mainframe) Hosting
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 479 AND job_grade_id IS NULL; -- D3  Senior Project Manager (MOD 612) - UPDATED
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 480 AND job_grade_id IS NULL; -- D5  Senior Manager: Commercial Analysis
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 481 AND job_grade_id IS NULL; -- C5  Learning and Development Officer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 482 AND job_grade_id IS NULL; -- C5  Specialist: Service Level Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 484 AND job_grade_id IS NULL; -- C5  Power Platform Specialist (EUC-KZN)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 485 AND job_grade_id IS NULL; -- C5  Specialist Monitoring and Deployment
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 486 AND job_grade_id IS NULL; -- D2  AI Developer
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 487 AND job_grade_id IS NULL; -- D4  Lead Business Architect
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 488 AND job_grade_id IS NULL; -- C5  Specialist Business Intelligence
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 489 AND job_grade_id IS NULL; -- D3  Lead Consultant: Implementation Services
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 490 AND job_grade_id IS NULL; -- D2  Consultant: Legal and Regulatory Compliance (MOD 612)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 491 AND job_grade_id IS NULL; -- D2  Consultant: Commercial Design and Packaging Advisory Securit
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 492 AND job_grade_id IS NULL; -- D3  Senior Project Manager (Provinces)
UPDATE job_profiles SET job_grade_id = 10 WHERE job_profile_id = 493 AND job_grade_id IS NULL; -- B3  Shift Leader: Physical Security
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 494 AND job_grade_id IS NULL; -- D1  Consultant: Functional Application Support - IFASS DOD
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 495 AND job_grade_id IS NULL; -- D1  Consultant: Network Engineer - NTSS
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 496 AND job_grade_id IS NULL; -- C5  Specialist Network Security Engineer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 497 AND job_grade_id IS NULL; -- D5  Senior Manager: Service Management - Tier 2
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 498 AND job_grade_id IS NULL; -- D3  Lead: Capacity Planner
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 501 AND job_grade_id IS NULL; -- B4  Experiential Trainee: System Programmer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 502 AND job_grade_id IS NULL; -- C5  Specialist: Problem Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 505 AND job_grade_id IS NULL; -- C5  Specialist: Customer Advocacy
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 506 AND job_grade_id IS NULL; -- D1  Senior Specialist: EUC Infrastructure Technology Life Cycle 
UPDATE job_profiles SET job_grade_id = 10 WHERE job_profile_id = 508 AND job_grade_id IS NULL; -- B3  Advanced Operational: Data Controller
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 509 AND job_grade_id IS NULL; -- D4  Snr Manager Vendor and Tender Administration
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 510 AND job_grade_id IS NULL; -- D2  Senior Business Analyst
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 511 AND job_grade_id IS NULL; -- D1  Consultant: Service Delivery
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 512 AND job_grade_id IS NULL; -- D3  Technical Manager: Hosting
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 513 AND job_grade_id IS NULL; -- B4  Experiential Trainee: System Administrator
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 514 AND job_grade_id IS NULL; -- C5  Supervisor: Service Desk
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 515 AND job_grade_id IS NULL; -- C1  Junior: Network Engineer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 516 AND job_grade_id IS NULL; -- C5  Network Engineer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 517 AND job_grade_id IS NULL; -- D5  Senior Manager: Commercial Proposal Development
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 518 AND job_grade_id IS NULL; -- D5  Senior Manager: Management Accounting (Provincial)
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 519 AND job_grade_id IS NULL; -- D4  Senior Manager: Facilities Operations & Logistical Services
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 520 AND job_grade_id IS NULL; -- D4  Senior Manager: Operational Risk
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 522 AND job_grade_id IS NULL; -- C2  Junior: Software Developer - COBOL/IMS (Legacy System)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 523 AND job_grade_id IS NULL; -- C5  Supervisor: Physical Security
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 524 AND job_grade_id IS NULL; -- C5  Security Vetting Officer
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 525 AND job_grade_id IS NULL; -- C4  Finance Officer: National office - revised to Finance Govern
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 526 AND job_grade_id IS NULL; -- D5  Senior Manager: SAPS Unique
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 528 AND job_grade_id IS NULL; -- D5  Senior Manager: Architecture and Engineering Services
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 529 AND job_grade_id IS NULL; -- C5  Career and Succession Planning Officer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 531 AND job_grade_id IS NULL; -- C5  System Analyst
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 532 AND job_grade_id IS NULL; -- D2  IOT Developer
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 533 AND job_grade_id IS NULL; -- D4  Lead Consultant: Business Continuity Management
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 534 AND job_grade_id IS NULL; -- B4  Experiential Trainee: Business Analysis
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 537 AND job_grade_id IS NULL; -- C3  Procurement Officer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 538 AND job_grade_id IS NULL; -- C5  Junior Project Manager (MOD 612)
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 539 AND job_grade_id IS NULL; -- C2  I-Expense Officer
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 540 AND job_grade_id IS NULL; -- D1  Consultant Digital Marketing
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 541 AND job_grade_id IS NULL; -- D2  Senior Systems Engineer (DOD)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 542 AND job_grade_id IS NULL; -- D5  Senior Strategy and Planning Analyst
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 543 AND job_grade_id IS NULL; -- C5  TEAM LEADER: End User Computing
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 544 AND job_grade_id IS NULL; -- C5  Specialist System Programmer - IBM z/OS
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 545 AND job_grade_id IS NULL; -- C2  Admin: Document Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 547 AND job_grade_id IS NULL; -- D3  Advanced: Software Developer - IBM MQ Series on IBM z/OS (Le
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 548 AND job_grade_id IS NULL; -- C2  Junior: Software Developer
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 550 AND job_grade_id IS NULL; -- C1  Advanced Operational: Administration Officer
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 552 AND job_grade_id IS NULL; -- C1  Junior Information System Security.(MOD 612)
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 553 AND job_grade_id IS NULL; -- D4  Senior Legal Advisor: Litigation and Disputes (MOD 612)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 554 AND job_grade_id IS NULL; -- D5  Programme Manager
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 555 AND job_grade_id IS NULL; -- D5  Portfolio Manager - UPDATED
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 556 AND job_grade_id IS NULL; -- C4  Specialist System Testing (MOD 612)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 557 AND job_grade_id IS NULL; -- D2  Manager: Maintenance & Technical Services
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 558 AND job_grade_id IS NULL; -- D5  Senior Manager: Commercial Audit Assurance Services
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 559 AND job_grade_id IS NULL; -- D1  Senior Specialist: LAN Engineer (FAS)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 560 AND job_grade_id IS NULL; -- D5  Senior Manager: ADM Governance Services
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 561 AND job_grade_id IS NULL; -- C5  Committee Secretary (MOD 612)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 562 AND job_grade_id IS NULL; -- D2  Senior Software Developer - APEX (Legacy System)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 563 AND job_grade_id IS NULL; -- D5  Senior Manager Security Governance and Risk Management
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 564 AND job_grade_id IS NULL; -- D4  Lead Consultant: Security Solutions Architect
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 565 AND job_grade_id IS NULL; -- D2  Senior Server Engineer
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 567 AND job_grade_id IS NULL; -- D3  Lead Consultant ICT Certification
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 568 AND job_grade_id IS NULL; -- D1  Consultant: ETDP
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 569 AND job_grade_id IS NULL; -- C5  Cloud Engineer
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 570 AND job_grade_id IS NULL; -- D1  Commodity Manager : Facilities & Office Supplies
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 571 AND job_grade_id IS NULL; -- B4  Facilities Maintenance Assistant
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 572 AND job_grade_id IS NULL; -- C4  Specialist: Release Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 573 AND job_grade_id IS NULL; -- C5  Specialist: System Programmer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 574 AND job_grade_id IS NULL; -- C5  Demand Planning Specialist : SITA ICT Demand
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 575 AND job_grade_id IS NULL; -- D4  Senior Manager: Business Enablement
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 576 AND job_grade_id IS NULL; -- C5  Software Developer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 577 AND job_grade_id IS NULL; -- C5  Server Engineer
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 578 AND job_grade_id IS NULL; -- C2  Junior System Administrator
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 579 AND job_grade_id IS NULL; -- C5  Talent Acquisition Officer
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 580 AND job_grade_id IS NULL; -- D2  Consultant: Fraud Risk, Conflict of Interest & 3rd Party Ris
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 581 AND job_grade_id IS NULL; -- C5  Specialist: Integration & Automation
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 582 AND job_grade_id IS NULL; -- D3  Lead consultant: Hosting, Storage & Printing
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 583 AND job_grade_id IS NULL; -- C5  Specialist Backup Administrator
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 584 AND job_grade_id IS NULL; -- E2  HOD Applications Maintenance
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 585 AND job_grade_id IS NULL; -- D5  Senior Manager: Service Management - Tier 3
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 586 AND job_grade_id IS NULL; -- C3  Team Lead SOC(MOD 612)
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 587 AND job_grade_id IS NULL; -- B4  Experiential Trainee Technician – Unified Communications
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 588 AND job_grade_id IS NULL; -- C1  Advanced Operational EUC Information System Security Operati
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 589 AND job_grade_id IS NULL; -- B4  Admin Support Contract Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 590 AND job_grade_id IS NULL; -- C5  Employee Relations Officer
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 591 AND job_grade_id IS NULL; -- B5  Project Administrator
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 592 AND job_grade_id IS NULL; -- D1  Manager: Demand Planning
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 593 AND job_grade_id IS NULL; -- D4  Senior Manager Demand Management
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 594 AND job_grade_id IS NULL; -- D4  Lead Consultant: Solution Architect
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 595 AND job_grade_id IS NULL; -- C5  Analyst Programmer
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 596 AND job_grade_id IS NULL; -- C2  Internal Auditor Information Technology
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 597 AND job_grade_id IS NULL; -- D2  Consultant e-Learning
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 599 AND job_grade_id IS NULL; -- D5  Senior Manager: Engagement Management
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 600 AND job_grade_id IS NULL; -- E2  HOD Planning and Organising
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 601 AND job_grade_id IS NULL; -- D5  Senior Manager: HCM Business Engagement & Services
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 603 AND job_grade_id IS NULL; -- C2  Advanced Operational: Service Management support (Quality)
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 604 AND job_grade_id IS NULL; -- D1  Consultant Quality Assurance
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 605 AND job_grade_id IS NULL; -- C5  Coordinator Programme Oversight and Support
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 606 AND job_grade_id IS NULL; -- D1  Senior Specialist: Backup Administrator
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 607 AND job_grade_id IS NULL; -- C2  Admin Operational: Legal (MOD 612)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 609 AND job_grade_id IS NULL; -- D2  Technology Specialist
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 610 AND job_grade_id IS NULL; -- D1  Procurement Manager: Government ICT- Security Cluster
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 611 AND job_grade_id IS NULL; -- D3  Lead Consultant Strategic and Digital Marketing
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 612 AND job_grade_id IS NULL; -- D2  System Engineer - ADM
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 613 AND job_grade_id IS NULL; -- D5  Senior Manager: Data Analytics and Website Development Servi
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 614 AND job_grade_id IS NULL; -- D3  DevOps Architect
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 615 AND job_grade_id IS NULL; -- D1  Consultant: EUC Network Engineer – Switch Management
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 616 AND job_grade_id IS NULL; -- C3  Buyer (Finance) - Buyer Order Management
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 617 AND job_grade_id IS NULL; -- C2  Lab Technician - updated
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 618 AND job_grade_id IS NULL; -- D5  Senior Manager: Service Delivery Management
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 619 AND job_grade_id IS NULL; -- C3  Team Leader: IT Service Desk
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 620 AND job_grade_id IS NULL; -- D3  Advanced: System Analyst
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 622 AND job_grade_id IS NULL; -- D2  Manager: Commercial Audit Assurance Services
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 623 AND job_grade_id IS NULL; -- D2  Senior: Cloud Development Specialist
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 624 AND job_grade_id IS NULL; -- C5  Pre-employment Vetting Officer
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 625 AND job_grade_id IS NULL; -- D1  Senior Specialist: LAN Engineer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 626 AND job_grade_id IS NULL; -- C5  Specialist Vendor Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 627 AND job_grade_id IS NULL; -- D3  Lead Consultant Information System Security
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 628 AND job_grade_id IS NULL; -- D5  Senior Manager Applications Development Services
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 629 AND job_grade_id IS NULL; -- C1  Junior Consultant: Commercial Proposal Development
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 631 AND job_grade_id IS NULL; -- D2  Consultant: EUC Infrastructure Implementation
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 632 AND job_grade_id IS NULL; -- D1  Consultant: Internet Services
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 633 AND job_grade_id IS NULL; -- C5  Specialist Supplier Development & Localisation
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 634 AND job_grade_id IS NULL; -- D1  Senior BI Analyst - EPMO
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 635 AND job_grade_id IS NULL; -- C5  Snr Procurement Officer: Security Cluster (Government ICT)
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 636 AND job_grade_id IS NULL; -- D3  Lead Consultant: Unified Communications(MOD612)
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 637 AND job_grade_id IS NULL; -- D3  Technical Manager: Internet and Security
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 638 AND job_grade_id IS NULL; -- C2  Plumber
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 639 AND job_grade_id IS NULL; -- C2  Junior System Programmer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 640 AND job_grade_id IS NULL; -- C5  Specialist: Server Administrator Updated 24/01/2024
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 641 AND job_grade_id IS NULL; -- C3  Buyer(MOD 612)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 644 AND job_grade_id IS NULL; -- D2  Senior System Programmer - IBM z/Linux
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 645 AND job_grade_id IS NULL; -- D4  Senior Manager Sourcing (ICT Projects)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 646 AND job_grade_id IS NULL; -- D5  Senior Manager: Integration, API Management, Data Analytics
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 647 AND job_grade_id IS NULL; -- C4  Senior Forensic Auditor (correct)
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 648 AND job_grade_id IS NULL; -- E2  HOD: Cluster Business Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 649 AND job_grade_id IS NULL; -- D1  Commodity Manager : Hardware's & Consumables - copy 1
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 650 AND job_grade_id IS NULL; -- C5  Specialist Supply Intelligence
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 651 AND job_grade_id IS NULL; -- D2  Senior Database Administrator – NATURAL ADABAS
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 652 AND job_grade_id IS NULL; -- D2  Consultant Events Management
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 653 AND job_grade_id IS NULL; -- C1  Administrator Vetting
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 654 AND job_grade_id IS NULL; -- B4  Experiential Trainee: Network Engineer
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 655 AND job_grade_id IS NULL; -- D3  Lead Consultant Applications Development & Maintenance
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 656 AND job_grade_id IS NULL; -- D5  Senior Manager: Security Policy, Governance & Compliance
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 658 AND job_grade_id IS NULL; -- C5  Capacity Planner
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 659 AND job_grade_id IS NULL; -- D4  Lead Consultant Public Sector & Industry
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 660 AND job_grade_id IS NULL; -- C5  Human Capital Management Officer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 662 AND job_grade_id IS NULL; -- D5  Senior Manager: Security Development
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 663 AND job_grade_id IS NULL; -- D1  Senior Specialist: EUC Support Engineer (MOD 612)
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 664 AND job_grade_id IS NULL; -- D3  Lead Consultant: EUC LAN Infrastructure Management
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 666 AND job_grade_id IS NULL; -- D1  Senior Specialist Monitoring and Deployment
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 667 AND job_grade_id IS NULL; -- C5  Configuration Management Officer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 669 AND job_grade_id IS NULL; -- D5  Technical Lead: Service Delivery Management, Architecture an
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 670 AND job_grade_id IS NULL; -- C5  Specialist: Web Content Management
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 671 AND job_grade_id IS NULL; -- E1  Provincial Manager - Tier 2
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 672 AND job_grade_id IS NULL; -- C5  Specialist: Service Operations
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 674 AND job_grade_id IS NULL; -- D2  Senior Software Developer (Mobile Development)
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 675 AND job_grade_id IS NULL; -- C1  EUC SLA Portfolio Provisioning
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 676 AND job_grade_id IS NULL; -- C2  Secretariat Support - Committees Secretariat
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 677 AND job_grade_id IS NULL; -- C5  Specialist: Configuration Management
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 678 AND job_grade_id IS NULL; -- C2  Executive Assistant to the CFO
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 679 AND job_grade_id IS NULL; -- D1  Commodity Manager : ICT Software's
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 680 AND job_grade_id IS NULL; -- C1  Advanced Operational: LAN Engineer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 682 AND job_grade_id IS NULL; -- C5  Specialist: LAN Engineer
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 684 AND job_grade_id IS NULL; -- D3  Manager: Debt Management
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 685 AND job_grade_id IS NULL; -- D5  Senior Manager: Project Management Services
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 686 AND job_grade_id IS NULL; -- E2  Company Secretary
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 688 AND job_grade_id IS NULL; -- C5  Specialist: Electronic Document Delivery
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 689 AND job_grade_id IS NULL; -- C2  Practitioner: ETDP - Reviewed 17/03/2023
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 690 AND job_grade_id IS NULL; -- C5  Software Developer - COBOL/IMS (Legacy System)
UPDATE job_profiles SET job_grade_id = 9 WHERE job_profile_id = 691 AND job_grade_id IS NULL; -- B2  Team Leader COVID 19 Brigade
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 692 AND job_grade_id IS NULL; -- D2  Manager: Payroll
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 693 AND job_grade_id IS NULL; -- B4  FM: Assets & Store Controller
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 694 AND job_grade_id IS NULL; -- D3  Consultant: Transformation
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 695 AND job_grade_id IS NULL; -- B4  Admin: OD & Change Management
UPDATE job_profiles SET job_grade_id = 25 WHERE job_profile_id = 696 AND job_grade_id IS NULL; -- E3  HOD Hosting
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 697 AND job_grade_id IS NULL; -- D4  Lead Commercial Design and Packaging - IT Infra Services - d
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 698 AND job_grade_id IS NULL; -- D2  Senior Multimedia Designer
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 699 AND job_grade_id IS NULL; -- C5  Document and Records Management Officer
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 700 AND job_grade_id IS NULL; -- D3  Lead Consultant: Commercial Proposal Development
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 701 AND job_grade_id IS NULL; -- D5  Senior Manager: Network Strategy and Architecture
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 702 AND job_grade_id IS NULL; -- D1  Procurement Manager: Government ICT Non- Security Cluster
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 703 AND job_grade_id IS NULL; -- D3  Technical Consultant - updated
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 704 AND job_grade_id IS NULL; -- D1  Consultant: Information Management
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 705 AND job_grade_id IS NULL; -- D2  Consultant: ICT Project Assurance Risk Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 706 AND job_grade_id IS NULL; -- D3  Integration Architect
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 709 AND job_grade_id IS NULL; -- D4  Lead Consultant: Legal Compliance & Regulation
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 710 AND job_grade_id IS NULL; -- D4  Snr Manager Strategic Procurement
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 711 AND job_grade_id IS NULL; -- C2  Junior Mechanical Technician
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 712 AND job_grade_id IS NULL; -- D4  Lead: Cloud Transitioning Architect
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 713 AND job_grade_id IS NULL; -- D1  Manager : Transversal Contracts
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 714 AND job_grade_id IS NULL; -- D1  Cloud Solution Architect
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 715 AND job_grade_id IS NULL; -- D3  Advanced Specialist: System Administrator - HCI
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 716 AND job_grade_id IS NULL; -- D2  Consultant: System Engineer NMS
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 717 AND job_grade_id IS NULL; -- D3  Senior: Cloud Solution Architect
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 718 AND job_grade_id IS NULL; -- D4  Lead Consultant: Legal Compliance & Regulation - DOD
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 720 AND job_grade_id IS NULL; -- D4  Senior Manager Demand Planning
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 721 AND job_grade_id IS NULL; -- D1  Mechanical Technologist
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 722 AND job_grade_id IS NULL; -- D1  Manager : Panel Contracts
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 723 AND job_grade_id IS NULL; -- D2  Cloud Transitioning Architect
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 724 AND job_grade_id IS NULL; -- C2  Junior Electrical Technician
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 725 AND job_grade_id IS NULL; -- D3  Advanced Specialist: Infrastructure Strategy - HCI
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 726 AND job_grade_id IS NULL; -- D5  Senior Manager: Technology, Strategy and Security
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 727 AND job_grade_id IS NULL; -- D1  Electrical Technologist
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 728 AND job_grade_id IS NULL; -- D1  Manager: Demand Management
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 729 AND job_grade_id IS NULL; -- D4  Senior Manager: Government Clusters
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 730 AND job_grade_id IS NULL; -- D1  Manager Bid Specifications
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 732 AND job_grade_id IS NULL; -- D3  Consultant: Technical Architecture
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 733 AND job_grade_id IS NULL; -- D5  Senior Manager: Management Accounting (National)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 734 AND job_grade_id IS NULL; -- D5  Senior Manager: Integrity Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 736 AND job_grade_id IS NULL; -- D3  Manager: Physical Security
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 737 AND job_grade_id IS NULL; -- D4  Lead: Cloud Security Architect
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 738 AND job_grade_id IS NULL; -- D4  Lead Cloud Architect
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 742 AND job_grade_id IS NULL; -- D2  Consultant: Supplier Relationship Management
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 743 AND job_grade_id IS NULL; -- C1  Human Capital Administrator
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 744 AND job_grade_id IS NULL; -- C2  Human Capital Practitioner
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 745 AND job_grade_id IS NULL; -- D3  Lead Consultant Market Analyst
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 746 AND job_grade_id IS NULL; -- D1  Consultant: Infrastructure Provisioning
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 748 AND job_grade_id IS NULL; -- D4  Lead Consultant: Application Architect
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 749 AND job_grade_id IS NULL; -- D3  Lead: SaaS Vendor Management
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 750 AND job_grade_id IS NULL; -- D5  Senior Manager: Innovation Delivery
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 751 AND job_grade_id IS NULL; -- D1  Senior Space Planner
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 752 AND job_grade_id IS NULL; -- C5  Specialist: End User Computing (MOD612) - KZN
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 753 AND job_grade_id IS NULL; -- D1  Consultant: Infrastructure Contract Portfolio (NAT & DOD)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 755 AND job_grade_id IS NULL; -- D2  Consultant Organisation Design
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 756 AND job_grade_id IS NULL; -- B4  Operational: Commercial Design and Packaging (CDP)
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 757 AND job_grade_id IS NULL; -- C4  Specialist: Functional Application Support - IFASS DOD
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 758 AND job_grade_id IS NULL; -- C5  Specialist Content Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 759 AND job_grade_id IS NULL; -- D3  Advanced: Software Developer - Natural Adabas (Legacy System
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 760 AND job_grade_id IS NULL; -- C5  Specialist: End User Computing (MOD612)
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 761 AND job_grade_id IS NULL; -- C1  Junior Infrastructure Provisioning
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 763 AND job_grade_id IS NULL; -- D4  Senior Manager: Business Planning & Integration Services
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 764 AND job_grade_id IS NULL; -- D2  Senior Researcher (MOD 612)
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 765 AND job_grade_id IS NULL; -- D3  Advanced Hardware Technologist
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 766 AND job_grade_id IS NULL; -- D2  Lead Consultant: Researcher
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 768 AND job_grade_id IS NULL; -- B4  Chef
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 769 AND job_grade_id IS NULL; -- D2  Consultant Payroll and admin
UPDATE job_profiles SET job_grade_id = 10 WHERE job_profile_id = 770 AND job_grade_id IS NULL; -- B3  Fleet Administrator
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 771 AND job_grade_id IS NULL; -- D2  Senior Application DBA - Natural Adabas (Legacy System)
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 772 AND job_grade_id IS NULL; -- B5  Admin: Infrastructure Provisioning
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 773 AND job_grade_id IS NULL; -- C5  Supervisor Facilities Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 774 AND job_grade_id IS NULL; -- C5  Performance Management Officer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 775 AND job_grade_id IS NULL; -- D5  Senior Manager: WAN
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 776 AND job_grade_id IS NULL; -- D3  Senior Project Manager (Cloud Services)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 777 AND job_grade_id IS NULL; -- C5  Supervisor Logistics
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 778 AND job_grade_id IS NULL; -- D2  Senior Researcher (PSS)
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 779 AND job_grade_id IS NULL; -- D4  Lead Consultant: (Norms and Standards) Technical Infrastruct
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 781 AND job_grade_id IS NULL; -- C1  Advanced Operational: LAN & Desktop Support Technician
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 782 AND job_grade_id IS NULL; -- D4  Lead Consultant: Employee Relations
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 783 AND job_grade_id IS NULL; -- D2  Consultant: Organisational Change Management
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 784 AND job_grade_id IS NULL; -- C4  Service Marketing Officer
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 785 AND job_grade_id IS NULL; -- D1  Consultant Content Management - Knowledge Management
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 786 AND job_grade_id IS NULL; -- D3  Lead Consultant: Commercial Analyst
UPDATE job_profiles SET job_grade_id = 9 WHERE job_profile_id = 787 AND job_grade_id IS NULL; -- B2  Receptionist/Front Desk Officer
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 788 AND job_grade_id IS NULL; -- D2  Senior Specialist: Database Administartor
UPDATE job_profiles SET job_grade_id = 8 WHERE job_profile_id = 789 AND job_grade_id IS NULL; -- B1  Catering Attendant
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 790 AND job_grade_id IS NULL; -- D5  Senior Manager: Prototype Lab
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 791 AND job_grade_id IS NULL; -- C1  Admin: Information Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 792 AND job_grade_id IS NULL; -- C5  Supervisor: Asset Management
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 793 AND job_grade_id IS NULL; -- B4  FM: Procurement Administrator
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 796 AND job_grade_id IS NULL; -- D1  Consultant Services Marketing
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 797 AND job_grade_id IS NULL; -- D2  Senior Software Developer - Natural Adabas 2 (Legacy Systems
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 799 AND job_grade_id IS NULL; -- C4  Specialist: Commercial Design and Packaging Advisory Securit
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 800 AND job_grade_id IS NULL; -- D5  Senior Manager Ethics
UPDATE job_profiles SET job_grade_id = 26 WHERE job_profile_id = 801 AND job_grade_id IS NULL; -- E4  Executive: Governance, Risk, Compliance and Ethics
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 802 AND job_grade_id IS NULL; -- D5  Senior Manager: ICT Research & Innovation (MOD 612)
UPDATE job_profiles SET job_grade_id = 10 WHERE job_profile_id = 803 AND job_grade_id IS NULL; -- B3  Administrator: Reprographics
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 804 AND job_grade_id IS NULL; -- C3  Supervisor: Hospitality
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 805 AND job_grade_id IS NULL; -- D3  Senior Cloud Migration Specialist
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 806 AND job_grade_id IS NULL; -- D5  Senior Manager Corporate Social Responsibility
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 807 AND job_grade_id IS NULL; -- D3  Lead Consultant: LAB Services
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 808 AND job_grade_id IS NULL; -- D5  Senior Manager Commercial Design and Packaging
UPDATE job_profiles SET job_grade_id = 9 WHERE job_profile_id = 809 AND job_grade_id IS NULL; -- B2  Cashier
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 810 AND job_grade_id IS NULL; -- D1  Consultant Content Management - revised
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 811 AND job_grade_id IS NULL; -- D1  Consultant Public Service ICT Standards
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 812 AND job_grade_id IS NULL; -- D2  Manager: Performance Audit
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 813 AND job_grade_id IS NULL; -- D3  Manager: Structural Engineering Maintenance & Support
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 814 AND job_grade_id IS NULL; -- D4  Lead Consultant: Strategic Talent Sourcing and Retention
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 815 AND job_grade_id IS NULL; -- B4  Experiential Trainee: NOC
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 817 AND job_grade_id IS NULL; -- E2  HOD: Business Partnering
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 818 AND job_grade_id IS NULL; -- D3  Technical Manager Architecture
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 820 AND job_grade_id IS NULL; -- D1  Senior Specialist: Messaging Engineer
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 821 AND job_grade_id IS NULL; -- E2  HOD: OD , Transformation & Change
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 822 AND job_grade_id IS NULL; -- D2  Senior: Analyst Programmer
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 824 AND job_grade_id IS NULL; -- D5  Senior Manager: Engineering Support Services
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 828 AND job_grade_id IS NULL; -- D5  Senior Manager Strategic Stakeholder Management
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 829 AND job_grade_id IS NULL; -- B5  Admin: Infrastructure Contract Portfolio
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 830 AND job_grade_id IS NULL; -- B4  Handyman/Electrical Assistant
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 831 AND job_grade_id IS NULL; -- B5  Admin Assistant (HCM Team Support) (MOD 612)
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 832 AND job_grade_id IS NULL; -- D5  Portfolio Manager
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 833 AND job_grade_id IS NULL; -- D1  Consultant: Network Engineer
UPDATE job_profiles SET job_grade_id = 10 WHERE job_profile_id = 834 AND job_grade_id IS NULL; -- B3  Front Desk Officer/Receptionist
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 835 AND job_grade_id IS NULL; -- D1  Consultant Internal Communication (MOD 612)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 836 AND job_grade_id IS NULL; -- C5  Server Administrator
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 837 AND job_grade_id IS NULL; -- D3  Lead Consultant Marketing Operations
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 838 AND job_grade_id IS NULL; -- B4  Asset Management Officer
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 839 AND job_grade_id IS NULL; -- D4  Lead Consultant Public Service ICT Standards
UPDATE job_profiles SET job_grade_id = 9 WHERE job_profile_id = 840 AND job_grade_id IS NULL; -- B2  Admin: Asset Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 842 AND job_grade_id IS NULL; -- C5  Researcher (MOD 612)
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 843 AND job_grade_id IS NULL; -- D4  Data and AI Architect
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 845 AND job_grade_id IS NULL; -- C5  Server Administrator(KZN)
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 848 AND job_grade_id IS NULL; -- B4  Stock Controller: General Stores
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 849 AND job_grade_id IS NULL; -- D2  Consultant: Commercial Design and Packaging Application Deve
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 850 AND job_grade_id IS NULL; -- B5  Admin: Operator (Networks)
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 851 AND job_grade_id IS NULL; -- D2  Operations Manager: Switching Center
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 852 AND job_grade_id IS NULL; -- D5  Senior Manager: Corporate Communication
UPDATE job_profiles SET job_grade_id = 16 WHERE job_profile_id = 853 AND job_grade_id IS NULL; -- C4  Specialist: Functional Application Support (FAS)
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 854 AND job_grade_id IS NULL; -- D3  Lead Consultant Technical Testing
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 855 AND job_grade_id IS NULL; -- D2  Senior Application DBA
UPDATE job_profiles SET job_grade_id = 3 WHERE job_profile_id = 856 AND job_grade_id IS NULL; -- A1  Cleaner
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 857 AND job_grade_id IS NULL; -- D1  Consultant: NOC
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 858 AND job_grade_id IS NULL; -- C5  Software Developer - Natural Adabas (Legacy System)
UPDATE job_profiles SET job_grade_id = 11 WHERE job_profile_id = 859 AND job_grade_id IS NULL; -- B4  Stock Control Officer: Catering
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 861 AND job_grade_id IS NULL; -- E2  Head of Department: DOD & National Network Services
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 862 AND job_grade_id IS NULL; -- E2  Head of Department Norms, Standards and Quality
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 863 AND job_grade_id IS NULL; -- E1  Head of Department: Facilities Management and Physical Secur
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 864 AND job_grade_id IS NULL; -- E2  Head of Department: Products and Service Life Cycle
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 865 AND job_grade_id IS NULL; -- E2  Head of Department: Applications Development
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 866 AND job_grade_id IS NULL; -- E2  Head of Department: Service Delivery Management
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 867 AND job_grade_id IS NULL; -- E2  Head of Department: Strategic Stakeholder Management
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 868 AND job_grade_id IS NULL; -- E2  Head Of Department Strategic Project Manager
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 869 AND job_grade_id IS NULL; -- E2  Head of Department: Products Services and Solutions (MOD 612
UPDATE job_profiles SET job_grade_id = 25 WHERE job_profile_id = 870 AND job_grade_id IS NULL; -- E3  Head of Department: Enterprise Portfolio Management
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 871 AND job_grade_id IS NULL; -- E2  Head of Department: Facilities & Physical Security
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 873 AND job_grade_id IS NULL; -- E2  HOD: Business Partnering & Shared Services
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 874 AND job_grade_id IS NULL; -- E2  Head of Department Provincial Enablement
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 876 AND job_grade_id IS NULL; -- E2  Head of Department: Procurement
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 877 AND job_grade_id IS NULL; -- C5  Specialist: EUC Infrastructure Implementation
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 878 AND job_grade_id IS NULL; -- C5  Specialist: End User Computing Field Support
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 879 AND job_grade_id IS NULL; -- D2  Consultant Commercial Design and
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 880 AND job_grade_id IS NULL; -- D2  Consultant: Legal Compliance and Regulation
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 881 AND job_grade_id IS NULL; -- E2  Head of Department Innovation and Research Department
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 882 AND job_grade_id IS NULL; -- E2  Head of Department: Demand Management
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 883 AND job_grade_id IS NULL; -- E2  Head of Department: Strategy Office
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 884 AND job_grade_id IS NULL; -- E2  Head of Department: HCM COE
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 885 AND job_grade_id IS NULL; -- E1  Head of Department: Social and Ethics
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 887 AND job_grade_id IS NULL; -- E2  Head of Department: SAPS Network Services Department
UPDATE job_profiles SET job_grade_id = 22 WHERE job_profile_id = 888 AND job_grade_id IS NULL; -- D5  Senior Manager Applications Testing Services
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 889 AND job_grade_id IS NULL; -- E2  Head of Department: Contract Management
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 893 AND job_grade_id IS NULL; -- E2  Head of Department: IFASS
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 894 AND job_grade_id IS NULL; -- E2  Head of Department: Centre of Excellence
UPDATE job_profiles SET job_grade_id = 25 WHERE job_profile_id = 895 AND job_grade_id IS NULL; -- E3  Head of Department: Hosting
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 896 AND job_grade_id IS NULL; -- C5  Database Administrator IMS (Legacy System)
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 897 AND job_grade_id IS NULL; -- C5  Specialist Application Database Administrator
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 898 AND job_grade_id IS NULL; -- E2  Head of Department: Internal IT
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 899 AND job_grade_id IS NULL; -- D1  Procurement Manager: SITA LoB-ICT Cluster
UPDATE job_profiles SET job_grade_id = 19 WHERE job_profile_id = 900 AND job_grade_id IS NULL; -- D2  Consultant: Departmental Architecture
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 902 AND job_grade_id IS NULL; -- C2  Junior: Software Developer - Natural Adabase
UPDATE job_profiles SET job_grade_id = 23 WHERE job_profile_id = 903 AND job_grade_id IS NULL; -- E1  Head of Department: Legal Services
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 904 AND job_grade_id IS NULL; -- D4  Lead Consultant: OD & Change Management
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 905 AND job_grade_id IS NULL; -- E2  Head of Department: Customer Operations
UPDATE job_profiles SET job_grade_id = 12 WHERE job_profile_id = 906 AND job_grade_id IS NULL; -- B5  Admin: Organisational Development & Design
UPDATE job_profiles SET job_grade_id = 14 WHERE job_profile_id = 907 AND job_grade_id IS NULL; -- C2  Advanced Operational: Service Management
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 908 AND job_grade_id IS NULL; -- C5  Junior Project Manager (MOD 612) - Updated
UPDATE job_profiles SET job_grade_id = 20 WHERE job_profile_id = 909 AND job_grade_id IS NULL; -- D3  Lead Consultant: End User Computing (MOD
UPDATE job_profiles SET job_grade_id = 18 WHERE job_profile_id = 910 AND job_grade_id IS NULL; -- D1  Manager: Data Centre Operations - Centurion
UPDATE job_profiles SET job_grade_id = 25 WHERE job_profile_id = 911 AND job_grade_id IS NULL; -- E3  Head of Department Information Security
UPDATE job_profiles SET job_grade_id = 25 WHERE job_profile_id = 912 AND job_grade_id IS NULL; -- E3  Head of Department: Architecture
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 913 AND job_grade_id IS NULL; -- C5  Network Specialist
UPDATE job_profiles SET job_grade_id = 24 WHERE job_profile_id = 914 AND job_grade_id IS NULL; -- E2  HEAD OF DEPARTMENT: END USER COMPUTING
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 915 AND job_grade_id IS NULL; -- C5  Specialist: Service Billing and Payment
UPDATE job_profiles SET job_grade_id = 15 WHERE job_profile_id = 916 AND job_grade_id IS NULL; -- C3  Customer Relations Management  Administrator
UPDATE job_profiles SET job_grade_id = 17 WHERE job_profile_id = 918 AND job_grade_id IS NULL; -- C5  Specialist Disaster Recovery
UPDATE job_profiles SET job_grade_id = 13 WHERE job_profile_id = 919 AND job_grade_id IS NULL; -- C1  Junior Specialist Disaster Recovery
UPDATE job_profiles SET job_grade_id = 21 WHERE job_profile_id = 921 AND job_grade_id IS NULL; -- D4  Lead Consultant: Network Engineer

-- Verification queries (commented; uncomment to run interactively):
-- SELECT COUNT(*) FROM job_profiles WHERE client_id=2 AND job_grade_id IS NULL;
-- SELECT g.job_grade, COUNT(*) FROM job_profiles jp JOIN job_grades g ON g.job_grade_id=jp.job_grade_id WHERE jp.client_id=2 GROUP BY g.job_grade ORDER BY 2 DESC;

COMMIT;