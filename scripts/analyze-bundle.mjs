import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Define directories and file paths
const nextConfigPath = path.resolve('next.config.mjs');

/**
 * Parse the current next.config.mjs file
 */
function parseNextConfig() {
  const fileContent = fs.readFileSync(nextConfigPath, 'utf8');
  return fileContent;
}

/**
 * Create a backup of the original config
 */
function backupConfig() {
  const content = parseNextConfig();
  fs.writeFileSync(`${nextConfigPath}.bak`, content, 'utf8');
  console.log('✅ Backed up current next.config.mjs');
}

/**
 * Modify the config to add bundle analyzer plugin
 */
function addBundleAnalyzer() {
  let content = parseNextConfig();
  
  // Add import for bundle analyzer
  content = `import withBundleAnalyzer from '@next/bundle-analyzer';\n${content}`;
  
  // Modify the config object
  content = content.replace(
    'const nextConfig = {', 
    `const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});\n\nconst nextConfig = {`
  );
  
  // Modify the export
  content = content.replace(
    'export default nextConfig;',
    'export default withBundleAnalyzerConfig(nextConfig);'
  );
  
  fs.writeFileSync(nextConfigPath, content, 'utf8');
  console.log('✅ Added bundle analyzer to next.config.mjs');
}

/**
 * Restore the original config
 */
function restoreConfig() {
  if (fs.existsSync(`${nextConfigPath}.bak`)) {
    const originalContent = fs.readFileSync(`${nextConfigPath}.bak`, 'utf8');
    fs.writeFileSync(nextConfigPath, originalContent, 'utf8');
    fs.unlinkSync(`${nextConfigPath}.bak`);
    console.log('✅ Restored original next.config.mjs');
  } else {
    console.error('❌ No backup file found.');
  }
}

/**
 * Install the bundle analyzer package if needed
 */
async function installBundleAnalyzer() {
  return new Promise((resolve, reject) => {
    console.log('📦 Installing @next/bundle-analyzer...');
    exec('npm install --save-dev @next/bundle-analyzer', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) console.error(`stderr: ${stderr}`);
      console.log(stdout);
      console.log('✅ Installed @next/bundle-analyzer');
      resolve();
    });
  });
}

/**
 * Run the bundle analysis
 */
async function runAnalysis() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Running bundle analysis...');
    exec('ANALYZE=true npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) console.error(`stderr: ${stderr}`);
      console.log(stdout);
      console.log('✅ Bundle analysis complete');
      resolve();
    });
  });
}

/**
 * Main function
 */
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--restore')) {
      restoreConfig();
      return;
    }
    
    // Install bundle analyzer if needed
    await installBundleAnalyzer();
    
    // Backup the current config
    backupConfig();
    
    // Add bundle analyzer to the config
    addBundleAnalyzer();
    
    // Run the analysis
    await runAnalysis();
    
    // Restore the original config
    if (!args.includes('--keep')) {
      restoreConfig();
    } else {
      console.log('ℹ️ Keeping the modified config as requested.');
    }
    
    console.log('✨ Bundle analysis completed successfully!');
  } catch (error) {
    console.error('❌ An error occurred:', error);
    // Try to restore the config on error
    try {
      restoreConfig();
    } catch (restoreError) {
      console.error('❌ Could not restore config:', restoreError);
    }
  }
}

main(); 