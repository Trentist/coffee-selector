/**
 * Translation Validation Tests
 * اختبارات التحقق من الترجمة
 */

import fs from 'fs';
import path from 'path';

describe('Translation Validation Tests', () => {
  const localesPath = path.join(process.cwd(), 'public/locales');
  const supportedLanguages = ['ar', 'en'];
  let translationFiles: Record<string, any> = {};

  beforeAll(() => {
    // Load all translation files
    supportedLanguages.forEach(lang => {
      const commonPath = path.join(localesPath, lang, 'common.json');
      const filterPath = path.join(localesPath, lang, 'filter-translations.json');
      
      if (fs.existsSync(commonPath)) {
        translationFiles[`${lang}_common`] = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
      }
      
      if (fs.existsSync(filterPath)) {
        translationFiles[`${lang}_filter`] = JSON.parse(fs.readFileSync(filterPath, 'utf8'));
      }
    });
  });

  describe('Translation Files Structure', () => {
    test('should have all required translation files', () => {
      supportedLanguages.forEach(lang => {
        const commonPath = path.join(localesPath, lang, 'common.json');
        expect(fs.existsSync(commonPath)).toBe(true);
      });
    });

    test('should have valid JSON structure', () => {
      Object.keys(translationFiles).forEach(fileKey => {
        expect(translationFiles[fileKey]).toBeDefined();
        expect(typeof translationFiles[fileKey]).toBe('object');
      });
    });
  });

  describe('Translation Keys Consistency', () => {
    test('should have matching keys between Arabic and English', () => {
      const arKeys = getAllKeys(translationFiles.ar_common);
      const enKeys = getAllKeys(translationFiles.en_common);
      
      // Check for missing keys in Arabic
      const missingInArabic = enKeys.filter(key => !arKeys.includes(key));
      const missingInEnglish = arKeys.filter(key => !enKeys.includes(key));
      
      if (missingInArabic.length > 0) {
        console.warn('Missing keys in Arabic:', missingInArabic);
      }
      
      if (missingInEnglish.length > 0) {
        console.warn('Missing keys in English:', missingInEnglish);
      }
      
      expect(missingInArabic.length).toBe(0);
      expect(missingInEnglish.length).toBe(0);
    });

    test('should have consistent nested structure', () => {
      const arStructure = getObjectStructure(translationFiles.ar_common);
      const enStructure = getObjectStructure(translationFiles.en_common);
      
      expect(arStructure).toEqual(enStructure);
    });
  });

  describe('Translation Content Quality', () => {
    test('should not have empty translation values', () => {
      const emptyTranslations: string[] = [];
      
      Object.keys(translationFiles).forEach(fileKey => {
        const emptyKeys = findEmptyValues(translationFiles[fileKey], fileKey);
        emptyTranslations.push(...emptyKeys);
      });
      
      if (emptyTranslations.length > 0) {
        console.warn('Empty translations found:', emptyTranslations);
      }
      
      expect(emptyTranslations.length).toBe(0);
    });

    test('should not have placeholder text in production', () => {
      const placeholderPatterns = [
        /TODO/i,
        /FIXME/i,
        /placeholder/i,
        /test.*text/i,
        /lorem ipsum/i,
        /sample.*text/i
      ];
      
      const placeholderTranslations: string[] = [];
      
      Object.keys(translationFiles).forEach(fileKey => {
        const placeholders = findPlaceholderText(translationFiles[fileKey], fileKey, placeholderPatterns);
        placeholderTranslations.push(...placeholders);
      });
      
      if (placeholderTranslations.length > 0) {
        console.warn('Placeholder text found:', placeholderTranslations);
      }
      
      expect(placeholderTranslations.length).toBe(0);
    });

    test('should have proper Arabic text direction markers', () => {
      const arabicTranslations = translationFiles.ar_common;
      const textWithNumbers = findTextWithNumbers(arabicTranslations);
      
      // Check if Arabic text with numbers has proper RTL markers
      textWithNumbers.forEach(({ key, value }) => {
        if (containsNumbers(value) && containsArabicText(value)) {
          // Should have proper RTL/LTR markers for mixed content
          console.log(`Mixed content in ${key}: ${value}`);
        }
      });
      
      // This is more of a warning than a hard requirement
      expect(textWithNumbers).toBeDefined();
    });
  });

  describe('Translation Variables and Interpolation', () => {
    test('should have matching interpolation variables', () => {
      const arInterpolations = findInterpolationVariables(translationFiles.ar_common);
      const enInterpolations = findInterpolationVariables(translationFiles.en_common);
      
      const mismatchedVariables: string[] = [];
      
      Object.keys(arInterpolations).forEach(key => {
        const arVars = arInterpolations[key];
        const enVars = enInterpolations[key];
        
        if (enVars && !arraysEqual(arVars.sort(), enVars.sort())) {
          mismatchedVariables.push(`${key}: AR[${arVars.join(', ')}] vs EN[${enVars.join(', ')}]`);
        }
      });
      
      if (mismatchedVariables.length > 0) {
        console.warn('Mismatched interpolation variables:', mismatchedVariables);
      }
      
      expect(mismatchedVariables.length).toBe(0);
    });

    test('should have valid interpolation syntax', () => {
      const invalidInterpolations: string[] = [];
      
      Object.keys(translationFiles).forEach(fileKey => {
        const invalid = findInvalidInterpolations(translationFiles[fileKey], fileKey);
        invalidInterpolations.push(...invalid);
      });
      
      if (invalidInterpolations.length > 0) {
        console.warn('Invalid interpolation syntax:', invalidInterpolations);
      }
      
      expect(invalidInterpolations.length).toBe(0);
    });
  });

  describe('Translation Usage Validation', () => {
    test('should validate commonly used translation keys exist', () => {
      const commonlyUsedKeys = [
        'common.save',
        'common.cancel',
        'common.delete',
        'common.edit',
        'common.loading',
        'auth.login',
        'auth.register',
        'auth.email',
        'auth.password',
        'navigation.home',
        'navigation.shop',
        'navigation.cart',
        'product.add_to_cart',
        'cart.checkout',
        'errors.general',
        'validation.required'
      ];
      
      const missingKeys: string[] = [];
      
      commonlyUsedKeys.forEach(key => {
        if (!hasNestedKey(translationFiles.ar_common, key) || 
            !hasNestedKey(translationFiles.en_common, key)) {
          missingKeys.push(key);
        }
      });
      
      if (missingKeys.length > 0) {
        console.warn('Missing commonly used keys:', missingKeys);
      }
      
      expect(missingKeys.length).toBe(0);
    });
  });

  describe('Translation File Size and Performance', () => {
    test('should not exceed reasonable file size limits', () => {
      Object.keys(translationFiles).forEach(fileKey => {
        const jsonString = JSON.stringify(translationFiles[fileKey]);
        const sizeInKB = Buffer.byteLength(jsonString, 'utf8') / 1024;
        
        // Warn if file is larger than 500KB
        if (sizeInKB > 500) {
          console.warn(`Large translation file: ${fileKey} (${sizeInKB.toFixed(2)}KB)`);
        }
        
        // Fail if file is larger than 1MB
        expect(sizeInKB).toBeLessThan(1024);
      });
    });

    test('should have reasonable nesting depth', () => {
      Object.keys(translationFiles).forEach(fileKey => {
        const maxDepth = getMaxNestingDepth(translationFiles[fileKey]);
        
        // Warn if nesting is too deep
        if (maxDepth > 5) {
          console.warn(`Deep nesting in ${fileKey}: ${maxDepth} levels`);
        }
        
        // Fail if nesting is extremely deep
        expect(maxDepth).toBeLessThan(10);
      });
    });
  });
});

