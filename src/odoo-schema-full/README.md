# Coffee Selection Central System - النظام المركزي لاختيار القهوة

## Overview - نظرة عامة

This is the **ONLY** central system for all Odoo, GraphQL, Redis, and backend operations in the Coffee Selection application. All other files should import from this central system.

هذا هو النظام المركزي **الوحيد** لجميع عمليات Odoo و GraphQL و Redis والعمليات الخلفية في تطبيق Coffee Selection. يجب على جميع الملفات الأخرى الاستيراد من هذا النظام المركزي.

## 🚨 IMPORTANT - مهم جداً

**⚠️ CRITICAL RULE: NO DUPLICATION ALLOWED**

- **ALL** Odoo/GraphQL/Redis logic MUST be in this central folder
- **NO** duplicate types, queries, mutations, or connection logic outside this folder
- **ALL** imports must come from this central system
- **FUTURE** development must ONLY happen inside this folder

**⚠️ قاعدة حرجة: لا يُسمح بالتكرار**

- **جميع** منطق Odoo/GraphQL/Redis يجب أن يكون في هذا المجلد المركزي
- **لا** أنواع أو استعلامات أو طفرات أو منطق اتصال مكرر خارج هذا المجلد
- **جميع** الاستيرادات يجب أن تأتي من هذا النظام المركزي
- **التطوير المستقبلي** يجب أن يحدث فقط داخل هذا المجلد

## 📁 Central System Structure - هيكل النظام المركزي

```
src/types/odoo-schema-full/
├── index.ts                 # Main entry point - نقطة الدخول الرئيسية
├── central-system.ts        # All configurations - جميع الإعدادات
├── apollo-client.ts         # Apollo Client setup - إعداد Apollo Client
├── redis-client.ts          # Redis client & cache - عميل Redis والتخزين المؤقت
├── sync-manager.ts          # Data synchronization - مزامنة البيانات
├── README.md               # This documentation - هذا التوثيق
├── hooks/                  # React hooks - React Hooks
├── types/                  # TypeScript types - أنواع TypeScript
├── queries/                # GraphQL queries - استعلامات GraphQL
├── mutations/              # GraphQL mutations - طفرات GraphQL
└── lifecycles/             # Component lifecycles - دورات حياة المكونات
```

## 🚀 Quick Start - البدء السريع

### Import from Central System - الاستيراد من النظام المركزي

```typescript
// ✅ CORRECT - صحيح
import {
	unifiedOdooService,
	COFFEE_SELECTION_CONFIG,
} from "@/types/odoo-schema-full";

// ❌ WRONG - خطأ
import { apolloClient } from "@/services/apollo";
import { redisClient } from "@/lib/redis";
```

### Initialize the System - تهيئة النظام

```typescript
import { unifiedOdooService } from "@/types/odoo-schema-full";

// Initialize all services
await unifiedOdooService.initialize();

// Check system health
const health = await unifiedOdooService.checkHealth();
console.log("System Health:", health);

// Use services
const products = await unifiedOdooService.apollo.getProducts();
const cachedData = await unifiedOdooService.cache.get("products");
```

## 🔧 Core Components - المكونات الأساسية

### 1. Unified Odoo Service - الخدمة الموحدة لـ Odoo

```typescript
import { unifiedOdooService } from "@/types/odoo-schema-full";

// Access all services through unified interface
const { apollo, cache, realtime, sync, config } = unifiedOdooService;

// Initialize system
await unifiedOdooService.initialize();

// Check health
const health = await unifiedOdooService.checkHealth();

// Shutdown system
await unifiedOdooService.shutdown();
```

### 2. Apollo Client - عميل Apollo

```typescript
import { apolloClient } from "@/types/odoo-schema-full";

// Initialize Apollo Client
await apolloClient.initialize();

// Check connection
const isConnected = await apolloClient.checkConnection();

// Execute queries
const products = await apolloClient.query({
	query: GET_PRODUCTS,
	variables: { limit: 10 },
});
```

### 3. Redis Client - عميل Redis

