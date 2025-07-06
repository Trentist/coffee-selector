# 🔄 نظام المزامنة عبر Redis - التوثيق الكامل

## 📋 نظرة عامة

نظام المزامنة عبر Redis يوفر تخزين مؤقت سريع ومزامنة البيانات بين الخادم والعميل في تطبيق Coffee Selection.

## 🏗️ البنية المعمارية

### المكونات الأساسية

```typescript
// src/services/redis.service.ts
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  ttl: number;
  prefix: string;
}

class RedisService {
  // Core Redis operations
  async set(key: string, value: any, ttl?: number): Promise<boolean>
  async get(key: string): Promise<any>
  async del(key: string): Promise<boolean>
  async clear(): Promise<boolean>
}
```

### خدمات التكامل

```typescript
// src/services/cache.service.ts
class CacheService {
  // High-level caching operations
  async cacheProductData(productId: number, data: any): Promise<void>
  async getCachedProduct(productId: number): Promise<any>
  async invalidateProductCache(productId: number): Promise<void>
}
```

## 🔧 التكوين والإعداد

### متغيرات البيئة

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
CACHE_TTL=3600
CACHE_PREFIX=coffee_selection
```

### تكوين Odoo

```ini
# /home/odoo/.config/odoo/odoo.conf
[options]
redis_host = localhost
redis_port = 6379
redis_db = 0
redis_password = 
redis_timeout = 5
redis_max_connections = 10
redis_url = redis://localhost:6379/0
```

## 📊 استراتيجيات التخزين المؤقت

### 1. تخزين بيانات المنتجات

```typescript
// Cache product data with automatic expiration
const cacheProductData = async (productId: number, productData: any) => {
  const cacheKey = `product:${productId}`;
  await redisService.set(cacheKey, productData, 1800); // 30 minutes
};

// Retrieve cached product data
const getCachedProduct = async (productId: number) => {
  const cacheKey = `product:${productId}`;
  return await redisService.get(cacheKey);
};
```

### 2. تخزين جلسات المستخدم

```typescript
// Cache user session data
const cacheUserSession = async (userId: string, sessionData: any) => {
  const cacheKey = `session:${userId}`;
  await redisService.set(cacheKey, sessionData, 7200); // 2 hours
};

// Retrieve user session
const getUserSession = async (userId: string) => {
  const cacheKey = `session:${userId}`;
  return await redisService.get(cacheKey);
};
```

### 3. تخزين سلة التسوق

```typescript
// Cache shopping cart
const cacheShoppingCart = async (sessionId: string, cartData: any) => {
  const cacheKey = `cart:${sessionId}`;
  await redisService.set(cacheKey, cartData, 3600); // 1 hour
};

// Retrieve shopping cart
const getShoppingCart = async (sessionId: string) => {
  const cacheKey = `cart:${sessionId}`;
  return await redisService.get(cacheKey);
};
```

## 🔄 آليات المزامنة

### مزامنة البيانات مع Odoo

```typescript
class OdooRedisSyncService {
  // Sync product data from Odoo to Redis
  async syncProductsToRedis(): Promise<void> {
    try {
      const products = await odooService.getProducts();
      
      for (const product of products.products.products) {
        await redisService.set(
          `product:${product.id}`,
          product,
          1800 // 30 minutes TTL
        );
      }
      
      console.log(`Synced ${products.products.products.length} products to Redis`);
    } catch (error) {
      console.error('Product sync failed:', error);
    }
  }

  // Sync user data from Odoo to Redis
  async syncUserToRedis(userId: string): Promise<void> {
    try {
      const userData = await odooService.getUser(userId);
      
      await redisService.set(
        `user:${userId}`,
        userData,
        3600 // 1 hour TTL
      );
      
      console.log(`Synced user ${userId} to Redis`);
    } catch (error) {
      console.error('User sync failed:', error);
    }
  }
}
```

### مزامنة الوقت الفعلي

```typescript
class RealtimeSyncService {
  // Real-time product updates
  async onProductUpdate(productId: number): Promise<void> {
    // Invalidate cache
    await redisService.del(`product:${productId}`);
    
    // Fetch fresh data from Odoo
    const freshData = await odooService.getProduct(productId);
    
    // Update cache
    await redisService.set(`product:${productId}`, freshData, 1800);
    
    // Notify connected clients (WebSocket/SSE)
    this.notifyClients('product_updated', { productId, data: freshData });
  }

