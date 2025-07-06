/**
 * Translation Paths Validator
 * مدقق مسارات الترجمة
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

describe('Translation Paths Validator', () => {
  let sourceFiles: string[] = [];
  let translationKeys: Set<string> = new Set();
  let invalidPaths: Array<{file: string, line: number, path: string, issue: string}> = [];

  beforeAll(async () => {
    console.log('🔍 Scanning source files for translation paths...');
    
    // Load available translation keys
    await loadTranslationKeys();
    
    // Get all source files
    sourceFiles = await glob('src/**/*.{ts,tsx,js,jsx}', {
      cwd: process.cwd(),
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
    });
    
    // Validate translation paths in each file
    await validateTranslationPaths();
    
    console.log(`📊 Scanned ${sourceFiles.length} source files`);
    console.log(`📊 Found ${translationKeys.size} available translation keys`);
  });

  describe('Translation Path Validation', () => {
    test('should not have invalid translation paths', () => {
      const pathErrors = invalidPaths.filter(item => item.issue === 'invalid_path');
      
      if (pathErrors.length > 0) {
        console.error('❌ Invalid translation paths found:');
        pathErrors.forEach(error => {
          console.error(`  ${error.file}:${error.line} - "${error.path}"`);
        });
      }
      
      expect(pathErrors.length).toBe(0);
    });

    test('should not have malformed translation keys', () => {
      const malformedErrors = invalidPaths.filter(item => item.issue === 'malformed');
      
      if (malformedErrors.length > 0) {
        console.error('❌ Malformed translation keys found:');
        malformedErrors.forEach(error => {
          console.error(`  ${error.file}:${error.line} - "${error.path}"`);
        });
      }
      
      expect(malformedErrors.length).toBe(0);
    });

    test('should not have empty translation keys', () => {
      const emptyErrors = invalidPaths.filter(item => item.issue === 'empty');
      
      if (emptyErrors.length > 0) {
        console.error('❌ Empty translation keys found:');
        emptyErrors.forEach(error => {
          console.error(`  ${error.file}:${error.line} - "${error.path}"`);
        });
      }
      
      expect(emptyErrors.length).toBe(0);
    });

    test('should not have deprecated translation keys', () => {
      const deprecatedKeys = [
        'old_auth.login',
        'deprecated.message',
        'temp.placeholder',
        'test.key'
      ];
      
      const deprecatedErrors = invalidPaths.filter(item => 
        deprecatedKeys.includes(item.path)
      );
      
      if (deprecatedErrors.length > 0) {
        console.warn('⚠️ Deprecated translation keys found:');
        deprecatedErrors.forEach(error => {
          console.warn(`  ${error.file}:${error.line} - "${error.path}"`);
        });
      }
      
      expect(deprecatedErrors.length).toBe(0);
    });
  });

  describe('Translation Usage Patterns', () => {
    test('should use consistent translation patterns', () => {
      const inconsistentPatterns: Array<{file: string, line: number, pattern: string}> = [];
      
      // Check for inconsistent usage patterns
      for (const file of sourceFiles) {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          
          lines.forEach((line, index) => {
            // Check for mixed translation patterns
            if (line.includes('t(') && line.includes('translate(')) {
              inconsistentPatterns.push({
                file,
                line: index + 1,
                pattern: 'Mixed t() and translate() in same line'
              });
            }
            
            // Check for hardcoded strings that should be translated
            const hardcodedArabic = line.match(/['"`][\u0600-\u06FF][^'"`]*['"`]/g);
            if (hardcodedArabic && !line.includes('//') && !line.includes('console.')) {
              inconsistentPatterns.push({
                file,
                line: index + 1,
                pattern: `Hardcoded Arabic text: ${hardcodedArabic.join(', ')}`
              });
            }
            
            // Check for hardcoded English that might need translation
            const suspiciousEnglish = line.match(/['"`][A-Z][a-zA-Z\s]{10,}['"`]/g);
            if (suspiciousEnglish && !line.includes('//') && !line.includes('console.') && !line.includes('import')) {
              inconsistentPatterns.push({
                file,
                line: index + 1,
                pattern: `Potential hardcoded English: ${suspiciousEnglish.join(', ')}`
              });
            }
          });
        }
      }
      
      if (inconsistentPatterns.length > 0) {
        console.warn('⚠️ Inconsistent translation patterns:');
        inconsistentPatterns.slice(0, 10).forEach(pattern => {
          console.warn(`  ${pattern.file}:${pattern.line} - ${pattern.pattern}`);
        });
        if (inconsistentPatterns.length > 10) {
          console.warn(`  ... and ${inconsistentPatterns.length - 10} more`);
        }
      }
      
      // Allow some inconsistencies but not too many
      expect(inconsistentPatterns.length).toBeLessThan(20);
    });

    test('should have proper translation hook usage', () => {
      const hookUsageErrors: Array<{file: string, line: number, issue: string}> = [];
      
      for (const file of sourceFiles) {
        if (!file.endsWith('.tsx') && !file.endsWith('.jsx')) continue;
        
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          
          let hasUseTranslation = false;
          let hasTranslationUsage = false;
          
          lines.forEach((line, index) => {
            if (line.includes('useTranslation') || line.includes('useUnifiedTranslation')) {
              hasUseTranslation = true;
            }
            
            if (line.includes('t(') && !line.includes('//')) {
              hasTranslationUsage = true;
            }
          });
          
          // If using t() but no useTranslation hook
          if (hasTranslationUsage && !hasUseTranslation) {
            hookUsageErrors.push({
              file,
              line: 1,
              issue: 'Using t() without useTranslation hook'
            });
          }
        }
      }
      
      if (hookUsageErrors.length > 0) {
        console.error('❌ Translation hook usage errors:');
        hookUsageErrors.forEach(error => {
          console.error(`  ${error.file} - ${error.issue}`);
        });
      }
      
      expect(hookUsageErrors.length).toBe(0);
    });
  });

  describe('Translation File Structure Validation', () => {
    test('should have valid translation file structure', () => {
      const localesPath = path.join(process.cwd(), 'public/locales');
      const requiredFiles = [
        'ar/common.json',
        'en/common.json',
        'ar/filter-translations.json',
        'en/filter-translations.json'
      ];
      
      const missingFiles: string[] = [];
      
      requiredFiles.forEach(file => {
        const filePath = path.join(localesPath, file);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(file);
        }
      });
      
      if (missingFiles.length > 0) {
        console.error('❌ Missing translation files:', missingFiles);
      }
      
      expect(missingFiles.length).toBe(0);
    });

    test('should have valid JSON structure in translation files', () => {
      const localesPath = path.join(process.cwd(), 'public/locales');
      const jsonErrors: string[] = [];
      
      const translationFiles = [
        'ar/common.json',
        'en/common.json',
        'ar/filter-translations.json',
        'en/filter-translations.json'
      ];
      
      translationFiles.forEach(file => {
        const filePath = path.join(localesPath, file);
        if (fs.existsSync(filePath)) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
          } catch (error) {
            jsonErrors.push(`${file}: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
          }
        }
      });
      
      if (jsonErrors.length > 0) {
        console.error('❌ JSON structure errors:', jsonErrors);
      }
      
      expect(jsonErrors.length).toBe(0);
    });
  });

  describe('Translation Performance Validation', () => {
    test('should not have excessive translation calls in loops', () => {
      const performanceIssues: Array<{file: string, line: number, issue: string}> = [];
      
      for (const file of sourceFiles) {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          
          let inLoop = false;
          let loopDepth = 0;
          
          lines.forEach((line, index) => {
            // Detect loop structures
            if (line.includes('.map(') || line.includes('.forEach(') || 
                line.includes('for (') || line.includes('while (')) {
              inLoop = true;
              loopDepth++;
            }
            
            if (line.includes('}') && inLoop) {
              loopDepth--;
              if (loopDepth <= 0) {
                inLoop = false;
                loopDepth = 0;
              }
            }
            
            // Check for translation calls inside loops
            if (inLoop && line.includes('t(') && !line.includes('//')) {
              performanceIssues.push({
                file,
                line: index + 1,
                issue: 'Translation call inside loop - consider moving outside'
              });
            }
          });
        }
      }
      
      if (performanceIssues.length > 0) {
        console.warn('⚠️ Potential performance issues:');
        performanceIssues.slice(0, 5).forEach(issue => {
          console.warn(`  ${issue.file}:${issue.line} - ${issue.issue}`);
        });
      }
      
      // Allow some but warn about excessive usage
      expect(performanceIssues.length).toBeLessThan(10);
    });
  });

  // Helper functions
  async function loadTranslationKeys() {
    const localesPath = path.join(process.cwd(), 'public/locales');
    const commonPath = path.join(localesPath, 'ar/common.json');
    const filterPath = path.join(localesPath, 'ar/filter-translations.json');
    
    if (fs.existsSync(commonPath)) {
      const content = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
      extractKeysFromObject(content, '');
    }
    
    if (fs.existsSync(filterPath)) {
      const content = JSON.parse(fs.readFileSync(filterPath, 'utf8'));
      extractKeysFromObject(content, '');
    }
  }

  function extractKeysFromObject(obj: any, prefix: string) {
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        extractKeysFromObject(obj[key], fullKey);
      } else {
        translationKeys.add(fullKey);
      }
    });
  }

  async function validateTranslationPaths() {
    for (const file of sourceFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        validateFileTranslationPaths(file, content);
      }
    }
  }

  function validateFileTranslationPaths(file: string, content: string) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Find translation key usage patterns
      const patterns = [
        /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
        /i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g,
        /translate\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const translationPath = match[1];
          
          // Validate the translation path
          if (!translationPath || translationPath.trim() === '') {
            invalidPaths.push({
              file,
              line: index + 1,
              path: translationPath,
              issue: 'empty'
            });
          } else if (!isValidTranslationKey(translationPath)) {
            invalidPaths.push({
              file,
              line: index + 1,
              path: translationPath,
              issue: 'malformed'
            });
          } else if (!translationKeys.has(translationPath)) {
            invalidPaths.push({
              file,
              line: index + 1,
              path: translationPath,
              issue: 'invalid_path'
            });
          }
        }
      });
    });
  }

  function isValidTranslationKey(key: string): boolean {
    // Check basic format
    if (!/^[a-z0-9_.]+$/.test(key)) {
      return false;
    }
    
    // Check for double dots
    if (key.includes('..')) {
      return false;
    }
    
    // Check for starting/ending with dot
    if (key.startsWith('.') || key.endsWith('.')) {
      return false;
    }
    
    // Check minimum structure (should have at least one dot)
    if (!key.includes('.')) {
      return false;
    }
    
    return true;
  }
});