```typescript
import { cacheService, realtimeService } from "@/types/odoo-schema-full";

// Cache operations
await cacheService.set("products", productsData, 3600);
const cachedProducts = await cacheService.get("products");

// Real-time operations
await realtimeService.subscribe("orders", (data) => {
	console.log("New order:", data);
});
```

### 4. Sync Manager - مدير المزامنة

```typescript
import { syncManager } from "@/types/odoo-schema-full";

// Initialize sync manager
await syncManager.initialize();

// Get sync status
const status = syncManager.getStatus();

// Add sync operation
syncManager.addOperation({
	type: "UPDATE",
	entity: "PRODUCT",
	entityId: "123",
	data: { price: 29.99 },
});
```

## 📋 Configuration - الإعدادات

### Environment Variables - متغيرات البيئة

All configuration comes from `src/constants/environment-keys.ts`:

```typescript
import { COFFEE_SELECTION_CONFIG } from "@/types/odoo-schema-full";

// Odoo Configuration
const odooConfig = COFFEE_SELECTION_CONFIG.ODOO;

// Redis Configuration
const redisConfig = COFFEE_SELECTION_CONFIG.REDIS;

// Aramex Configuration
const aramexConfig = COFFEE_SELECTION_CONFIG.ARAMEX;
```

### Available Configurations - الإعدادات المتاحة

- `COFFEE_SELECTION_CONFIG` - Main configuration
- `REDIS_SYNC_CONFIG` - Redis sync settings
- `APOLLO_CONFIG` - Apollo Client settings
- `GRAPHQL_CONFIG` - GraphQL settings
- `CACHE_CONFIG` - Cache settings
- `VALIDATION_CONFIG` - Validation rules
- `ERROR_CONFIG` - Error handling
- `LOGGING_CONFIG` - Logging settings
- `PERFORMANCE_CONFIG` - Performance settings
- `SECURITY_CONFIG` - Security settings

## 🔄 Data Flow - تدفق البيانات

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Central System │    │   Odoo/GraphQL  │
│                 │    │                 │    │                 │
│ React Components│◄──►│ unifiedOdooService│◄──►│  GraphQL API    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │                 │
                       │ Cache Service   │
                       │ Realtime Service│
                       └─────────────────┘
```

## 🧪 Testing - الاختبار

### Unit Tests - اختبارات الوحدات

```typescript
import { unifiedOdooService } from "@/types/odoo-schema-full";

describe("Central System Tests", () => {
	beforeEach(async () => {
		await unifiedOdooService.initialize();
	});

	afterEach(async () => {
		await unifiedOdooService.shutdown();
	});

	test("should connect to Odoo", async () => {
		const health = await unifiedOdooService.checkHealth();
		expect(health.overall).toBe(true);
	});
});
```

### Integration Tests - اختبارات التكامل

```typescript
import {
	testOdooConnection,
	fetchRealProductsData,
} from "@/types/odoo-schema-full";

describe("Odoo Integration Tests", () => {
	test("should fetch real products", async () => {
		const result = await fetchRealProductsData();
		expect(result.success).toBe(true);
		expect(result.data.length).toBeGreaterThan(0);
	});
});
```

## 🚨 Migration Guide - دليل الهجرة

### From Old System - من النظام القديم

**BEFORE - قبل:**

```typescript
// ❌ Old way - الطريقة القديمة
import { apolloClient } from "@/services/apollo";
import { redisClient } from "@/lib/redis";
import { odooService } from "@/services/odoo";
```

**AFTER - بعد:**

```typescript
// ✅ New way - الطريقة الجديدة
import { unifiedOdooService } from "@/types/odoo-schema-full";

const { apollo, cache, realtime } = unifiedOdooService;
```

### Files to Update - الملفات المطلوب تحديثها

1. **Components** - المكونات

   - Update all imports to use central system
   - تحديث جميع الاستيرادات لاستخدام النظام المركزي

2. **Services** - الخدمات

   - Remove duplicate services
   - إزالة الخدمات المكررة

3. **Tests** - الاختبارات

   - Update test imports
   - تحديث استيرادات الاختبارات

4. **Configuration** - الإعدادات
   - Use central configuration only
   - استخدام الإعدادات المركزية فقط

## 🔒 Security - الأمان

### Authentication - المصادقة

```typescript
import { unifiedOdooService } from "@/types/odoo-schema-full";

