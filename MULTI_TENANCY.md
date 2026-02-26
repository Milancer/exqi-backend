# Nexus Backend - Multi-Tenancy Architecture

## Overview

The Nexus backend implements a **multi-tenant architecture** with a special **Client 1 (ADMIN) pattern** where:

1. **Client 1** acts as the **global/system account** with full access to all data across all clients
2. **Other clients (Client 2+)** have **isolated data** but can **read** Client 1 resources (as shared/global data)
3. **Data separation** is enforced at the service layer using `clientId` filtering

---

## Core Concepts

### Client 1: The Global Account

**Client 1** is the **System/Admin Client** that serves as:

- ✅ **Global data repository** - Resources created by Client 1 are visible to all clients (read-only)
- ✅ **System administration** - ADMIN users belong to Client 1
- ✅ **Shared resources** - Master data, templates, or global configurations can be stored here
- ✅ **Full access** - Users with `clientId: 1` can see and manage ALL clients and ALL data

### Client 2+: Tenant Clients

**Regular clients** (Client 2, 3, 4, etc.) have:

- ❌ **Isolated data** - Can only see their own resources
- ✅ **Read access to Client 1** - Can view (but not modify) global resources from Client 1
- ❌ **No cross-tenant access** - Cannot see other clients' data (Client 2 cannot see Client 3)

---

## Role Hierarchy

```typescript
export enum UserRole {
  ADMIN = 'ADMIN', // System-wide admin (clientId = 1)
  OFFICE_MANAGER = 'OFFICE_MANAGER', // Client-specific admin (clientId > 1)
  OFFICE_USER = 'OFFICE_USER', // Client-specific basic user (clientId > 1)
}
```

### Role Constraints

| Role               | Allowed Client ID | Scope           | Capabilities                          |
| ------------------ | ----------------- | --------------- | ------------------------------------- |
| **ADMIN**          | **Must be 1**     | Global          | Full access to all clients and data   |
| **OFFICE_MANAGER** | **Must be > 1**   | Client-specific | Manage users/data within their client |
| **OFFICE_USER**    | **Must be > 1**   | Client-specific | View/use data within their client     |

> **Validation Rule:** ADMIN users MUST have `clientId = 1`, and office roles (MANAGER/USER) MUST have `clientId > 1`. This is enforced via custom validation decorators.

---

## Database Schema

### Client Entity

```typescript
@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number; // Client 1 = System Client

  @Column()
  name: string;

  @Column('text', { array: true, default: [] })
  modules: string[]; // Assigned feature modules (e.g., 'Job Profile', 'CBI')

  // ... contact details, logo, timestamps
}
```

### User Entity

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  clientId: number; // Foreign key to Client

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  // ... name, password, status, timestamps
}
```

**Key Points:**

- Every user belongs to exactly ONE client via `clientId`
- Users cannot switch clients (multi-client access requires separate accounts)
- The `client` relationship is loaded during authentication to include `modules` in JWT

---

## Authentication & JWT Payload

### JWT Payload Structure

```typescript
{
  sub: userId,           // User ID
  email: user.email,     // User email
  role: user.role,       // UserRole enum
  clientId: user.clientId, // Client ID (1 for ADMIN)
  clientModules: user.client?.modules || [] // Assigned modules
}
```

### JWT Strategy

```typescript
// src/auth/jwt.strategy.ts
async validate(payload: any) {
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
    clientId: payload.clientId,
    clientModules: payload.clientModules
  };
}
```

**Result:** Every authenticated request has access to `req.user.clientId` and `req.user.role` for filtering.

---

## Multi-Tenancy Filtering Patterns

### Pattern 1: Users Service (Strict Isolation)

**Rule:** Users can only see users within their own client, EXCEPT ADMIN (Client 1) sees all.

```typescript
// src/users/users.service.ts
async findAll(currentUser: any) {
  // Admins can see all users
  if (currentUser.role === UserRole.ADMIN) {
    return this.usersRepository.find();
  }
  // Others can only see users in their own client
  return this.usersRepository.find({
    where: { clientId: currentUser.clientId },
  });
}

