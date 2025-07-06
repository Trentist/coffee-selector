/**
 * Component Structure Test
 * اختبار هيكل المكونات
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Component Structure...');
console.log('=================================');

// Find all component files
function findComponents(dir, components = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other irrelevant directories
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'tests') {
          findComponents(fullPath, components);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        components.push({
          path: fullPath,
          name: file,
          directory: dir
        });
      }
    });
  } catch (error) {
    // Ignore permission errors
  }
  
  return components;
}

// Analyze component content
function analyzeComponent(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    const analysis = {
      hasReact: content.includes('import React') || content.includes('from "react"') || content.includes('from \'react\''),
      hasChakraUI: content.includes('@chakra-ui') || content.includes('chakra-ui'),
      hasTranslation: content.includes('useTranslation') || content.includes('t(') || content.includes('i18n'),
      hasTypeScript: componentPath.endsWith('.tsx'),
      hasProps: content.includes('interface') && content.includes('Props'),
      hasExport: content.includes('export default') || content.includes('export {'),
      lineCount: content.split('\n').length,
      size: content.length
    };
    
    return analysis;
  } catch (error) {
    return {
      error: error.message,
      valid: false
    };
  }
}

// Test component structure
function testComponentStructure() {
  console.log('🔍 Scanning for components...');
  
  const srcDir = path.join(process.cwd(), 'src');
  const components = findComponents(srcDir);
  
  console.log(`📦 Found ${components.length} component files`);
  
  if (components.length === 0) {
    return {
      success: false,
      components: [],
      message: 'No components found'
    };
  }
  
  // Analyze components
  const analyzed = components.map(comp => {
    const analysis = analyzeComponent(comp.path);
    return {
      ...comp,
      analysis
    };
  });
  
  // Filter valid components
  const validComponents = analyzed.filter(comp => 
    comp.analysis.hasReact && 
    comp.analysis.hasExport && 
    !comp.analysis.error
  );
  
  const chakraComponents = validComponents.filter(comp => comp.analysis.hasChakraUI);
  const translatedComponents = validComponents.filter(comp => comp.analysis.hasTranslation);
  const typescriptComponents = validComponents.filter(comp => comp.analysis.hasTypeScript);
  
  console.log(`✅ Valid React Components: ${validComponents.length}`);
  console.log(`🎨 Using Chakra UI: ${chakraComponents.length}`);
  console.log(`🌐 With Translation: ${translatedComponents.length}`);
  console.log(`📝 TypeScript Components: ${typescriptComponents.length}`);
  
  // Show sample components
  console.log('\n📋 Sample Components:');
  validComponents.slice(0, 10).forEach((comp, index) => {
    const relativePath = comp.path.replace(process.cwd(), '');
    const features = [];
    if (comp.analysis.hasChakraUI) features.push('Chakra');
    if (comp.analysis.hasTranslation) features.push('i18n');
    if (comp.analysis.hasTypeScript) features.push('TS');
    
    console.log(`   ${index + 1}. ${comp.name} (${features.join(', ') || 'Basic'})`);
    console.log(`      Path: ${relativePath}`);
    console.log(`      Lines: ${comp.analysis.lineCount}`);
  });
  
  return {
    success: true,
    total: components.length,
    valid: validComponents.length,
    chakra: chakraComponents.length,
    translated: translatedComponents.length,
    typescript: typescriptComponents.length,
    components: validComponents.slice(0, 20) // Limit for report
  };
}

// Test pages structure
function testPagesStructure() {
  console.log('\n🔍 Testing Pages Structure...');
  
  const pagesDir = path.join(process.cwd(), 'src', 'pages');
  const appDir = path.join(process.cwd(), 'src', 'app');
  
  let pagesFound = [];
  
  // Check pages directory (Pages Router)
  if (fs.existsSync(pagesDir)) {
    const pages = findComponents(pagesDir);
    pagesFound = [...pagesFound, ...pages.map(p => ({ ...p, type: 'pages' }))];
    console.log(`📄 Pages Router: ${pages.length} pages`);
  }
  
  // Check app directory (App Router)
  if (fs.existsSync(appDir)) {
    const appPages = findComponents(appDir);
    pagesFound = [...pagesFound, ...appPages.map(p => ({ ...p, type: 'app' }))];
    console.log(`📱 App Router: ${appPages.length} pages`);
  }
  
  if (pagesFound.length === 0) {
    console.log('❌ No pages found');
    return { success: false, pages: [] };
  }
  
  console.log(`✅ Total Pages: ${pagesFound.length}`);
  
  // Show sample pages
  console.log('\n📋 Sample Pages:');
  pagesFound.slice(0, 8).forEach((page, index) => {
    const relativePath = page.path.replace(process.cwd(), '');
    console.log(`   ${index + 1}. ${page.name} (${page.type})`);
    console.log(`      Path: ${relativePath}`);
  });
  
  return {
    success: true,
    total: pagesFound.length,
    pages: pagesFound.slice(0, 10)
  };
}

// Run component tests
async function runComponentTests() {
  const componentTest = testComponentStructure();
  const pagesTest = testPagesStructure();
  
  console.log('\n📊 Component Test Summary:');
  console.log('==========================');
  console.log(`Components Found: ${componentTest.success ? '✅ YES' : '❌ NO'}`);
  console.log(`Pages Found: ${pagesTest.success ? '✅ YES' : '❌ NO'}`);
  
  if (componentTest.success) {
    console.log(`\n📦 Component Details:`);
    console.log(`   - Total Files: ${componentTest.total}`);
    console.log(`   - Valid Components: ${componentTest.valid}`);
    console.log(`   - Using Chakra UI: ${componentTest.chakra}`);
    console.log(`   - With Translation: ${componentTest.translated}`);
    console.log(`   - TypeScript: ${componentTest.typescript}`);
    
    const qualityScore = Math.round(
      ((componentTest.chakra / componentTest.valid) * 30) +
      ((componentTest.translated / componentTest.valid) * 30) +
      ((componentTest.typescript / componentTest.valid) * 40)
    );
    
    console.log(`   - Quality Score: ${qualityScore}%`);
  }
  
  if (pagesTest.success) {
    console.log(`\n📄 Pages Details:`);
    console.log(`   - Total Pages: ${pagesTest.total}`);
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      components: componentTest,
      pages: pagesTest
    },
    summary: {
      componentsFound: componentTest.success,
      pagesFound: pagesTest.success,
      totalComponents: componentTest.success ? componentTest.valid : 0,
      totalPages: pagesTest.success ? pagesTest.total : 0,
      overallStatus: componentTest.success && pagesTest.success ? 'GOOD' : 'NEEDS_ATTENTION'
    }
  };
  
  // Create reports directory
  const reportsDir = 'tests/reports/real-data-validation';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(reportsDir, 'component-structure-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n✅ Component test report saved to: tests/reports/real-data-validation/component-structure-report.json');
  
  if (report.summary.overallStatus === 'GOOD') {
    console.log('\n🎉 Component structure looks good!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Component structure needs attention.');
    process.exit(1);
  }
}

// Run the tests
runComponentTests().catch(console.error);