// Login user
const loginResult = await unifiedOdooService.apollo.loginUser(email, password);

// Check authentication
const isAuthenticated = await unifiedOdooService.apollo.isAuthenticated();
```

### Authorization - التفويض

```typescript
// Check user permissions
const hasPermission = await unifiedOdooService.apollo.checkPermission(
	userId,
	"read:products",
);
```

## 📊 Monitoring - المراقبة

### Health Checks - فحوصات الصحة

```typescript
import { unifiedOdooService } from "@/types/odoo-schema-full";

// Check system health
const health = await unifiedOdooService.checkHealth();

if (!health.overall) {
	console.error("System health check failed:", health);
	// Handle system issues
}
```

### Performance Monitoring - مراقبة الأداء

```typescript
// Monitor response times
const startTime = Date.now();
const result = await unifiedOdooService.apollo.getProducts();
const responseTime = Date.now() - startTime;

if (responseTime > 5000) {
	console.warn("Slow response time:", responseTime);
}
```

## 🐛 Troubleshooting - استكشاف الأخطاء

### Common Issues - المشاكل الشائعة

1. **Connection Failed - فشل الاتصال**

   ```typescript
   // Check environment variables
   console.log("Odoo URL:", COFFEE_SELECTION_CONFIG.ODOO.BASE_URL);
   console.log("Redis URL:", COFFEE_SELECTION_CONFIG.REDIS.URL);
   ```

2. **Authentication Error - خطأ المصادقة**

   ```typescript
   // Check token
   const token = localStorage.getItem("coffee_selection_token");
   if (!token) {
   	// Redirect to login
   }
   ```

3. **Cache Issues - مشاكل التخزين المؤقت**
   ```typescript
   // Clear cache
   await unifiedOdooService.cache.clear();
   ```

### Debug Mode - وضع التصحيح

```typescript
// Enable debug logging
if (COFFEE_SELECTION_CONFIG.APP.IS_DEVELOPMENT) {
	console.log("Debug mode enabled");
	// Additional debug information
}
```

## 📚 API Reference - مرجع API

### Unified Service Methods - طرق الخدمة الموحدة

- `initialize()` - Initialize all services
- `checkHealth()` - Check system health
- `shutdown()` - Shutdown all services

### Apollo Client Methods - طرق عميل Apollo

- `initialize()` - Initialize Apollo Client
- `checkConnection()` - Check GraphQL connection
- `query()` - Execute GraphQL query
- `mutate()` - Execute GraphQL mutation
- `subscribe()` - Subscribe to GraphQL subscription

### Cache Service Methods - طرق خدمة التخزين المؤقت

- `set(key, value, ttl)` - Set cache value
- `get(key)` - Get cache value
- `delete(key)` - Delete cache value
- `clear()` - Clear all cache
- `checkConnection()` - Check Redis connection

### Realtime Service Methods - طرق خدمة الوقت الحقيقي

- `subscribe(channel, callback)` - Subscribe to channel
- `publish(channel, data)` - Publish to channel
- `unsubscribe(channel)` - Unsubscribe from channel

## 🤝 Contributing - المساهمة

### Development Rules - قواعد التطوير

1. **ALL** new Odoo/GraphQL/Redis logic MUST go in this folder
2. **NO** duplicate logic outside this folder
3. **ALL** imports must come from this central system
4. **UPDATE** this README when adding new features
5. **TEST** all new functionality thoroughly

### Code Style - أسلوب الكود

- Use TypeScript for all files
- Follow existing naming conventions
- Add comprehensive JSDoc comments
- Include Arabic translations in comments
- Write unit tests for all new functions

## 📄 License - الترخيص

This central system is part of the Coffee Selection application and follows the same license terms.

هذا النظام المركزي هو جزء من تطبيق Coffee Selection ويتبع نفس شروط الترخيص.

---

**⚠️ REMEMBER: This is the ONLY source of truth for all backend operations!**

**⚠️ تذكر: هذا هو المصدر الوحيد للحقيقة لجميع العمليات الخلفية!**
