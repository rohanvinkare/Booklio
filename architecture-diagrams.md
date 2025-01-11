# Bookilo - Architecture Diagrams

## High-Level Design (HLD)

```mermaid
graph TD
    Client[Client Applications] --> API[API Gateway/Express Server]
    API --> Auth[Authentication & Authorization]
    Auth --> CASL[CASL RBAC]
    
    API --> Services[Core Services]
    
    subgraph Services[Core Services]
        Books[Books Service]
        Users[Users Service]
        Orders[Orders Service]
        Sellers[Sellers Service]
        Management[Management Service]
    end
    
    Services --> Middleware[Middleware Layer]
    
    subgraph Middleware[Middleware Layer]
        AuthMW[Auth Middleware]
        ValidationMW[Validation]
        FileUploadMW[File Upload]
        CacheMW[Caching]
    end
    
    Middleware --> Database[(Database)]
    Middleware --> CloudStorage[(Cloud Storage)]
    Middleware --> Cache[(Cache Layer)]
```

## Low-Level Design (LLD)

```mermaid
graph TD
    subgraph Server[Express Server]
        Routes --> Middleware
        Middleware --> Controllers
        Controllers --> Services
        Services --> Models
    end

    subgraph Routes[Routes Layer]
        BookRoutes[Books API]
        UserRoutes[Users API]
        OrderRoutes[Orders API]
        SellerRoutes[Sellers API]
        AdminRoutes[Admin API]
        TokenRoutes[Token API]
    end

    subgraph Middleware[Middleware Layer]
        Auth[Authentication]
        CASL[RBAC]
        Validation[Input Validation]
        Multer[File Upload]
        Cache[Caching]
    end

    subgraph Controllers[Controllers]
        BookCtrl[Book Controller]
        UserCtrl[User Controller]
        OrderCtrl[Order Controller]
        SellerCtrl[Seller Controller]
        AdminCtrl[Admin Controller]
        TokenCtrl[Token Controller]
    end

    subgraph Models[Data Models]
        BookModel[Book Model]
        UserModel[User Model]
        OrderModel[Order Model]
        SellerModel[Seller Model]
        ManagementModel[Management Model]
        BlacklistModel[Blacklist Model]
        PaycutModel[Paycut Model]
    end

    subgraph Helpers[Helper Functions]
        Validation[Validation Helpers]
        FileOps[File Operations]
        Mail[Mail Helper]
    end
```

## Component Details

### Core Components:
1. **Authentication & Authorization**
   - JWT-based authentication
   - CASL-based RBAC for fine-grained permissions
   - Token blacklisting support

2. **User Management**
   - User registration and authentication
   - Profile management
   - Password reset functionality

3. **Book Management**
   - Book CRUD operations
   - Search and filtering
   - Image upload support

4. **Order System**
   - Order creation and management
   - Order status tracking
   - Payment integration

5. **Seller Management**
   - Seller registration and verification
   - Product management
   - Order fulfillment

6. **Admin Dashboard**
   - User management
   - System monitoring
   - Configuration management

### Technical Stack:
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (implied from models)
- **File Storage**: Cloud storage integration
- **Caching**: Node-cache implementation
- **API Documentation**: Swagger
- **Security**: JWT, CASL RBAC

### Key Features:
1. Role-Based Access Control (RBAC)
2. File upload support (local & cloud)
3. Input validation
4. Email notifications
5. Caching layer
6. API documentation
7. Error handling
8. Logging system
