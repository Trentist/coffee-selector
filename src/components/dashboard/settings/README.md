# Settings Page Documentation
# توثيق صفحة الإعدادات

## Overview | نظرة عامة

This is a comprehensive settings page for the Coffee Selection application, providing users with complete control over their account, privacy, preferences, and security settings.

هذه صفحة إعدادات شاملة لتطبيق Coffee Selection، توفر للمستخدمين تحكماً كاملاً في حساباتهم وخصوصيتهم وتفضيلاتهم وإعدادات الأمان.

## Features | الميزات

### ✅ Completed Sections | الأقسام المكتملة

1. **Account & Security | الحساب والأمان**
   - Profile settings with form validation
   - Two-factor authentication setup
   - Login notifications
   - Device management

2. **Privacy & Data | الخصوصية والبيانات**
   - Privacy controls
   - Data sharing preferences
   - Notification preferences
   - Data export functionality
   - Account deletion with confirmation

3. **General Preferences | التفضيلات العامة**
   - Language and region settings
   - Currency preferences
   - Display settings (theme, density, animations)
   - Interface preferences

4. **Orders & Shipping | الطلبات والشحن**
   - Shipping preferences
   - Order notifications
   - Return settings
   - Saved addresses management

5. **Communications | الاتصالات**
   - Email preferences with frequency control
   - SMS notifications
   - Push notifications
   - Notification timing
   - Sound and vibration settings
   - Marketing preferences

6. **Advanced Security | الأمان المتقدم**
   - Device management with session control
   - Security alerts configuration
   - Account lock settings
   - Activity log viewing
   - Emergency access setup

## Architecture | البنية

### File Structure | هيكل الملفات

```
settings-details/
├── index.tsx                    # Main settings page
├── sections/                   # Settings sections
│   ├── account-security.tsx
│   ├── privacy-data.tsx
│   ├── general-preferences.tsx
│   ├── orders-shipping.tsx
│   ├── communications.tsx
│   └── advanced-security.tsx
├── components/                 # Reusable components
│   ├── setting-section.tsx
│   ├── setting-toggle.tsx
│   ├── setting-select.tsx
│   └── setting-input.tsx
├── hooks/                      # Custom hooks
│   ├── use-settings.ts
│   ├── use-privacy.ts
│   └── use-notifications.ts
└── services/                   # GraphQL services
    ├── settings-queries.ts
    ├── settings-mutations.ts
    └── odoo-settings.service.ts
```

### Components | المكونات

#### Main Components | المكونات الرئيسية

- **EnhancedSettingsDetails**: Main settings page with responsive design
- **SettingSection**: Reusable section wrapper with collapsible functionality
- **SettingToggle**: Toggle switch component with loading states
- **SettingSelect**: Dropdown selection component
- **SettingInput**: Input field component with validation

#### Hooks | الخطافات

- **useSettings**: Main settings management hook
- **usePrivacy**: Privacy settings management
- **useNotifications**: Notification preferences management

### GraphQL Integration | تكامل GraphQL

The settings page is fully integrated with GraphQL for:
- Fetching user settings and preferences
- Updating settings with real-time validation
- Managing user sessions and devices
- Exporting user data
- Account deletion requests

## Responsive Design | التصميم المتجاوب

The settings page features:
- **Desktop**: Sidebar navigation with main content area
- **Mobile**: Tab-based navigation with full-screen sections
- **Animations**: Smooth transitions using Framer Motion
- **Theme Support**: Light/dark mode compatibility

## Security Features | ميزات الأمان

- **Two-Factor Authentication**: Complete 2FA setup with QR codes
- **Device Management**: View and revoke device sessions
- **Activity Logging**: Comprehensive activity tracking
- **Emergency Access**: Secure emergency account access
- **Data Export**: GDPR-compliant data export
- **Account Deletion**: Secure account deletion with confirmation

## Internationalization | التدويل

Full support for Arabic and English languages:
- All text content is translatable
- RTL/LTR layout support
- Localized date and time formats
- Currency localization

## Usage | الاستخدام

### Basic Usage | الاستخدام الأساسي

```tsx
import SettingsDetails from '@/components/pages-details/dashboard-page/settings-details';

// In your dashboard page
<SettingsDetails />
```

### Custom Hook Usage | استخدام الخطافات المخصصة

```tsx
import { useSettings } from './hooks/use-settings';

const MyComponent = () => {
  const { settings, updatePreferences, isLoading } = useSettings();
  
  const handleUpdate = async (newSettings) => {
    await updatePreferences(newSettings);
  };
  
  return (
    // Your component JSX
  );
};
```

## API Integration | تكامل API

### GraphQL Queries | استعلامات GraphQL

```graphql
query GetUserSettings($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    preferences {
      language
      currency
      notifications {
        email
        sms
        push
      }
      privacy {
        dataSharing
        marketing
        analytics
      }
      security {
        twoFactorEnabled
        sessionTimeout
        deviceManagement
      }
    }
  }
}
```

### Mutations | الطفرات

```graphql
mutation UpdateUserPreferences($userId: ID!, $preferences: PreferencesInput!) {
  updateUserPreferences(userId: $userId, preferences: $preferences) {
    success
    message
    user {
      preferences {
        # Updated preferences
      }
    }
  }
}
```

## Testing | الاختبار

The settings page includes:
- Unit tests for all components
- Integration tests for GraphQL operations
- E2E tests for critical user flows
- Accessibility testing

## Performance | الأداء

Optimizations include:
- Lazy loading of sections
- Debounced form updates
- Optimistic UI updates
- Efficient re-rendering with React.memo

## Accessibility | إمكانية الوصول

- Full keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels and descriptions

## Browser Support | دعم المتصفحات

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing | المساهمة

When adding new settings:
1. Create the section component in `sections/`
2. Add translations to both Arabic and English
3. Update the main settings page
4. Add appropriate GraphQL queries/mutations
5. Include tests for new functionality

## Future Enhancements | التحسينات المستقبلية

- Advanced notification scheduling
- Bulk settings import/export
- Settings backup and restore
- Advanced privacy controls
- Integration with external services

---

**Note**: This settings page follows the application's design system and maintains consistency with other dashboard components.

**ملاحظة**: تتبع صفحة الإعدادات هذه نظام التصميم الخاص بالتطبيق وتحافظ على الاتساق مع مكونات لوحة التحكم الأخرى.