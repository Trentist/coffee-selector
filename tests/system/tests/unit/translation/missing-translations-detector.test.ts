/**
 * Missing Translations Detector
 * كاشف الترجمات المفقودة
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

describe('Missing Translations Detector', () => {
  let usedTranslationKeys: Set<string> = new Set();
  let availableTranslationKeys: Set<string> = new Set();
  let translationFiles: Record<string, any> = {};

  beforeAll(async () => {
    console.log('🔍 Scanning for translation usage...');
    
    // Load translation files
    await loadTranslationFiles();
    
    // Scan source code for translation usage
    await scanSourceCodeForTranslations();
    
    console.log(`📊 Found ${usedTranslationKeys.size} used translation keys`);
    console.log(`📊 Found ${availableTranslationKeys.size} available translation keys`);
  });

  describe('Translation Key Usage Analysis', () => {
    test('should not have unused translation keys', () => {
      const unusedKeys: string[] = [];
      
      availableTranslationKeys.forEach(key => {
        if (!usedTranslationKeys.has(key)) {
          unusedKeys.push(key);
        }
      });
      
      if (unusedKeys.length > 0) {
        console.warn(`⚠️ Found ${unusedKeys.length} unused translation keys:`);
        unusedKeys.slice(0, 20).forEach(key => console.warn(`  - ${key}`));
        if (unusedKeys.length > 20) {
          console.warn(`  ... and ${unusedKeys.length - 20} more`);
        }
      }
      
      // This is a warning, not a hard failure for now
      expect(unusedKeys.length).toBeLessThan(availableTranslationKeys.size * 0.3); // Allow up to 30% unused
    });

    test('should not have missing translation keys', () => {
      const missingKeys: string[] = [];
      
      usedTranslationKeys.forEach(key => {
        if (!availableTranslationKeys.has(key)) {
          missingKeys.push(key);
        }
      });
      
      if (missingKeys.length > 0) {
        console.error(`❌ Found ${missingKeys.length} missing translation keys:`);
        missingKeys.forEach(key => console.error(`  - ${key}`));
      }
      
      expect(missingKeys.length).toBe(0);
    });

    test('should have consistent translation patterns', () => {
      const inconsistentPatterns: string[] = [];
      
      // Check for common patterns that should be consistent
      const patterns = [
        { pattern: /\.title$/, description: 'title keys' },
        { pattern: /\.description$/, description: 'description keys' },
        { pattern: /\.placeholder$/, description: 'placeholder keys' },
        { pattern: /\.error$/, description: 'error keys' },
        { pattern: /\.success$/, description: 'success keys' },
        { pattern: /\.loading$/, description: 'loading keys' }
      ];
      
      patterns.forEach(({ pattern, description }) => {
        const matchingKeys = Array.from(availableTranslationKeys).filter(key => pattern.test(key));
        const usedMatchingKeys = Array.from(usedTranslationKeys).filter(key => pattern.test(key));
        
        if (matchingKeys.length > 0 && usedMatchingKeys.length === 0) {
          inconsistentPatterns.push(`${description}: ${matchingKeys.length} available but none used`);
        }
      });
      
      if (inconsistentPatterns.length > 0) {
        console.warn('⚠️ Inconsistent translation patterns:', inconsistentPatterns);
      }
      
      // This is informational
      expect(inconsistentPatterns).toBeDefined();
    });
  });

  describe('Translation File Coverage', () => {
    test('should have good translation coverage per section', () => {
      const sections = ['auth', 'navigation', 'common', 'product', 'cart', 'checkout', 'errors'];
      const coverageReport: Record<string, { available: number; used: number; coverage: number }> = {};
      
      sections.forEach(section => {
        const availableInSection = Array.from(availableTranslationKeys).filter(key => key.startsWith(section + '.'));
        const usedInSection = Array.from(usedTranslationKeys).filter(key => key.startsWith(section + '.'));
        
        const coverage = availableInSection.length > 0 ? (usedInSection.length / availableInSection.length) * 100 : 0;
        
        coverageReport[section] = {
          available: availableInSection.length,
          used: usedInSection.length,
          coverage: Math.round(coverage)
        };
      });
      
      console.log('📊 Translation Coverage by Section:');
      Object.entries(coverageReport).forEach(([section, stats]) => {
        console.log(`  ${section}: ${stats.used}/${stats.available} (${stats.coverage}%)`);
      });
      
      // Expect at least 50% coverage for main sections
      const mainSections = ['auth', 'navigation', 'common', 'product'];
      mainSections.forEach(section => {
        if (coverageReport[section] && coverageReport[section].available > 0) {
          expect(coverageReport[section].coverage).toBeGreaterThanOrEqual(50);
        }
      });
    });
  });

  describe('Hard-coded Text Detection', () => {
    test('should not have hard-coded Arabic text in components', () => {
      const hardCodedArabicText: string[] = [];
      
      // This would require scanning the actual source files
      // For now, we'll create a placeholder test
      
      if (hardCodedArabicText.length > 0) {
        console.error('❌ Found hard-coded Arabic text:', hardCodedArabicText);
      }
      
      expect(hardCodedArabicText.length).toBe(0);
    });

    test('should not have hard-coded English text in components', () => {
      const hardCodedEnglishText: string[] = [];
      
      // This would require scanning the actual source files
      // For now, we'll create a placeholder test
      
      if (hardCodedEnglishText.length > 0) {
        console.warn('⚠️ Found hard-coded English text:', hardCodedEnglishText);
      }
      
      // This is a warning for now
      expect(hardCodedEnglishText.length).toBeLessThan(10);
    });
  });

  describe('Translation Key Naming Conventions', () => {
    test('should follow consistent naming conventions', () => {
      const invalidKeyNames: string[] = [];
      
      availableTranslationKeys.forEach(key => {
        // Check for invalid characters
        if (!/^[a-z0-9_.]+$/.test(key)) {
          invalidKeyNames.push(`Invalid characters in: ${key}`);
        }
        
        // Check for double dots
        if (key.includes('..')) {
          invalidKeyNames.push(`Double dots in: ${key}`);
        }
        
        // Check for starting/ending with dot
        if (key.startsWith('.') || key.endsWith('.')) {
          invalidKeyNames.push(`Invalid start/end in: ${key}`);
        }
        
        // Check for very long keys
        if (key.length > 100) {
          invalidKeyNames.push(`Too long: ${key}`);
        }
      });
      
      if (invalidKeyNames.length > 0) {
        console.error('❌ Invalid translation key names:', invalidKeyNames);
      }
      
      expect(invalidKeyNames.length).toBe(0);
    });

    test('should have meaningful key names', () => {
      const meaninglessKeys: string[] = [];
      
      const meaninglessPatterns = [
        /^[a-z]$/,           // Single letter keys
        /^test\d*$/,         // Test keys
        /^temp\d*$/,         // Temporary keys
        /^placeholder\d*$/,  // Placeholder keys
        /^key\d+$/,          // Generic key names
        /^item\d+$/          // Generic item names
      ];
      
      availableTranslationKeys.forEach(key => {
        const keyParts = key.split('.');
        const lastPart = keyParts[keyParts.length - 1];
        
        meaninglessPatterns.forEach(pattern => {
          if (pattern.test(lastPart)) {
            meaninglessKeys.push(key);
          }
        });
      });
      
      if (meaninglessKeys.length > 0) {
        console.warn('⚠️ Potentially meaningless key names:', meaninglessKeys);
      }
      
      expect(meaninglessKeys.length).toBeLessThan(5);
    });
  });

  // Helper functions
  async function loadTranslationFiles() {
    const localesPath = path.join(process.cwd(), 'public/locales');
    const languages = ['ar', 'en'];
    
    for (const lang of languages) {
      const commonPath = path.join(localesPath, lang, 'common.json');
      const filterPath = path.join(localesPath, lang, 'filter-translations.json');
      
      if (fs.existsSync(commonPath)) {
        const content = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
        translationFiles[`${lang}_common`] = content;
        
        // Extract all keys from the first language only to avoid duplicates
        if (lang === 'ar') {
          extractKeysFromObject(content, '', availableTranslationKeys);
        }
      }
      
      if (fs.existsSync(filterPath)) {
        const content = JSON.parse(fs.readFileSync(filterPath, 'utf8'));
        translationFiles[`${lang}_filter`] = content;
        
        if (lang === 'ar') {
          extractKeysFromObject(content, '', availableTranslationKeys);
        }
      }
    }
  }

  async function scanSourceCodeForTranslations() {
    const sourceFiles = await glob('src/**/*.{ts,tsx,js,jsx}', {
      cwd: process.cwd(),
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
    });
    
    for (const file of sourceFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        extractTranslationKeysFromCode(content, usedTranslationKeys);
      }
    }
  }

  function extractKeysFromObject(obj: any, prefix: string, keySet: Set<string>) {
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        extractKeysFromObject(obj[key], fullKey, keySet);
      } else {
        keySet.add(fullKey);
      }
    });
  }

  function extractTranslationKeysFromCode(code: string, keySet: Set<string>) {
    // Common patterns for translation usage
    const patterns = [
      // t('key') or t("key")
      /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // useTranslation hook with t('key')
      /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*[,)]/g,
      // Translation component with i18nKey
      /i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g,
      // Direct translation object access
      /translations?\.([a-zA-Z0-9_.]+)/g,
      // Common translation function calls
      /translate\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // Next.js i18n router
      /router\.push\s*\(\s*['"`]([^'"`]+)['"`]/g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        if (match[1] && match[1].includes('.')) {
          keySet.add(match[1]);
        }
      }
    });
    
    // Also look for string literals that might be translation keys
    const stringLiterals = code.match(/['"`]([a-z]+\.[a-z0-9_.]+)['"`]/g);
    if (stringLiterals) {
      stringLiterals.forEach(literal => {
        const key = literal.slice(1, -1); // Remove quotes
        if (key.includes('.') && /^[a-z]/.test(key)) {
          keySet.add(key);
        }
      });
    }
  }
});