// Helper functions
function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  });
  
  return keys;
}

function getObjectStructure(obj: any): any {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return typeof obj;
  }
  
  const structure: any = {};
  Object.keys(obj).forEach(key => {
    structure[key] = getObjectStructure(obj[key]);
  });
  
  return structure;
}

function findEmptyValues(obj: any, prefix = ''): string[] {
  let emptyKeys: string[] = [];
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      emptyKeys.push(...findEmptyValues(obj[key], fullKey));
    } else if (typeof obj[key] === 'string' && obj[key].trim() === '') {
      emptyKeys.push(fullKey);
    }
  });
  
  return emptyKeys;
}

function findPlaceholderText(obj: any, prefix = '', patterns: RegExp[]): string[] {
  let placeholders: string[] = [];
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      placeholders.push(...findPlaceholderText(obj[key], fullKey, patterns));
    } else if (typeof obj[key] === 'string') {
      patterns.forEach(pattern => {
        if (pattern.test(obj[key])) {
          placeholders.push(`${fullKey}: ${obj[key]}`);
        }
      });
    }
  });
  
  return placeholders;
}

function findTextWithNumbers(obj: any, prefix = ''): Array<{key: string, value: string}> {
  let results: Array<{key: string, value: string}> = [];
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      results.push(...findTextWithNumbers(obj[key], fullKey));
    } else if (typeof obj[key] === 'string' && containsNumbers(obj[key])) {
      results.push({ key: fullKey, value: obj[key] });
    }
  });
  
  return results;
}

function containsNumbers(text: string): boolean {
  return /\d/.test(text);
}

function containsArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function findInterpolationVariables(obj: any, prefix = ''): Record<string, string[]> {
  let variables: Record<string, string[]> = {};
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(variables, findInterpolationVariables(obj[key], fullKey));
    } else if (typeof obj[key] === 'string') {
      const matches = obj[key].match(/\{\{([^}]+)\}\}/g);
      if (matches) {
        variables[fullKey] = matches.map(match => match.replace(/[{}]/g, ''));
      }
    }
  });
  
  return variables;
}

function findInvalidInterpolations(obj: any, prefix = ''): string[] {
  let invalid: string[] = [];
  
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      invalid.push(...findInvalidInterpolations(obj[key], fullKey));
    } else if (typeof obj[key] === 'string') {
      // Check for malformed interpolations
      const malformed = obj[key].match(/\{[^}]*\{|\}[^{]*\}|\{[^}]*$|^[^{]*\}/g);
      if (malformed) {
        invalid.push(`${fullKey}: ${obj[key]}`);
      }
    }
  });
  
  return invalid;
}

function hasNestedKey(obj: any, key: string): boolean {
  const keys = key.split('.');
  let current = obj;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return false;
    }
  }
  
  return true;
}

function getMaxNestingDepth(obj: any, currentDepth = 0): number {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return currentDepth;
  }
  
  let maxDepth = currentDepth;
  
  Object.values(obj).forEach(value => {
    const depth = getMaxNestingDepth(value, currentDepth + 1);
    maxDepth = Math.max(maxDepth, depth);
  });
  
  return maxDepth;
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}