async findOne(id: number, currentUser: any) {
  const user = await this.usersRepository.findOneBy({ id });
  if (!user) throw new NotFoundException('User not found');

  // Admins can see anyone
  if (currentUser.role === UserRole.ADMIN) return user;

  // Users can only see users in their own client
  if (user.clientId !== currentUser.clientId) {
    throw new NotFoundException('User not found');
  }

  return user;
}
```

**Data Flow:**

```
Client 1 (ADMIN) → Sees ALL users (Client 1, 2, 3, ...)
Client 2 (Manager) → Sees ONLY Client 2 users
Client 3 (User) → Sees ONLY Client 3 users
```

---

### Pattern 2: Clients Service (Global + Own Client)

**Rule:** Clients can see their own client AND Client 1 (global resources), EXCEPT ADMIN sees all.

```typescript
// src/clients/clients.service.ts
async findAll(user: any) {
  // Admins (Client 1) can see everything
  if (user.clientId === 1) {
    return this.clientsRepository.find();
  }
  // Others can see their own client AND the System Client (Read-Only)
  return this.clientsRepository.find({
    where: [{ id: user.clientId }, { id: 1 }],
  });
}

async findOne(id: number, user: any) {
  const client = await this.clientsRepository.findOneBy({ id });
  if (!client) throw new NotFoundException('Client not found');

  // Admins can see any client
  if (user.clientId === 1) return client;

  // Users can only see their own client OR the System Client
  if (client.id !== user.clientId && client.id !== 1) {
    throw new NotFoundException('Client not found'); // Hide unauthorized clients
  }

  return client;
}
```

**Data Flow:**

```
Client 1 (ADMIN) → Sees ALL clients (1, 2, 3, ...)
Client 2 (Manager) → Sees Client 1 (read-only) + Client 2 (own)
Client 3 (User) → Sees Client 1 (read-only) + Client 3 (own)
```

**Use Case:** Client 1 can store global templates, master data, or shared configurations that all clients can reference.

---

## Role-Based Access Control (RBAC)

### Roles Guard

```typescript
// src/auth/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // No role restriction
    }
    const { user } = context.switchToHttp().getRequest();

    // Admins can access everything
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
```

**Key Behavior:**

- ✅ **ADMIN bypasses all role checks** - Can access any endpoint
- ✅ **Role-specific endpoints** - Use `@Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)` decorator
- ✅ **Automatic enforcement** - Applied via `@UseGuards(JwtAuthGuard, RolesGuard)`

### Example: Clients Controller

```typescript
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  @Post()
  @Roles(UserRole.ADMIN) // Only ADMIN can create clients
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER) // ADMIN + Managers
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user); // Filtered by clientId
  }
}
```

---

## Role Validation Rules

### Custom Validation Decorator

```typescript
// src/users/dto/role-validation.decorator.ts
export function IsValidRoleClientCombination(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidRoleClientCombination',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const role = obj.role;
          const clientId = obj.clientId;

          // ADMIN must be Client 1
          if (role === UserRole.ADMIN && clientId !== 1) {
            return false;
          }

          // Office roles must NOT be Client 1
          if (
            (role === UserRole.OFFICE_MANAGER ||
              role === UserRole.OFFICE_USER) &&
            clientId === 1
          ) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'ADMIN users must belong to Client 1, and office roles must belong to Client > 1';
        },
      },
    });
  };
}
```

**Applied to DTOs:**

```typescript
export class CreateUserDto {
  @IsEnum(UserRole)
  role: UserRole;

