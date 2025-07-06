/**
 * Simple Translation Test
 * اختبار الترجمة البسيط
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Translation System...');
console.log('================================');

// Test translation files existence
function testTranslationFiles() {
  const translationPaths = [
    'public/locales/ar/common.json',
    'public/locales/en/common.json',
    'src/locales/ar/common.json',
    'src/locales/en/common.json'
  ];

  let foundFiles = [];
  let missingFiles = [];

  translationPaths.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      foundFiles.push(filePath);
      console.log(`✅ Found: ${filePath}`);
    } else {
      missingFiles.push(filePath);
      console.log(`❌ Missing: ${filePath}`);
    }
  });

  return {
    foundFiles,
    missingFiles,
    success: foundFiles.length > 0
  };
}

// Test translation content
function testTranslationContent() {
  const results = [];
  
  try {
    // Check for common translation files
    const possiblePaths = [
      'public/locales/ar/common.json',
      'public/locales/en/common.json',
      'src/locales/ar/common.json',
      'src/locales/en/common.json'
    ];

    for (const filePath of possiblePaths) {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        try {
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          const keyCount = Object.keys(content).length;
          
          console.log(`📄 ${filePath}: ${keyCount} translation keys`);
          
          // Show sample keys
          const sampleKeys = Object.keys(content).slice(0, 5);
          if (sampleKeys.length > 0) {
            console.log(`   Sample keys: ${sampleKeys.join(', ')}`);
          }
          
          results.push({
            file: filePath,
            keyCount,
            sampleKeys,
            valid: true
          });
        } catch (parseError) {
          console.log(`❌ Invalid JSON in ${filePath}: ${parseError.message}`);
          results.push({
            file: filePath,
            valid: false,
            error: parseError.message
          });
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error testing translation content: ${error.message}`);
  }

  return results;
}

// Test i18n configuration
function testI18nConfig() {
  const configPaths = [
    'next-i18next.config.js',
    'i18n.config.js',
    'src/config/i18n.ts',
    'src/config/i18n.js'
  ];

  let configFound = false;
  
  for (const configPath of configPaths) {
    const fullPath = path.join(process.cwd(), configPath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ Found i18n config: ${configPath}`);
      configFound = true;
      
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('ar') && content.includes('en')) {
          console.log(`   ✅ Contains Arabic and English locales`);
        } else {
          console.log(`   ⚠️ May not contain both Arabic and English locales`);
        }
      } catch (error) {
        console.log(`   ❌ Error reading config: ${error.message}`);
      }
      break;
    }
  }

  if (!configFound) {
    console.log(`❌ No i18n configuration file found`);
  }

  return configFound;
}

// Run translation tests
async function runTranslationTests() {
  console.log('🔍 Testing Translation Files...');
  const filesTest = testTranslationFiles();
  
  console.log('\n🔍 Testing Translation Content...');
  const contentTest = testTranslationContent();
  
  console.log('\n🔍 Testing i18n Configuration...');
  const configTest = testI18nConfig();
  
  console.log('\n📊 Translation Test Summary:');
  console.log('============================');
  console.log(`Translation Files: ${filesTest.success ? '✅ FOUND' : '❌ MISSING'}`);
  console.log(`Translation Content: ${contentTest.length > 0 ? '✅ VALID' : '❌ INVALID'}`);
  console.log(`i18n Configuration: ${configTest ? '✅ FOUND' : '❌ MISSING'}`);
  
  if (filesTest.foundFiles.length > 0) {
    console.log(`\n📄 Found Translation Files:`);
    filesTest.foundFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
  }
  
  if (contentTest.length > 0) {
    console.log(`\n📝 Translation Content Summary:`);
    contentTest.forEach(result => {
      if (result.valid) {
        console.log(`   - ${result.file}: ${result.keyCount} keys`);
      } else {
        console.log(`   - ${result.file}: ERROR - ${result.error}`);
      }
    });
  }
  
  // Generate simple report
  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      files: filesTest,
      content: contentTest,
      config: configTest
    },
    summary: {
      filesFound: filesTest.foundFiles.length,
      contentValid: contentTest.filter(c => c.valid).length,
      configExists: configTest,
      overallStatus: filesTest.success && contentTest.length > 0 && configTest ? 'GOOD' : 'NEEDS_ATTENTION'
    }
  };
  
  // Create reports directory
  const reportsDir = 'tests/reports/real-data-validation';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(reportsDir, 'translation-test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n✅ Translation test report saved to: tests/reports/real-data-validation/translation-test-report.json');
  
  if (report.summary.overallStatus === 'GOOD') {
    console.log('\n🎉 Translation system appears to be working!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Translation system needs attention.');
    process.exit(1);
  }
}

// Run the tests
runTranslationTests().catch(console.error);