  // Real-time cart synchronization
  async onCartUpdate(sessionId: string, cartData: any): Promise<void> {
    // Update Redis cache
    await redisService.set(`cart:${sessionId}`, cartData, 3600);
    
    // Sync with Odoo if user is authenticated
    if (cartData.userId) {
      await odooService.updateUserCart(cartData.userId, cartData);
    }
  }
}
```

## 🛡️ معالجة الأخطاء والتعافي

### نظام Fallback

```typescript
class ResilientCacheService {
  async getWithFallback(key: string, fallbackFn: () => Promise<any>): Promise<any> {
    try {
      // Try Redis first
      const cached = await redisService.get(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn('Redis get failed, using fallback:', error);
    }

    // Fallback to original data source
    try {
      const data = await fallbackFn();
      
      // Try to cache the result
      try {
        await redisService.set(key, data);
      } catch (cacheError) {
        console.warn('Failed to cache fallback data:', cacheError);
      }
      
      return data;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
}
```

### إعادة الاتصال التلقائي

```typescript
class RedisConnectionManager {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  async handleConnectionError(error: Error): Promise<void> {
    console.error('Redis connection error:', error);
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
      
      try {
        await redisService.testConnection();
        this.reconnectAttempts = 0;
        console.log('Redis reconnected successfully');
      } catch (reconnectError) {
        await this.handleConnectionError(reconnectError);
      }
    } else {
      console.error('Max reconnection attempts reached, switching to fallback mode');
      this.enableFallbackMode();
    }
  }

  private enableFallbackMode(): void {
    // Switch to localStorage/memory-based caching
    console.log('Enabling fallback caching mode');
  }
}
```

## 📈 مراقبة الأداء

### مؤشرات الأداء الرئيسية

```typescript
class RedisMetricsService {
  private metrics = {
    hits: 0,
    misses: 0,
    errors: 0,
    totalRequests: 0,
    averageResponseTime: 0
  };

  async trackCacheHit(key: string, responseTime: number): Promise<void> {
    this.metrics.hits++;
    this.metrics.totalRequests++;
    this.updateAverageResponseTime(responseTime);
    
    console.log(`Cache HIT for key: ${key} (${responseTime}ms)`);
  }

  async trackCacheMiss(key: string): Promise<void> {
    this.metrics.misses++;
    this.metrics.totalRequests++;
    
    console.log(`Cache MISS for key: ${key}`);
  }

  getHitRatio(): number {
    return this.metrics.totalRequests > 0 
      ? (this.metrics.hits / this.metrics.totalRequests) * 100 
      : 0;
  }

  getMetrics() {
    return {
      ...this.metrics,
      hitRatio: this.getHitRatio()
    };
  }
}
```

## 🔒 الأمان والحماية

### تشفير البيانات الحساسة

```typescript
class SecureRedisService {
  private encryptionKey = process.env.REDIS_ENCRYPTION_KEY;

  async setSecure(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const encryptedValue = this.encrypt(JSON.stringify(value));
      return await redisService.set(key, encryptedValue, ttl);
    } catch (error) {
      console.error('Secure set failed:', error);
      return false;
    }
  }

  async getSecure(key: string): Promise<any> {
    try {
      const encryptedValue = await redisService.get(key);
      if (!encryptedValue) return null;
      
      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Secure get failed:', error);
      return null;
    }
  }

  private encrypt(text: string): string {
    // Implement encryption logic
    return text; // Placeholder
  }

  private decrypt(encryptedText: string): string {
    // Implement decryption logic
    return encryptedText; // Placeholder
  }
}
```

## 🧪 استراتيجيات الاختبار

### اختبار الوحدة

```typescript
describe('RedisService', () => {
  beforeEach(async () => {
    await redisService.clear();
  });

  test('should set and get data correctly', async () => {
    const testData = { id: 1, name: 'Test Product' };
    
    await redisService.set('test:product:1', testData);
    const retrieved = await redisService.get('test:product:1');
    
    expect(retrieved).toEqual(testData);
  });

  test('should handle TTL expiration', async () => {
    const testData = { id: 1, name: 'Test Product' };
    
    await redisService.set('test:product:1', testData, 1); // 1 second TTL
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    const retrieved = await redisService.get('test:product:1');
    expect(retrieved).toBeNull();
  });
});
```

### اختبار التكامل

```typescript
describe('Redis-Odoo Integration', () => {
  test('should sync product data from Odoo to Redis', async () => {
    const syncService = new OdooRedisSyncService();
    
    await syncService.syncProductsToRedis();
    
    // Verify data is cached
    const cachedProduct = await redisService.get('product:1');
    expect(cachedProduct).toBeDefined();
    expect(cachedProduct.id).toBe(1);
  });
});
```

## 📊 إحصائيات الاستخدام

### تقرير الأداء اليومي

```typescript
class RedisReportingService {
  async generateDailyReport(): Promise<any> {
    const metrics = redisMetricsService.getMetrics();
    
    return {
      date: new Date().toISOString().split('T')[0],
      totalRequests: metrics.totalRequests,
      cacheHits: metrics.hits,
      cacheMisses: metrics.misses,
      hitRatio: metrics.hitRatio,
      averageResponseTime: metrics.averageResponseTime,
      errors: metrics.errors,
      uptime: this.calculateUptime(),
      memoryUsage: await this.getMemoryUsage()
    };
  }

  private calculateUptime(): number {
    // Calculate Redis uptime
    return 0; // Placeholder
  }

  private async getMemoryUsage(): Promise<number> {
    // Get Redis memory usage
    return 0; // Placeholder
  }
}
```

## 🔧 أدوات الصيانة

### تنظيف البيانات المنتهية الصلاحية

```typescript
class RedisMaintenanceService {
  async cleanupExpiredKeys(): Promise<void> {
    try {
      // This would typically be handled by Redis automatically
      // But we can implement custom cleanup logic here
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  async optimizeMemoryUsage(): Promise<void> {
    try {
      // Implement memory optimization strategies
      console.log('Memory optimization completed');
    } catch (error) {
      console.error('Memory optimization failed:', error);
    }
  }
}
```

---

## 📞 الدعم الفني

للحصول على المساعدة مع نظام Redis:

1. **مراجعة السجلات**: تحقق من سجلات Redis و Odoo
2. **اختبار الاتصال**: استخدم `redis-cli ping`
3. **فحص التكوين**: تأكد من صحة إعدادات Redis
4. **مراجعة الأخطاء**: راجع ملف `error-solutions.md`

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0