  @IsInt()
  @IsValidRoleClientCombination() // Custom validation
  clientId: number;
}
```

---

## Seeding & Initialization

### Seed Script

```typescript
// seed.ts
async function bootstrap() {
  // 1. Create System Client (ID: 1)
  const sysClient = await clientsService.create({
    name: 'System Client',
    industry: 'Internal',
    division: 'Admin',
    // ... contact details
  });

  // 2. Create System Admin User
  await usersService.create({
    name: 'System',
    surname: 'Admin',
    email: 'sysadmin@nexus.com',
    password: 'syspassword',
    role: UserRole.ADMIN, // ADMIN role
    clientId: sysClient.id, // Must be Client 1
    status: UserStatus.ACTIVE,
  });
}
```

**Run:** `npm run seed` (or `ts-node seed.ts`)

---

## Data Flow Diagrams

### User Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Login (POST /auth/login)                           │
│    - Email: user@client2.com                               │
│    - Password: ********                                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AuthService validates credentials                        │
│    - Query User by email                                    │
│    - Compare bcrypt hash                                    │
│    - Load Client relationship (for modules)                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Generate JWT with payload:                              │
│    {                                                        │
│      sub: 42,                                               │
│      email: "user@client2.com",                             │
│      role: "OFFICE_USER",                                   │
│      clientId: 2,                                           │
│      clientModules: ["Job Profile"]                         │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Return access_token to client                           │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Data Access Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Request: GET /users                                         │
│ Headers: Authorization: Bearer <JWT>                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ JwtAuthGuard validates token → req.user = JWT payload       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ RolesGuard checks required roles (if any)                  │
│ - ADMIN bypasses all checks                                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ UsersService.findAll(req.user)                              │
│                                                             │
│ IF req.user.role === ADMIN:                                 │
│   → SELECT * FROM users                                     │
│                                                             │
│ ELSE:                                                       │
│   → SELECT * FROM users WHERE clientId = req.user.clientId  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Return filtered results                                     │
│ - Client 1 (ADMIN): All users                               │
│ - Client 2 (User): Only Client 2 users                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

### ✅ DO

1. **Always filter by `clientId`** in service methods (except for ADMIN)
2. **Check `user.role === UserRole.ADMIN`** before allowing global access
3. **Use `@Roles()` decorator** to restrict endpoints by role
4. **Validate role-client combinations** in DTOs (ADMIN = Client 1, others > 1)
5. **Load client relationship** during authentication to include modules in JWT
6. **Return 404 instead of 403** when hiding unauthorized resources (security through obscurity)

### ❌ DON'T

1. **Don't trust frontend filtering** - Always enforce at the service layer
2. **Don't allow office roles on Client 1** - Use validation decorators
3. **Don't allow ADMIN on Client > 1** - Enforce Client 1 constraint
4. **Don't skip `currentUser` parameter** in service methods that need filtering
5. **Don't expose cross-tenant data** in error messages or logs

---

## Module-Based Feature Gating

### Client Modules

```typescript
export enum ClientModule {
  JOB_PROFILE = 'Job Profile',
  COMPETENCY_BASED_INTERVIEW = 'Competency Based Interview',
}
```

**Stored in:** `Client.modules` (text array)

**Included in JWT:** `clientModules` field

**Usage:**

```typescript
// Example: Check if user's client has CBI module
if (req.user.clientModules.includes('Competency Based Interview')) {
  // Allow access to CBI features
}
```

**Admin Endpoint:**

```typescript
@Get('modules')
@Roles(UserRole.ADMIN)
getModules() {
  return Object.values(ClientModule); // Returns all available modules
}
```

---

## Verification & Testing

### Automated Verification Script

**Run:** `node verify_rbac.js`

**Tests:**

1. ✅ System Admin can create clients
2. ✅ Manager A can access their own client (Client A)
3. ❌ Manager A CANNOT access other clients (Client B)
4. ✅ Manager A can see Client 1 (System Client) in list
5. ❌ Manager A CANNOT see Client B in list

---

## Summary

| Aspect              | Client 1 (ADMIN)     | Client 2+ (Tenants)          |
| ------------------- | -------------------- | ---------------------------- |
| **Role**            | System Admin         | OFFICE_MANAGER / OFFICE_USER |
| **Scope**           | Global (all clients) | Single client only           |
| **User Access**     | All users            | Own client users only        |
| **Client Access**   | All clients          | Own client + Client 1 (read) |
| **Data Visibility** | Everything           | Own data + Client 1 data     |
| **Create Clients**  | ✅ Yes               | ❌ No                        |
| **Assign Modules**  | ✅ Yes               | ❌ No                        |
| **Cross-Tenant**    | ✅ Yes               | ❌ No                        |

---

## Key Takeaways

1. **Client 1 is special** - It's the global/system account with full access
2. **Data separation is service-layer** - Not database-level (no row-level security)
3. **ADMIN role = Client 1** - Enforced via validation
4. **Shared resources pattern** - Client 1 data is visible to all (read-only)
5. **JWT carries context** - `clientId`, `role`, and `clientModules` enable filtering
6. **Defense in depth** - Guards check roles, services filter by clientId

This architecture enables:

- ✅ **Multi-tenancy** with strict data isolation
- ✅ **Global resources** shared across all clients
- ✅ **Flexible RBAC** with role-based and client-based access control
- ✅ **Module licensing** per client
